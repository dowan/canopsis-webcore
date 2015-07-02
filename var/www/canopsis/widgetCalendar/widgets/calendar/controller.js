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
    'app/lib/utils/forms',
    'canopsis/widgetCalendar/lib/utils/moment/min/moment.min',
    'canopsis/widgetCalendar/lib/utils/fullcalendar/dist/fullcalendar.min'
], function(WidgetFactory, formUtils, moment, WidgetCalendar) {

    var get = Ember.get,
        set = Ember.set;

    var viewMixin = Ember.Mixin.create({

        eventsDidChange: function(calendarTab){
            /**
                refresh fullcalendar with fetched events
                @param calendarTab: event list formated for fullCalendar
            **/
            this.$('.calendar').fullCalendar('destroy');
            this.$('.calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                editable: false,
                events: calendarTab
            });
        },

        didInsertElement: function() {
            var view = this;
            var eventForm = formUtils.instantiateForm('confirmform', 'task', {});
            set(view, 'eventForm', eventForm);
            console.log('eventForm', eventForm);

            view.$('.calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },

                editable: false,
                events: []
            });
            var ctrl = get(view, "controller");
            ctrl.on('eventsDidChange',view, view.eventsDidChange);

            view._super();
        },

        willDestroyElement: function(){
            this._super();
            this.$('.calendar').fullCalendar('destroy');
            this.off('eventsDidChange',this, this.eventsDidChange);
        }
    });

    var widget = WidgetFactory('calendar',{

        viewMixins: [
            viewMixin
        ],

        init: function() {
            this._super.apply(this, arguments);
            set(this, 'store', DS.Store.extend({
                container: this.get('container')
            }));

        },

        findItems: function(){
            var controller = this;
            console.log ('controller calendar', controller);

            /* getting event data from schemas */
            var params = {
                query: {
                    "category": "2"
                }
            };

            var store = get(controller, 'widgetDataStore');

            store.findQuery('calendardata').then(function (result) {

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

        getCalendarEvent: function (cevent) {
            return {
                title: get(cevent, 'output'),
                start: moment(get(cevent, 'dtstart')*1000).format(),
                end: moment(get(cevent, 'dtend')*1000).format()
            };
        },

        actions:{
            save: function(){
                //TODO @florent instanciate new model form
                var newRecord = {
                    category: 'maintenance',
                    output: 'test',
                    dtstart: 0,
                    dtend: 0
                };
                formUtils.showNew('modelform',newRecord);

                /*var controller = this,
                    eventConfirmation = 'event created';

                var dtstart = moment(get(this, 'dtstart') || 0).unix();
                var dtend = moment(get(this, 'dtend') || 0).unix();

                if(dtstart > dtend){
                    console.log('the starting date is after the ending date');
                    controller.showUserMessage(
                        'Creation problem: dates are not correct',
                        'warning'
                    );
                }
                else {

                    var store = get(this, 'widgetDataStore');
                    var newEvent = store.createRecord('calendardata',{
                        category: String(get(this, 'category')),
                        output: String(get(this, 'description')),
                        dtstart: dtstart,
                        dtend: dtend
                    });
                    console.log("record created");
                    newEvent.save().then(function(){
                        controller.showUserMessage(
                            'Event save success',
                            'success'
                        );
                        controller.findItems();
                    });
                }*/
            },
        },

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
