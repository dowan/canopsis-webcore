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
    'app/application',
    'app/routes/authenticated',
    'utils',
    'app/lib/utils/data',
    'app/lib/utils/forms',
    'app/lib/utils/widgetSelectors',
    'app/lib/loaders/schemas',
    'seeds/RoutesLoader'
], function(Ember, Application, AuthenticatedRoute, utils, dataUtils, formUtils, widgetSelectorsUtils) {
    var set = Ember.set,
        get = Ember.get;

    var initialLoadDone = false;

    var route = AuthenticatedRoute.extend({
        needs: ['application'],
        actions: {
            loading: function() {
                if(initialLoadDone === true) {
                    set(this.controllerFor('application'), 'isLoading', true);
                }
            },

            error: function(error, transition){
                if (error.status === 0) {
                    console.debug('no error detected in access status');
                } else if (error.status === 403) {
                    console.debug('go to some default route');
                } else if (error.status === 401) {
                    console.debug('handle 401');
                } else if (error.status === 404) {
                    this.transitionTo('/userview/view.404');
                } else {
                    console.error(error);
                    utils.notification.error(__('Impossible to load view.'));
                }
            },

            /**
             * Toggle fullscreen and regular mode, by toggling Applicationcontroller#fullscreenMode boolean.
             * The rest of the implementation is on handlebars templates (application and userview)
             */
            toggleFullscreen: function() {
                var applicationController = this.controllerFor('application');

                var updatedFullscreenMode = !get(applicationController, 'fullscreenMode');

                set(applicationController, 'fullscreenMode', updatedFullscreenMode);
            },

            /**
            * Display a pop up allowing customer to set view time
            * parameters that will affect all widget data selection.
            **/
            displayLiveReporting: function () {

                var controller = this.controllerFor('userview');

                var record = dataUtils.getStore().createRecord('livereporting', {
                    crecord_type: 'livereporting'
                });

                var recordWizard = formUtils.showNew('modelform', record, {
                    title: __('Edit live reporting')
                });

                recordWizard.submit.then(function(form) {

                    var rootWidget = get(controller, 'content.containerwidget');
                    var children = widgetSelectorsUtils.children(rootWidget);

                    record = get(form, 'formContext');
                    var interval = get(record, 'dateinterval');

                    //Set filter as void instead undefined
                    if (Ember.isNone(interval)) {
                        interval = {};
                    }

                    console.debug('record generated', get(record, 'dateinterval'));
                    var len = children.length;
                    for (var i = 0, l = len; i < l; i++) {

                        console.debug('Child widget', get(children[i], 'id'), children[i]);
                        var widgetController = get(children[i], 'controllerInstance');

                        if (!Ember.isNone(widgetController)) {
                            //each widget takes responsibility to refresh or not once update interval is called
                            widgetController.updateInterval(interval);
                        } else {
                            console.error('Unable to find controller instance for widget', get(children[i], 'id'));
                        }
                    }
                });
            },

            refresh: function() {
                var userviewController = this.controllerFor('userview');

                console.log('refresh', this);
                this.refresh();
                userviewController.send('refreshView');
            }
        },

        setupController: function(controller, model) {
            console.log('UserviewRoute setupController', model, controller);
            set(this.controllerFor('application'), 'currentViewId', get(model, 'id'));

            controller.setProperties({
                'content': model,
                'isMainView': true
            });

            if(initialLoadDone === false) {
                initialLoadDone = true;
            }

            set(this.controllerFor('application'), 'isLoading', false);
            controller.trigger('refreshView');
        }
    });

    Application.UserviewRoute = route;

    return route;
});
