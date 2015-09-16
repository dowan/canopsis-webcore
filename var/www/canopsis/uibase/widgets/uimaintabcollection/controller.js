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
    name: 'UimaintabcollectionWidget',
    after: ['WidgetFactory', 'WidgetController', 'FormsUtils', 'RoutesUtils'],
    initialize: function(container, application) {
        var WidgetController = container.lookupFactory('controller:widget');
        var WidgetFactory = container.lookupFactory('factory:widget');
        var formsUtils = container.lookupFactory('utility:forms');
        var routesUtils = container.lookupFactory('utility:routes');

        var get = Ember.get,
            set = Ember.set;


        var widget = WidgetController.extend({
            needs: ['application', 'login'],

            currentViewId: Ember.computed.alias('controllers.application.currentViewId'),

            tagName: 'span',

            userCanShowEditionMenu: true,
            userCanEditView: true,
            userCanCreateView: true,

            isViewDisplayable: function(viewId) {
                return true;
            },

            preparedTabs: function() {
                var uimaintabcollectionController = this;

                var res = Ember.A();

                get(this, 'model.tabs').forEach(function(item, index) {
                    if(item.value === get(uimaintabcollectionController, 'currentViewId')) {
                        set(item, 'isActive', true);
                    } else {
                        set(item, 'isActive', false);
                    }


                    viewId = item.value;
                    viewId = viewId.replace('.', '_');
                    if (uimaintabcollectionController.isViewDisplayable(viewId)) {
                        set(item, 'displayable', true);
                    } else {
                        set(item, 'displayable', false);
                    }

                    res.pushObject(item);
                });

                return res;
            }.property('model.tabs', 'currentViewId'),

            actions: {
                do: function(action, params) {
                    if(params === undefined || params === null){
                        params = [];
                    }

                    this.send(action, params);
                },

                showViewOptions: function() {

                    var userviewController = routesUtils.getCurrentRouteController();
                    var userview = userviewController.get('model');

                    var widgetWizard = formsUtils.showNew('viewtreeform', userview, { title: __('Edit userview') });
                    console.log('widgetWizard', widgetWizard);

                    var widgetController = this;

                    widgetWizard.submit.done(function() {
                        userview.save().then(function(){
                            get(widgetController, 'viewController').send('refresh');
                        });
                    });

                }
            }
        });

        //FIXME: the factory "widgetbase" is a hack to make the canopsis rights reopen work. But it make the view "app_header" not working without the canopsis-rights brick
        application.register('widgetbase:uimaintabcollection', widget);
    }
});
