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

Ember.Application.initializer({
    name: 'component-actionfilter',
    initialize: function(container, application) {
        var get = Ember.get,
            set = Ember.set;

        /**
         * @component actionfilter
         */
        var component = Ember.Component.extend({

            /**
             * @method init
             */
            init: function() {
                this._super();
                //default value on load
                this.set('selectedAction', 'pass');
                console.log(' ! --- > content', this.get('content'));
                //Use a temp variable to avoid content deletion and strange behaviors.
                if (get(this, 'content') === undefined) {
                    set(this, 'contentUnprepared', Ember.A());
                } else {
                    set(this, 'contentUnprepared', get(this, 'content'));
                }
            },

            /**
             * @property selectedAction
             */
            selectedAction: 'pass',

            /**
             * @property availableactions
             */
            availableactions: ['pass','drop','override','remove', 'execjob'],

            /**
             * @property isOverride
             */
            isOverride: function () {
                console.log('isOverride', get(this, 'selectedAction'), get(this, 'selectedAction') === 'override');
                return get(this, 'selectedAction') === 'override';
            }.property('selectedAction'),

            /**
             * @property isRoute
             */
            isRoute: function () {
                //not used yet
                return false;
                //console.log('isRoute', this.get('selectedAction'), this.get('selectedAction') === 'route');
                //return this.get('selectedAction') === 'route';
            }.property('selectedAction'),

            /**
             * @property isRemove
             */
            isRemove: function () {
                console.log('isRemove', get(this, 'selectedAction'), get(this, 'selectedAction') === 'remove');
                return get(this, 'selectedAction') === 'remove';
            }.property('selectedAction'),

            /**
             * @property isExecJob
             */
            isExecJob: function(){
                console.log('isExecJob', get(this, 'selectedAction'), get(this, 'selectedAction') === 'execjob');
                return get(this, 'selectedAction') === 'execjob';
            }.property('selectedAction'),

            actions : {
                /**
                 * @method actions_addAction
                 */
                addAction: function () {
                    var action = {
                        type: get(this, 'selectedAction')
                    };

                    if (get(this, 'selectedAction') === 'override') {
                        action.field = get(this, 'field');
                        action.value = get(this, 'value');
                    }

                    if (get(this, 'selectedAction') === 'remove') {
                        action.key = get(this, 'key');
                    }

                    if (get(this, 'selectedAction') === 'execjob') {
                        action.job = get(this, 'jobid');
                    }

                    console.log('Adding action', action);
                    get(this, 'contentUnprepared').pushObject(action);
                    set(this, 'content', get(this, 'contentUnprepared'));
                },

                /**
                 * @method actions_deleteAction
                 * @argument action
                 */
                deleteAction: function (action) {
                    console.log('Removing action', action);
                    get(this, 'contentUnprepared').removeObject(action);
                    set(this, 'content', get(this, 'contentUnprepared'));
                }
            }

        });

        application.register('component:component-actionfilter', component);
    }
});
