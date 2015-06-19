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

        eventsDidChange: function(){
            this.$('.calendar').fullCalendar('destroy');
            console.log('>> refresh', calendarTab);
            this.$('.calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                editable: false,
                events: calendarTab
            });
            this._super();
        }.observes('widget.calendarTab.@each.title'),

        didInsertElement: function() {

            this.$('.calendar').fullCalendar({
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

            /* getting event data from schemas */
            //TODO @florent query with params
            var params = {
                category: 1
            };

            var store = get(this, 'widgetDataStore');

            store.findQuery('calendardata').then(function (result) {
                var eventObjects = get(result, 'content');
                window.calendarTab = [];
                for (var i = 0, li = eventObjects.length; i < li; i++) {
                    var data = get(eventObjects[i],'_data');
                    var description = get(data, 'output');
                    var startEvent = moment(get(data, 'dtstart')*1000).format();
                    var endEvent = moment(get(data, 'dtend')*1000).format();
                    console.log('my event', description, 'from', startEvent, 'to', endEvent);
                    window.calendarTab.pushObject({
                        title: description,
                        start: startEvent,
                        end: endEvent
                    });
                }
                set(component, 'calendarTab', window.calendarTab);
            });
        },

        actions:{
            save: function(){
                var component = this;

                //TODO @florent bring data from form
                var category = '7';
                var output = 'test of refresh';
                var dtstart = moment('2015-06-22T10:30:00').unix();
                var dtend = moment('2015-06-23T10:30:00').unix();

                var store = get(this, 'widgetDataStore');
                var newEvent = store.createRecord('calendardata',{
                    category: '7',
                    output:'test of refresh',
                    dtstart: moment('2015-06-22T10:30:00').unix(),
                    dtend: moment('2015-06-23T10:30:00').unix()
                });
                newEvent.save();
                eventTab = get(component, 'calendarTab');
                window.calendarTab.pushObject({
                    title: output,
                    start: dtstart,
                    end: dtend
                });
                set(component, 'calendarTab', window.calendarTab);
                component.notifyPropertyChange('calendarTab');
            },
        }
    });

    return widget;
});
