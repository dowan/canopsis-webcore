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
    'app/lib/contextsregistry'
], function(Ember, contextsregistry) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;


    var component = Ember.Component.extend({
        contexts: contextsregistry.all,

        init: function () {
            this._super();

            this.set('store', DS.Store.create({
                container: this.get('container')
            }));
        },

        destroy: function() {
            this._super();

            this.get('store').destroy();
        },

        contextTypeChanged: function() {
            console.log('contextTypeChanged', get(this, 'contextType'));

            var component = this;

            get(this, 'store').findAll(get(this, 'contextType')).then(function(queryResults) {
                console.log('find done');
                set(component, 'findResults', queryResults);
            });

        }.observes('contextType')
    });


    Ember.Application.initializer({
        name:"component-contextselector",
        initialize: function(container, application) {
            application.register('component:component-contextselector', component);
        }
    });

    return component;
});
