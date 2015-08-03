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
     * This is the widget calendar view mixin
     *
     * @class viewMixin
     */
    var viewMixin = Ember.Mixin.create({

        /**
         * add a new fullcalendar eventSource
         * @method addEventCalendar
         * @param calendarTab: eventSource as an array formated for fullCalendar
         */
        addEventCalendar: function(calendarTab, backgroundColor, textColor) {
             // TODO find other solution: on refresh of the mixin this.$('.calendar') is undefined...
            var calendar = this.$('.calendar');
            if(calendar === undefined){
                return;
            }

            this.$('.calendar').fullCalendar( 'addEventSource', {
                events: calendarTab,
                color: backgroundColor,
                textColor: textColor
            });
        },

        /**
         * remove a old fullcalendar eventSource
         * @method removeEventCalendar
         * @param calendarTab: eventSource as an array formated for fullCalendar
         */
        removeEventCalendar: function(calendarTab){
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
                    if(calTab === undefined)
                        calTab = [];
                    globalView.removeEventCalendar(calTab);
                    globalView.removeEventCalendar(eventLogTab);
                    if (get(controller, 'calendarStart') !== undefined){
                        controller.loadCalendarEvents();
                        controller.getMixinFilter();
                    }
                },
                eventSources: [
                    {
                        events: calendarTab
                    }
                ]
            });
            var controller = get(globalView, "controller");
            set(controller, 'fullCalendarInitialized', true);
            // Sync controller and view for addEventCalendar event
            var ctrl = get(this, "controller");
            ctrl.on('addEventCalendar',this, this.addEventCalendar);
            ctrl.on('removeEventCalendar',this, this.removeEventCalendar);
            ctrl.on('willDestroyElement',this, this.willDestroyElement);
            ctrl.on('didInsertElement',this, this.didInsertElement);
        },

        willDestroyElement: function() {
            this._super();
            this.$('.calendar').fullCalendar('destroy');
            this.off('addEventCalendar',this, this.addEventCalendar);
        }
    });


    /**
     * This is the widget calendar controller
     *
     * @class widget
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

        /**
         * @method refreshContent: refresh the view by calling the didInsertElement method
         */
        refreshContent: function(){
            this._super();
            var controller = this;
            controller.trigger('willDestroyElement');
            controller.trigger('didInsertElement');
        },

        /**
         * get the user filter created thanks to the customfilterlist mixin
         * then, call loadEventsLog method to query events related to this filter.
         * @method getMixinFilter
         */
        getMixinFilter: function() {
            this._super();
            var controller = this;
            var filterFragments = this.computeFilterFragmentsList();
            console.log('debug computeFilterFragmentsList', filterFragments);

            if(typeof filterFragments[1] === "string"){
                this.trigger('removeEventCalendar', get(this, 'eventsLog'));
                set(this, 'descriptionFilter', filterFragments[1]);

                var widgetMixins = get(controller, 'model.mixins');
                var widgetMixinsLength = widgetMixins.length;

                for (var i = 0; i < widgetMixinsLength; i++){

                    var widgetFilters = get(widgetMixins[i], 'filters');
                    var widgetFiltersLength = widgetFilters.length;

                    for (var j = 0; j < widgetFiltersLength; j++){

                        var titleFilter = get(widgetFilters[j], 'title');
                        var descriptionFilter = get(widgetFilters[j], 'filter');
                        console.log('finish', titleFilter, descriptionFilter);
                        if (descriptionFilter === filterFragments[1]){
                            set(controller, 'titleFilter', titleFilter);
                        }
                    }
                }

                this.loadEventsLog();
            }
        },

        /**
         * get user events from calendardata collection
         * @method loadCalendarEvents
         */
        loadCalendarEvents: function() {

            var controller = this;
            var initialized = get(controller, 'fullCalendarInitialized');

            var store = get(controller, 'widgetDataStore');

            // query to select events (by filters)
            controller.getDateCalendarView();

            var userEventsParams = {
                dtstart: get(this, 'calendarStart'),
                dtend: get(this, 'calendarEnd')
            };

             // get data from storage and refresh view by calling "addEventCalendar"
            store.findQuery('calendardata', userEventsParams).then(function (result) {

                var events = get(result, 'content'),
                    calendarTab = [],
                    eventslength = events.length;

                for (var i = 0, li = eventslength; i < li; i++) {
                    var formated_cevent = controller.getCalendarEvent(events[i]);
                    calendarTab.pushObject(formated_cevent);
                }
                controller.trigger('addEventCalendar', calendarTab, '#97D17A', 'black');
                set(controller,'calendarTab', calendarTab);
            });
        },

        /**
         * get user events from calendarday collection
         * @method loadEventsLog
         */
        loadEventsLog: function(){
            var controller = this;
            var store = get(controller, 'widgetDataStore');
            controller.getDateCalendarView();

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

            store.findQuery('calendarday', eventsLogParams).then(function (result) {
                var contentsCount = get(result, 'content');
                var countlength = contentsCount.length,
                    calendarTab = [];

                for (var i = 0; i < countlength; i++) {
                    var count = get(contentsCount[i], 'count');
                    var date = get(contentsCount[i], 'date');
                    if(count !== 0) {
                        var formated_eventsLogCount = controller.getEventsLogCount(count, date);
                        calendarTab.pushObject(formated_eventsLogCount);
                    }
                }
                var eventsLog = get(controller, 'eventsLog');

                controller.trigger('removeEventCalendar', eventsLog);
                controller.trigger('addEventCalendar', calendarTab, '#FFCE74', 'black');
                set(controller,'eventsLog', calendarTab);

            });
        },

        /**
         * override the mixin's computeFilterFragmentsList method
         * @method computeFilterFragmentsList
         * @return {}
         */
        computeFilterFragmentsList: function() {
            return [undefined];
        },

        /**
         * set date view with the actual month if undefined
         * @method getDateCalendarView
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
         * format the calendar event for fullCalendar
         * @method getCalendarEvent
         * @param {object} cevent: object that contains event to format
         * @return {object}
         */
        getCalendarEvent: function (cevent) {
            return {
                title: get(cevent, 'output'),
                start: moment(get(cevent, 'dtstart')*1000).format(),
                end: moment(get(cevent, 'dtend')*1000).format()
            };
        },

        /**
         * format the eventsLog count for fullCalendar
         * @method getEventsLogCount
         * @param {Integer} count: integer that represents the count of events log relative to the given
         * @param {object} date: object that contains a 'begin' timestamp attribute and a 'end' timestamp attribute
         * @return {object}
         */
        getEventsLogCount: function (count, date) {
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
             * create an user event from the "add event" form in the widget
             * @method createEvent
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
             * open a form to edit eventcategories
             * @method editCategories
             */
            editCategories: function () {
                var container = get(this, 'container');
                formUtils.editSchemaRecord('eventcategories', container);
            }
        },

        /**
         * inform the user about the last action made
         * @method showUserMessage
         * @param message: string that is the information about the action to inform
         * @param level: string that indicate the information level (for Bootstrap color element)
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
