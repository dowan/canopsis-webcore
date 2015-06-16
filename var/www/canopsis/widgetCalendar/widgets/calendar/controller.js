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
    'canopsis/widgetCalendar/lib/utils/moment/min/moment.min',
    'canopsis/widgetCalendar/lib/utils/fullcalendar/dist/fullcalendar.min',
    'link!canopsis/widgetCalendar/lib/utils/fullcalendar/dist/fullcalendar.min.css',
    'link!canopsis/widgetCalendar/style.css'
], function(Ember, $, WidgetFactory, moment, WidgetCalendar) {

    var get = Ember.get,
        set = Ember.set;

    var viewMixin = Ember.Mixin.create({

        didInsertElement: function() {

            this.$('.calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },

                editable: true,
                events: [
                    {
                        title: get(widget.calendarTab[0], 'description'),
                        start: '2015-05-07',
                        end: '2015-05-10'
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        start: '2015-05-09T16:00:00'
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        start: '2015-05-16T16:00:00'
                    },
                    {
                        title: 'Conference',
                        start: '2015-05-11',
                        end: '2015-05-13'
                    },
                    {
                        title: 'Meeting',
                        start: '2015-05-12T10:30:00',
                        end: '2015-05-12T12:30:00'
                    },
                    {
                        title: 'Birthday Party',
                        start: '2015-05-13T07:00:00'
                    }
                ]
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

            /* getting event data from schemas */
            //TODO @florent query with params
            var params = {
                category: 1
            };

            var store = get(this, 'widgetDataStore');

            store.findQuery('calendardata').then(function (result) {
                console.log('result', result);
                var eventObjects = get(result, 'content');
                console.log('eventObjects', eventObjects);
                set(component, 'eventObjects', eventObjects);
                calendarTab = [];
                for (var i = 0, li = eventObjects.length; i < li; i++) {
                    var data = get(eventObjects[i],'_data');
                    console.log('data', data);
                    var description = get(data, 'output');
                    var startEvent = moment(get(data, 'dtstart')).format();
                    var endEvent = moment(get(data, 'dtend')).format();
                    console.log('my event', description, 'from', startEvent, 'to', endEvent);
                    calendarTab.push({
                        title: description,
                        start: startEvent,
                        end: endEvent
                    });
                }
                console.log('display of calendarTab', calendarTab);
                set(component, 'calendarTab', calendarTab);
            });
        },

        actions:{
            save: function(){
                var store = get(this, 'widgetDataStore');
                var newEvent = store.createRecord(store, 'calendardata',{
                    category: '3',
                    description:'awesome project',
                    dtstart: '2015-05-12T10:30:00'
                });
                newEvent.save();
                console.log('model created');
            },
        }
    });

    return widget;
});
