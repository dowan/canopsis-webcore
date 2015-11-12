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
    name: 'ContainerWidget',
    after: ['WidgetFactory', 'DebugUtils'],
    initialize: function(container, application) {
        var WidgetFactory = container.lookupFactory('factory:widget');
        var debugUtils = container.lookupFactory('utility:debug');

        var get = Ember.get;

        var ContainerViewMixin = Ember.Mixin.create({
            /**
             * @method registerHooks
             */
            registerHooks: function() {
                get(this, 'controller').on('refreshChilds', this, this.refreshChilds);
                return this._super();
            },

            /**
             * @method unregisterHooks
             */
            unregisterHooks: function() {
                get(this, 'controller').off('refreshChilds', this, this.refreshChilds);
                return this._super();
            },

            refreshChilds: function() {
                var children = this.$().children().find('.ember-view.widget');
                var thisId = this.$().attr('id');
                console.log('this id', thisId);

                for (var i = 0, l = children.length; i < l; i++) {
                    if($(children[i]).parent().closest('.ember-view.widget').attr('id') === thisId) {
                        var widgetViewToRefresh = debugUtils.getViewFromJqueryElement($(children[i]));
                        var widgetControllerToRefresh = widgetViewToRefresh.get('controller');
                        widgetControllerToRefresh.refreshContent();
                    }
                }
            }
        });

        var widget = WidgetFactory('widgetcontainer', {

            init: function() {
                this.addMixinView(ContainerViewMixin);
                this._super();
            },

            refreshContent: function() {
                console.log('container startRefresh');

                var widgetwrappers = get(this, 'model.items');

                this.trigger('refreshChilds');

                return this._super();
            }
        });
        application.register('widget:widgetcontainer', widget);
    }
});
