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
    'ember-data',
    'app/routes/authenticated',
    'app/lib/formsregistry',
    'app/lib/utils/routes',
    'app/lib/utils/actions',
    'utils',
    'app/lib/loaders/forms'
], function(Ember, DS, AuthenticatedRoute, formsregistry, routesUtils, actionsUtils, utils) {

    var get = Ember.get,
        set = Ember.set;


    function bindKey(keyCombination, actionName) {
        Mousetrap.bind([keyCombination], function(e) {
            console.log('binding', arguments);
            actionsUtils.doAction(actionName);

            return false;
        });
    }

    var route = AuthenticatedRoute.extend({
        actions: {
            showView: function(id) {
                console.log('ShowView action', arguments);

                var currentViewId = routesUtils.getCurrentViewId();
                var app = this.controllerFor('application');
                if(currentViewId !== undefined && currentViewId !== id) {
                    set(app, 'isLoading', get(app, 'isLoading') + 1);
                }

                this.transitionTo('userview', id);
            },

            showEditFormWithController: function(formController, formContext, options) {
                if (formController.ArrayFields) {
                    while(formController.ArrayFields.length > 0) {
                        formController.ArrayFields.pop();
                    }
                }

                var formName = get(formController, 'formName');
                console.log('showEditFormWithController', formController, formName, formContext, options);

                var formwrapperController = this.controllerFor('formwrapper');
                set(formsregistry, 'formwrapper', formwrapperController);

                formController.setProperties({
                    'formwrapper': formwrapperController,
                    'formContext': formContext
                });

                formwrapperController.setProperties({
                   'form': formController,
                   'formName': formName
                });

                formwrapperController.send('show');

                return formController;
            }
        },

        beforeModel: function(transition) {
            var route = this;

            var store = DS.Store.create({ container: get(this, "container") });
            var footerPromise = store.find('userview', 'view.app_footer');
            var headerPromise = store.find('userview', 'view.app_header');
            var devtoolsPromise = store.find('userview', 'view.app_devtools');
            var frontendConfigPromise = store.find('frontend', 'cservice.frontend');
            var ticketPromise = store.find('ticket', 'cservice.ticket');
            var appController = route.controllerFor('application');

            ticketPromise.then(function(queryResults) {
                appController.ticketConfig = queryResults;
            });

            frontendConfigPromise.then(function(queryResults) {
                console.log('frontend config found');
                appController.frontendConfig = queryResults;

                var keybindings = get(queryResults, 'keybindings');

                console.log('load keybindings', keybindings);

                for (var i = 0, l = keybindings.length; i < l; i++) {
                    var currentKeybinding = keybindings[i];
                    console.log('Mousetrap define', currentKeybinding);

                    bindKey(currentKeybinding.label, currentKeybinding.value);
                }

                if(get(appController, 'onIndexRoute') === true) {
                    console.info('on index route, redirecting to the appropriate route');

                    var defaultview = get(appController, 'frontendConfig.defaultview');

                    if(!! defaultview) {
                        appController.send('showView', defaultview);
                    }
                }
            });

            headerPromise.then(function(queryResults) {
                appController.headerUserview = queryResults;
            });

            footerPromise.then(function(queryResults) {
                appController.footerUserview = queryResults;
            });

            devtoolsPromise.then(function(queryResults) {
                appController.devtoolsUserview = queryResults;
            });

            var superPromise = this._super(transition);

            var enginesviews = get(appController, 'enginesviews');

            for (var i = 0, l = enginesviews.length; i < l; i++) {
                var item = enginesviews[i];
                //FIXME stop using utils to store data!
                if(get(utils, 'session._id') === "root") {
                    set(item, 'displayable', true);
                } else {
                    viewId = item.value;
                    if (get(utils, 'session.rights.showview_' + viewId.replace('.', '_'))) {
                        set(item, 'displayable', true);
                    } else {
                        set(item, 'displayable', false);
                    }
                }
            }

            return Ember.RSVP.Promise.all([
                superPromise,
                footerPromise,
                headerPromise,
                devtoolsPromise,
                frontendConfigPromise,
                ticketPromise
            ]);
        },

        model: function() {
            return {
                title: 'Canopsis'
            };
        },

        renderTemplate: function() {
            console.info('render application template');
            this.render();

            //getting the generated controller
            var formwrapperController = this.controllerFor('formwrapper');

            this.render('formwrapper', {
                outlet: 'formwrapper',
                into: 'application',
                controller: formwrapperController
            });

            var recordinfopopupController = this.controllerFor('recordinfopopup');

            this.render('recordinfopopup', {
                outlet: 'recordinfopopup',
                into: 'application',
                controller: recordinfopopupController
            });
        }
    });


    loader.register('route:application', route);

    return route;
});
