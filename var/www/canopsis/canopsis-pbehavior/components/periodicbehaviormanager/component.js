/*
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

define([
    'ember',
    'canopsis/uibase/mixins/crud',
    'canopsis/canopsis-pbehavior/adapters/pbehavior'
], function(Ember, CrudMixin) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend(Ember.Evented, CrudMixin, {
        init: function() {
            /* mixin options for mixins */
            set(this, 'mixinOptions', {
                /* specific to crud mixin */
                crud: {
                    form: 'modelform'
                }
            });

            this._super.apply(this, arguments);

            /* store for pbehaviors fetching */
            var store = DS.Store.create({
                container: get(this, 'container')
            });

            set(this, 'widgetDataStore', store);

            this.refreshContent();
            this.on('refresh', this.refreshContent);
        },

        refreshContent: function() {
            console.group('Fetching periodic behaviors');
            console.log('context:', get(this, 'contextId'));

            var store = get(this, 'widgetDataStore'),
                ctrl = this;

            store.findQuery(
                'pbehavior',
                {
                    entity_ids: get(this, 'contextId')
                }
            ).then(
                function(result) {
                    set(ctrl, 'behaviors', get(result, 'content'));
                    console.log('behaviors:', get(ctrl, 'behaviors'));
                }
            );

            console.groupEnd();
        },

        onRecordReady: function(record) {
            this._super.apply(this, arguments);

            var contextId = get(this, 'contextId');
            set(record, 'source', contextId);
        }
    });

    Ember.Application.initializer({
        name: 'component-periodicbehaviormanager',

        initialize: function(container, application) {
            application.register(
                'component:component-periodicbehaviormanager',
                component
            );
        }
    });

    return component;
});
