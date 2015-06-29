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
    'ember',
    'jquery',
    'app/lib/factories/widget',
    'app/lib/utils/forms',
    'canopsis/widgetCalendar/lib/utils/moment/min/moment.min',
    'canopsis/widgetCalendar/lib/utils/fullcalendar/dist/fullcalendar.min',
    'link!canopsis/widgetCalendar/lib/utils/fullcalendar/dist/fullcalendar.min.css',
    'link!canopsis/widgetCalendar/style.css'
], function(Ember, $, WidgetFactory, formUtils, moment, WidgetCalendar) {

    var get = Ember.get,
        set = Ember.set;

    var viewMixin = Ember.Mixin.create({

        eventsDidChange: function(calendarTab){
            $('.calendar').fullCalendar('destroy');
            var toto = get(this, 'calendarTab');
            $('.calendar').fullCalendar({
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
            var component = this;
            var eventForm = formUtils.instantiateForm('confirmform', 'task', {});
            set(component, 'eventForm', eventForm);
            console.log('eventForm', eventForm);

            $('.calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },

                editable: false,
                events: []
            });

            this._super();
        },

        willDestroyElement: function(){
            this._super();
            this.$('.calendar').fullCalendar('destroy');
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
            var component = this;
            console.log ('controller calendar', component);

            /* getting event data from schemas */
            //TODO @florent query with params
            var params = {
                output: "test"
            };

            var store = get(this, 'widgetDataStore');

            store.findQuery('calendardata', params).then(function (result) {
                var eventObjects = get(result, 'content');
                var calendarTab = [];
                for (var i = 0, li = eventObjects.length; i < li; i++) {
                    var data = get(eventObjects[i],'_data');
                    var description = get(data, 'output');
                    var startEvent = moment(get(data, 'dtstart')*1000).format();
                    var endEvent = moment(get(data, 'dtend')*1000).format();
                    calendarTab.pushObject({
                        title: description,
                        start: startEvent,
                        end: endEvent
                    });
                }
                set(component, 'calendarTab', calendarTab);
                viewMixin.mixins[0].properties.eventsDidChange(calendarTab);
            });
        },

        actions:{
            save: function(description, category, dtstart, dtend){
                var component = this;
                var eventConfirmation = 'event created';

                if(moment(dtstart).unix() > moment(dtend).unix()){
                    console.log('the starting date is after the ending date');
                    eventConfirmation = 'creation problem: dates are not correct';
                }
                else {

                    var store = get(this, 'widgetDataStore');
                    var newEvent = store.createRecord('calendardata',{
                        category: String(category),
                        output: String(description),
                        dtstart: moment(dtstart).unix(),
                        dtend: moment(dtend).unix()
                    });
                    newEvent.save().then(function(){
                        component.findItems();
                    });
                }
            },
        }
    });

    return widget;
});
