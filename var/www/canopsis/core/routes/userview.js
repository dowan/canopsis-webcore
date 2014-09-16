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
    'app/application',
    'app/routes/authenticated',
    'utils'
], function(Application, AuthenticatedRoute, utils) {
    var set = Ember.set,
        get = Ember.get;

    var route = AuthenticatedRoute.extend({
        needs: ['application'],
        actions: {
            error: function(error, transition){
                if (error.status === 0) {
                } else if (error.status == 403) {
                    //go to some default route
                } else if (error.status == 401) {
                    //handle 401
                } else if (error.status == 404) {
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

                if(get(applicationController, 'fullscreenMode', true)) {
                    set(applicationController, 'fullscreenMode', false);
                } else {
                    set(applicationController, 'fullscreenMode', true);
                }
            },

            /**
            * Display a pop up allowing customer to set view time
            * parameters that will affect all widget data selection.
            **/
            displayLiveReporting: function () {

                var userviewController = this.controllerFor('userview');

                var record = Canopsis.utils.data.getStore().createRecord('livereporting', {
                    crecord_type: 'livereporting'
                });

                var recordWizard = Canopsis.utils.forms.showNew('modelform', record, {
                    title: __('Edit live reporting')
                });

                recordWizard.submit.then(function(form) {
                    /*
                    record = form.get('formContext');
                    userviewController.get('custom_filters').pushObject(record);
                    console.log('Custom filter created', record, form);
                    utils.notification.info(__('Custom filter created'));
                    userviewController.set('userParams.custom_filters', userviewController.get('custom_filters'));
                    userviewController.get('userConfiguration').saveUserConfiguration();
                    */
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
            set(controller, 'controllers.application.currentViewId', get(model, 'id'));

            controller.setProperties({
                'content': model,
                'isMainView': true
            });

            controller.trigger('refreshView');
        }
    });

    Application.UserviewRoute = route;

    return route;
});
