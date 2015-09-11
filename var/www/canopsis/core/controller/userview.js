/**
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
    name: 'UserviewController',
    after: ['FormsUtils', 'HashUtils', 'SchemasRegistry', 'InspectableItemMixin'],
    initialize: function(container, application) {

        var formUtils = container.lookupFactory('utility:forms');
        var hashUtils = container.lookupFactory('utility:hash');
        var schemasregistry = container.lookupFactory('registry:schemas');
        var InspectableItem = container.lookupFactory('mixin:inspectable-item');

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone,
            __ = Ember.String.loc;


        /**
         * @class UserviewController
         * @extends Ember.ObjectController
         * @constructor
         */
        var controller = Ember.ObjectController.extend(InspectableItem, Ember.Evented, {
            needs: ['application'],

            actions: {
                /**
                 * @event insertWidget
                 * @param containerController
                 * @description Shows the "add widget" form, insert the selected widget on the view, and make the changes persistant
                 */
                insertWidget: function(containerController) {
                    console.log("insertWidget", containerController);
                    var widgetChooserForm = formUtils.showNew('widgetform', this);

                    var userviewController = this;

                    widgetChooserForm.submit.done(function(form, newWidgetWrappers) {
                        void (form);
                        var newWidgetWrapper = newWidgetWrappers[0];

                        console.log('onsubmit, adding widgetwrapper to containerwidget', newWidgetWrapper, containerController);
                        console.log('containerwidget items', get(containerController, 'content.items.content'));
                        //FIXME wrapper does not seems to have a widget
                        get(containerController, 'content.items.content').pushObject(newWidgetWrapper);

                        console.log("saving view");
                        get(userviewController, 'content').save().then(function() {
                            userviewController.trigger('refreshView');
                        });
                    });

                    widgetChooserForm.submit.fail(function() {
                        console.info('Widget insertion canceled');
                    });
                },

                refreshView: function() {
                    console.log('refresh view');
                    this.trigger('refreshView');
                }
            }
        });


        application.register('controller:userview', controller);
    }
});