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

        eventsDidChange: function(calendarTab) {
            /**
             *  @method eventsDidChange: refresh fullcalendar with fetched events
             *  @param calendarTab: event list formated for fullCalendar
             */

            var view = this;
            var calendar = view.$('.calendar');

            // TODO find an other solution ! -- quit the function if the view is in destroy state
            // Sometime, findItem method fetch data when dom is not ready and try to refresh view when it does not exists

            if(isNone(calendar)) {
                return;
            }
            console.log('execution du eventsDidchange');
            // Replace old source by the new one: in order to refresh the eventSource
            calendar.fullCalendar( 'removeEventSource', calendarTab );
            calendar.fullCalendar( 'addEventSource', {
                events: calendarTab,
                color: 'yellow',
                textColor: 'black'
            });
        },

        didInsertElement: function(calendarTab) {
            var globalView = this;
            globalView._super();
            //var calendarTab = [];
            if(calendarTab === undefined) {
                calendarTab = [];
                var calendar = globalView.$('.calendar');
                // Create fullCalendar
                console.log('execution du didInsertElement');
                calendar.fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,basicWeek,basicDay'
                    },
                    fixedWeekCount : false,
                    editable: false,
                    lazyFetching: false,
                    viewRender: function(month, calendar) {
                        //always call findItems twice in spite of the if condition
                        var controller = get(globalView, "controller");
                        var calview = globalView.$('.calendar').fullCalendar('getView');
                        set(controller, 'calendarStart', moment(calview.start.format()).format('x')/1000);
                        set(controller, 'calendarEnd', moment(calview.end.format()).format('x')/1000);
                        if (calendarTab !== []) {
                            controller.findItems();
                        }
                    },
                    eventSources: [
                        {
                            events: calendarTab,
                            color: 'yellow',
                            textColor: 'black'
                        }
                    ]
                });
            }
            else {
                console.log('coucou');
                globalView.$('.calendar').fullCalendar( 'removeEventSource', calendarTab );
                globalView.$('.calendar').fullCalendar( 'addEventSource', {
                    events: calendarTab,
                    color: 'yellow',
                    textColor: 'black'
                });
            }
            // Sync controller and view for eventsDidchange event
            var ctrl = get(this, "controller");
            ctrl.on('eventsDidChange',this, this.didInsertElement);
        },

        willDestroyElement: function() {
            this._super();
            this.$('.calendar').fullCalendar('destroy');
            this.off('eventsDidChange',this, this.eventsDidChange);
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

        findItems: function() {
            var controller = this;
            var store = get(controller, 'widgetDataStore');

            /** get event data from schemas */

            /** get userfilters from customfilterlist mixin */

            var widgetMixins = get(controller, 'model.mixins');
            var widgetMixinsLength = widgetMixins.length;
            console.log('execution du findItems');
            for (var i = 0; i < widgetMixinsLength; i++){

                var widgetFilters = get(widgetMixins[i], 'filters');
                var widgetFiltersLength = widgetFilters.length;

                for (var j = 0; j < widgetFiltersLength; j++){

                    var titleFilter = get(widgetFilters[j], 'title');
                    var descriptionFilter = get(widgetFilters[j], 'filter');
                    console.log('finish', titleFilter, descriptionFilter);
                }
            }

            /** query to select events (by filters) */
            controller.getDateCalendarView();
                /*query: JSON.stringify({
                    "dtstart": dtstart,
                    "dtend": dtend
                })*/
            var params = {
                dtstart: get(this, 'calendarStart'),
                dtend: get(this, 'calendarEnd')
            };

            /**
             * get data from storage and refresh view by
             * calling "eventsDidchange"
             */
            store.findQuery('calendardata', params).then(function (result) {

                var events = get(result, 'content'),
                    calendarTab = [],
                    eventslength = events.length;

                for (var i = 0, li = eventslength; i < li; i++) {
                    formated_cevent = controller.getCalendarEvent(events[i]);
                    calendarTab.pushObject(formated_cevent);
                }
                controller.trigger('eventsDidChange', calendarTab);
            });
        },

        getDateCalendarView: function () {
            if(get(this, 'calendarStart') ===  undefined) {
                set(this, 'calendarStart', parseInt(moment().startOf('month').format('x')/1000));
            }
            if(get(this, 'calendarEnd') === undefined) {
                set(this, 'calendarEnd', parseInt(moment().endOf('month').format('x')/1000));
            }
        },

        getCalendarEvent: function (cevent) {
            /**
             *  @method getCalendarEvent: format the calendar event for fullCalendar
             *  @param cevent: object that contains params to format
             *  @return object
             */
            return {
                title: get(cevent, 'output'),
                start: moment(get(cevent, 'dtstart')*1000).format(),
                end: moment(get(cevent, 'dtend')*1000).format()
            };
        },

        actions:{
            createEvent: function() {
                /**
                 *  @method createEvent: create an user event from the "add event" form in the widget
                 */
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
                                controller.findItems();
                            });
                        }
                        notificationUtils.info(__('event calendar created'));
                    });
                });
            },

            editCategories: function () {
                var container = get(this, 'container');
                formUtils.editSchemaRecord('eventcategories', container);
            }
        },

        showUserMessage: function (message, level) {
            /**
             *  @method showUserMessage: inform the user about the last action made
             *  @param message: string that is the information about the action to inform
             *  @param level: string that indicate the information level (for Bootstrap color element)
             */
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
