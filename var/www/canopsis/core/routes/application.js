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
    name: 'ApplicationRoute',
    after: ['AuthenticatedRoute', 'FormsRegistry', 'RoutesUtils', 'ActionsUtils'],
    initialize: function(container, application) {
        var formsregistry, routesUtils, actionsUtils;

        var AuthenticatedRoute = container.lookupFactory('route:authenticated');

        formsregistry = container.lookupFactory('registry:forms');
        routesUtils = container.lookupFactory('utility:routes');
        actionsUtils = container.lookupFactory('utility:actions');


        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        /**
         * @function bindKey
         * @param keyCombination
         * @param actionName
         *
         * Bind a key combination to an action registered in the actionsRegistry.
         * @see ActionsUtils#doAction
         */
        function bindKey(keyCombination, actionName) {
            Mousetrap.bind([keyCombination], function(e) {
                console.log('binding', arguments);
                actionsUtils.doAction(actionName);

                return false;
            });
        }

        /**
         * @class ApplicationRoute
         * @extends AuthenticatedRoute
         * @constructor
         */
        var route = AuthenticatedRoute.extend({
            actions: {
                /**
                 * @event showView
                 * @param {string} id the id of the view to display
                 *
                 * Changes the currently displayed view to a new one.
                 */
                showView: function(id) {
                    console.log('ShowView action', arguments);

                    var currentViewId = routesUtils.getCurrentViewId();

                    this.transitionTo('userview', id);
                },

                /**
                 * @event showEditFormWithController
                 * @param formController
                 * @param formContext
                 * @param options
                 */
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

            /**
             * @method beforeModel
             * @param {Transition} transition
             * @return {Promise}
             *
             * Feed the ApplicationController with extra views to be used alongside the current view, and additionnal config from the backend.
             */
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

                    console.log('transition', transition);
                    if(get(transition, 'targetName') === 'index') {
                        console.info('on index route, redirecting to the appropriate route');

                        var defaultview = get(appController, 'frontendConfig.defaultview');

                        if(!isNone(defaultview)) {
                            console.log('redirect to view', defaultview);
                            route.transitionTo('/userview/' + defaultview);
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

                set(this, 'promiseArray', [
                    superPromise,
                    footerPromise,
                    headerPromise,
                    devtoolsPromise,
                    frontendConfigPromise,
                    ticketPromise,
                ]);

                set(this, 'store', store);

                var authpromise = this.authConfig('authconfiguration', function (authconfigurationRecord) {

                    var serviceList = get(authconfigurationRecord, 'services');

                    console.log('authconfigurationRecord', authconfigurationRecord, serviceList);

                    if(!isNone(serviceList)) {
                        for(var i = 0, l = serviceList.length; i < l; i++) {
                            //this test avoids empty strings
                            if(serviceList[i]) {
                                var promise = route.authConfig(serviceList[i]);
                                get(route, 'promiseArray').pushObject(promise);
                            }
                        }
                    }
                });

                get(this, 'promiseArray').pushObject(authpromise);

                return Ember.RSVP.Promise.all(get(this, 'promiseArray'));
            },

            /**
             * @method authConfig
             * @private
             * @param authType
             * @param callback
             */
            authConfig: function (authType, callback) {
                var authId = 'cservice.' + authType;
                var appController = this.controllerFor('application');
                var store = get(this, 'store');

                var onReadyRecord = function(appController, authType, record, callback) {
                    appController[authType] = record;
                    if(!appController.authTypes) {
                        appController.authTypes = [];
                    }

                    appController.authTypes.pushObject(authType);

                    if(!isNone(callback)) {
                        callback(record);
                    }
                };

                var promise = store.find(authType, authId);
                promise.then(function(queryResults) {

                    console.log(authType, 'config found', queryResults);
                    onReadyRecord(appController, authType, queryResults, callback);

                }, function() {
                    console.log('create base ' + authType + ' config');

                    var record = store.createRecord(authType, {
                        crecord_name: authType
                    });

                    record.id = authId;
                    onReadyRecord(appController, authType, record, callback);
                });

                return promise;
            },

            //TODO check if this is still used
            model: function() {
                return {
                    title: 'Canopsis'
                };
            },

            /**
             * @method renderTemplate
             */
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

        application.register('route:application', route);
    }
});
