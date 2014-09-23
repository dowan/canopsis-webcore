/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
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
    'app/application'
], function(Ember, Application) {
    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({

        init: function() {
            this._super();
            set(this, "componentDataStore", DS.Store.create({
                container: get(this, "container")
            }));
            console.log("Event selector init");

            set(this, 'selectedEvents', []);

            if (get(this, 'content') !== undefined) {
                this.initializeEvents();
            }
        },

        initializeEvents: function () {
            rks = get(this, 'content');

            var that = this;
            var query = get(this, 'componentDataStore').findQuery(
                'event',
                {
                    filter: JSON.stringify({_id: {'$in': rks}}),
                    limit: 0,
                    noAckSearch: true
                }
            ).then(
                function (data) {
                    console.log('Fetched initialization data from events', data.content);
                    set(that, 'selectedEvents', data.content);
                }
            );
            void (query);
        },

        findEvents: function() {

            var filter = {};

            var excludeRks = this.getSelectedRks();

            //adding exclusion rks if any loaded
            if (excludeRks.length) {
                filter._id = {'$nin': excludeRks};
            }

            var component = get(this, 'component');
            var resource = get(this, 'resource');

            //permissive search throught component and resource
            if (component) {
                filter.component = { '$regex' : '.*'+ component +'.*', '$options': 'i' };
            }
            if (resource) {
                filter.resource = { '$regex' : '.*'+ resource +'.*', '$options': 'i' };
            }

            filter.event_type = 'check';

            var selectors = get(this, 'selectors');
            var topologies = get(this, 'topologies');
            //does user selected selector or topology search
            if (selectors) {
                filter.event_type = 'selector';
            }

            if (topologies) {
                filter.event_type = 'topologies';
            }

            if (!filter.resource && !filter.component) {
                set(this, 'events', []);
                //when user only wants topologies or selectors, query is done anyway with the right crecord type
                if (!topologies && !selectors) {
                    return;
                }
            }

            var query = this.get("componentDataStore").findQuery(
                'event',
                {
                    filter: JSON.stringify(filter),
                    limit: 10,
                    noAckSearch: true
                }
            );

            var that = this;
            query.then(
                function (data) {
                    console.log('Fetched data from events', data.content);
                    set(that, 'events', data.content);
            });

            void (query);

        }.observes('component', 'resource'),

        setSelector: function() {
            set(this, 'topologies', false);
            this.findEvents();
        }.observes('selectors'),

        setTopologies: function() {
            set(this, 'selectors', false);
            this.findEvents();
        }.observes('topologies'),

        didInsertElement: function() {
        },

        getSelectedRks: function() {
            var selectedEventsBuffer = [];
            var selectedEvents = get(this, 'selectedEvents');

            if (selectedEvents !== undefined) {
                for (var i = 0, l = selectedEvents.length; i < l; i++) {
                    selectedEvents.pushObject(selectedEvents[i].id);
                }
            }
            return selectedEvents;
        },

        actions: {

            add: function (event) {
                console.log('Adding event', event);
                get(this, 'selectedEvents').pushObject(event);
                get(this, 'events').removeObject(event);
                set(this, 'content', this.getSelectedRks());

                if (!get(this, 'events').length) {
                    this.findEvents();
                }
            },

            delete: function (event) {
                console.log('Rk to delete', event.id);
                var selectedEvents = get(this, 'selectedEvents');

                for (var i=0, l = selectedEvents.length; i < l; i++) {
                    if (event.id === selectedEvents[i].id) {
                        console.log('Removing event');
                        get(this, 'selectedEvents').removeAt(i);
                        break;
                    }
                }

                this.findEvents();
                set(this, 'content', this.getSelectedRks());
            }
        }
    });

    Application.ComponentEventselectorComponent = component;

    return component;
});
