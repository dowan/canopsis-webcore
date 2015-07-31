/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
#
# This file is part of Canopsis.
#
# Canopsis is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Canopsis is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/

define([
    'app/lib/factories/widget',
    'app/lib/utils/data',
    'app/lib/utils/forms',
    'app/lib/loaders/schemas',
    'app/lib/utils/notification',
    'canopsis/widgetCalendar/lib/utils/moment/min/moment.min',
    'canopsis/widgetCalendar/lib/utils/fullcalendar/dist/fullcalendar.min'
], function(WidgetFactory, dataUtils, formUtils, schemasUtils, notificationUtils, moment, WidgetCalendar) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    /**
     *  VIEW BEGINING --- MIXIN
     */

    var viewMixin = Ember.Mixin.create({

        /**
         *  @method addEventCalendar: add a new fullcalendar eventSource
         *  @param calendarTab: eventSource as an array formated for fullCalendar
         */
        addEventCalendar: function(calendarTab) {
             // TODO find other solution: on refresh of the mixin this.$('.calendar') is undefined...
            console.log('sur le point d\'ajouter', calendarTab);
            var calendar = this.$('.calendar');
            if(calendar === undefined){
                return;
            }

            this.$('.calendar').fullCalendar( 'addEventSource', {
                events: calendarTab
            });
        },

        /**
         *  @method removeEventCalendar: remove a old fullcalendar eventSource
         *  @param calendarTab: eventSource as an array formated for fullCalendar
         */
        removeEventCalendar: function(calendarTab){
            console.log('supprimer eventcalendar');
            this.$('.calendar').fullCalendar( 'removeEventSource', {
                    events: calendarTab
                });
        },

        /**
         * @method didInsertElement: create the fullcalendar at the beginning and catch every changed view
         */
        didInsertElement: function() {

            var globalView = this;
            globalView._super();

            calendarTab = [];
            var calendar = globalView.$('.calendar');

            // Create fullCalendar
            calendar.fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                fixedWeekCount : false,
                editable: false,
                eventLimit: true,
                lazyFetching: false,
                viewRender: function(month, calendar) {
                    var controller = get(globalView, "controller");
                    var calview = globalView.$('.calendar').fullCalendar('getView');

                    set(controller, 'calendarStart', moment(calview.start.format()).format('x')/1000);
                    set(controller, 'calendarEnd', moment(calview.end.format()).format('x')/1000);

                    var calTab = get(controller, 'calendarTab');
                    var eventLogTab = get(controller, 'eventsLog');
                    if(calTab === undefined){
                        calTab = [];
                    }
                    globalView.removeEventCalendar(calTab);
                    globalView.removeEventCalendar(eventLogTab);
                    if (get(controller, 'calendarStart') !== undefined){
                        controller.loadCalendarEvents();
                        controller.refreshContent();
                    }
                },
                eventSources: [
                    {
                        events: calendarTab
                    }
                ]
            });
            var controller = get(globalView, "controller");

            // Sync controller and view for addEventCalendar event
            var ctrl = get(this, "controller");
            ctrl.on('addEventCalendar',this, this.addEventCalendar);
            ctrl.on('removeEventCalendar',this, this.removeEventCalendar);
        },

        willDestroyElement: function() {
            this._super();
            this.$('.calendar').fullCalendar('destroy');
            this.off('addEventCalendar',this, this.addEventCalendar);
        }
    });


    /**
     *  WIDGET BEGINING --- CONTROLLER
     */
    var widget = WidgetFactory('calendar',{

        viewMixins: [
            viewMixin
        ],

        init: function() {
            this._super.apply(this, arguments);
            set(this, 'store', DS.Store.extend({
                container: get(this, 'container')
            }));

            //TODO REMOVE!! --- actually needful to get the customfilterlist
            set(this, 'rights', {list_filters: {checksum: true}});

        },

        saveUserConfiguration: function(){},

        refreshContent: function() {
            this._super();
            //TODO find a way to get filterlist and determine if one of them is active or not!
            var filterFragments = this.computeFilterFragmentsList();
            console.log('debug computeFilterFragmentsList', filterFragments);

            /*console.log('computeFilterFragmentsList', filterFragments[0]);*/
            console.log('length of filterFragments', filterFragments.length);

            if(typeof filterFragments[1] === "string"){
                this.trigger('removeEventCalendar', get(this, 'eventsLog'));
                set(this, 'descriptionFilter', filterFragments[1]);
                this.loadEventsLog();
            }
        },

        /**
         * @method loadCalendarEvents: similar to findItems, get data form backend
         */
        loadCalendarEvents: function() {

            var controller = this;
            var initialized = get(controller, 'fullCalendarInitialized');

            var store = get(controller, 'widgetDataStore');

            /** query to select events (by filters) */
            controller.getDateCalendarView();

            var userEventsParams = {
                dtstart: get(this, 'calendarStart'),
                dtend: get(this, 'calendarEnd')
            };

             /** get data from storage and refresh view by calling "addEventCalendar" */
            store.findQuery('calendardata', userEventsParams).then(function (result) {

                var events = get(result, 'content'),
                    calendarTab = [],
                    eventslength = events.length;

                for (var i = 0, li = eventslength; i < li; i++) {
                    var formated_cevent = controller.getCalendarEvent(events[i]);
                    calendarTab.pushObject(formated_cevent);
                }
                console.log('je vais ajouter les calendriers');
                controller.trigger('addEventCalendar', calendarTab);
                set(controller,'calendarTab', calendarTab);
            });
        },

        loadEventsLog: function(){
            var controller = this;
            var store = get(controller, 'widgetDataStore');
            controller.getDateCalendarView();

            console.log('date pour filtre eventsLog', get(this, 'calendarStart'), get(this, 'calendarEnd'));

            var mongoQuery = get(controller, 'descriptionFilter');

            var eventsLogParams = {};

            if (mongoQuery === "") {

                eventsLogParams = {
                    tstart: get(this, 'calendarStart'),
                    tstop: get(this, 'calendarEnd'),
                    limit: 100
                };
            } else {
                eventsLogParams = {
                    tstart: get(this, 'calendarStart'),
                    tstop: get(this, 'calendarEnd'),
                    limit: 100,
                    select: mongoQuery
                };
            }

            console.log('display of eventsLogParams', eventsLogParams);

            store.findQuery('calendarday', eventsLogParams).then(function (result) {
                var contentsCount = get(result, 'content');
                var countlength = contentsCount.length,
                    calendarTab = [];

                for (var i = 0; i < countlength; i++) {
                    var count = get(contentsCount[i], 'count');
                    var date = get(contentsCount[i], 'date');
                    console.log('valeur de count et de date', count, date);
                    if(count !== 0) {
                        console.log('coucou');
                        var formated_eventsLogCount = controller.getEventsLogCount(count, date);
                        calendarTab.pushObject(formated_eventsLogCount);
                    }
                }
                console.log('je vais ajouter les logs');
                controller.trigger('addEventCalendar', calendarTab);
                set(controller,'eventsLog', calendarTab);

            });
        },

        computeFilterFragmentsList: function() {
            return [undefined];
        },

        /**
         * @method getDateCalendarView: set date view with the actual month if undefined
         */
        getDateCalendarView: function () {
            if(get(this, 'calendarStart') ===  undefined) {
                set(this, 'calendarStart', parseInt(moment().startOf('month').format('x')/1000));
            }
            if(get(this, 'calendarEnd') === undefined) {
                set(this, 'calendarEnd', parseInt(moment().endOf('month').format('x')/1000));
            }
        },

        /**
         *  @method getCalendarEvent: format the calendar event for fullCalendar
         *  @param cevent: object that contains event to format
         *  @return object
         */
        getCalendarEvent: function (cevent) {
            return {
                title: get(cevent, 'output'),
                start: moment(get(cevent, 'dtstart')*1000).format(),
                end: moment(get(cevent, 'dtend')*1000).format()
            };
        },

        /**
         * @method getEventsLogCount: format the eventsLog count for fullCalendar
         * @param count: count: integer that represents the count of events log relative to the given
         * @param date: object that contains a 'begin' timestamp attribute and a 'end' timestamp attribute
         * @return object
         */
        getEventsLogCount: function (count, date) {
            console.log('recoucou');
            var title = '';
            if ( count > 100) {
                title = ' ' + get(this, 'titleFilter') + ' more than 100';
            }
            else {
                title = ' ' + get(this, 'titleFilter') + ' x' + count;
            }
            return {
                title: title,
                start: moment(get(date, 'begin')*1000).format(),
                end: moment(get(date, 'end')*1000).format()
            };
        },

        actions:{
            /**
             *  @method createEvent: create an user event from the "add event" form in the widget
             */
            createEvent: function() {

                var controller = this;
                var store = get(controller, 'widgetDataStore');

                store.findQuery('eventcategories', {}).then(function(queryResults) {

                    var eventCategoriesRecord = get(queryResults, 'content')[0];

                    var eventcategories = get(eventCategoriesRecord, 'eventcategories');
                    console.log('eventcategories', eventcategories);
                    var eventCalendarRecord = dataUtils.getStore().createRecord('calendardata', {
                        crecord_type: 'calendardata',
                        eventcategories: eventcategories
                    });
                    var recordWizard = formUtils.showNew('modelform', eventCalendarRecord, {
                        title: __('Create a new calendar event')
                    });

                    // creation of the event and inform the user of this action by a message
                    recordWizard.submit.then(function(form){
                        eventCalendarRecord = form.get('formContext');
                        var beginDate = get(eventCalendarRecord, 'dtstart');
                        var endDate = get(eventCalendarRecord, 'dtend');
                        if (beginDate > endDate) {
                            console.log('the starting date is after the ending date');
                            controller.showUserMessage(
                                'Creation problem: dates are not correct',
                                'warning'
                            );
                        }
                        else {
                            eventCalendarRecord.save().then(function(){
                                controller.showUserMessage(
                                    'Event save success',
                                    'success'
                                );
                                controller.loadCalendarEvents();
                            });
                        }
                        notificationUtils.info(__('event calendar created'));
                    });
                });
            },

            /**
             * @method editCategories: open a form to edit eventcategories
             */
            editCategories: function () {
                var container = get(this, 'container');
                formUtils.editSchemaRecord('eventcategories', container);
            }
        },

        /**
         *  @method showUserMessage: inform the user about the last action made
         *  @param message: string that is the information about the action to inform
         *  @param level: string that indicate the information level (for Bootstrap color element)
         */
        showUserMessage: function (message, level) {
            var controller = this;
            set(controller, 'errorMessage', message);
            set(controller, 'errorLevel', 'alert-' + level);
            setTimeout(function () {
                set(controller, 'errorMessage', '');
                set(controller, 'errorLevel', '');
            },3000);
        }
    });

    return widget;
});
