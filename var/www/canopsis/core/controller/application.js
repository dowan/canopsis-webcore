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
    'jquery',
    'ember',
    'ember-data',
    'app/application',
    'canopsis/canopsisConfiguration',
    'app/controller/partialslotablecontroller',
    'app/lib/widgetsregistry',
    'app/lib/actionsregistry',
    'app/lib/mixinsregistry',
    'app/lib/formsregistry',
    'app/lib/inflections',
    'app/mixins/userprofilestatusmenu',
    'app/mixins/requirejsmocksmanager',
    'app/mixins/screentoolstatusmenu',
    'app/mixins/schemamanager',
    'app/mixins/consolemanager',
    'app/mixins/promisemanager',
    'app/mixins/notifications',
    'utils',
    'app/lib/utils/forms',
    'app/lib/utils/data',
    'app/lib/utils/hash',
    'app/lib/utils/notification',
    'app/serializers/cservice',
    'app/lib/loaders/helpers',
    'app/lib/loaders/helpers',
    'app/lib/wrappers/bootstrap',
    'app/lib/wrappers/mousetrap',
    'app/controller/recordinfopopup',
    'app/controller/formwrapper'
], function(
    $,
    Ember,
    DS,
    Application,
    canopsisConfiguration,
    PartialslotAbleController,
    widgetsRegistry,
    actionsRegistry,
    mixinsRegistry,
    formsRegistry,
    inflectionsRegistry,
    UserprofilestatusmenuMixin,
    RequirejsmocksmanagerMixin,
    ScreentoolstatusmenuMixin,
    SchemamanagerMixin,
    ConsolemanagerMixin,
    PromisemanagerMixin,
    NotificationsMixin,
    utils,
    formsUtils,
    dataUtils,
    hashUtils,
    notificationUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;


    Application.IndexController = Ember.Controller.extend(Ember.Evented, {});

    /**
     * @class ApplicationController
     * @extends PartialslotAbleController
     * @constructor
     * @description Main application controller
     */
    var ApplicationControllerDict = {

        needs: ['login', 'recordinfopopup'],

        partials: {
            statusbar: []
        },

        /**
         * @property editMode
         * @type {boolean}
         * @description Whether the current view is editable or not
         */
        editMode: false,

        runtimeConfiguration: canopsisConfiguration,

        /**
         * @property debug
         * @type Object
         *
         * @description See {{#crossLink "CanopsisConfiguration"}}{{/crossLink}}
         */
        debug: Ember.computed.alias('runtimeConfiguration.DEBUG'),

        /**
         * @property widgetsRegistry
         * @type Object
         * @description Reference to the widgets registry
         */
        widgetsRegistry: widgetsRegistry,

        /**
         * @property actionsRegistry
         * @type Object
         * @description Reference to the actions registry
         */
        actionsRegistry: actionsRegistry,

        /**
         * @property mixinsRegistry
         * @type Object
         * @description Reference to the mixins registry
         */
        mixinsRegistry: mixinsRegistry,

        /**
         * @property inflectionsRegistry
         * @type Object
         * @description Reference to the inflections registry
         */
        inflectionsRegistry: inflectionsRegistry,

        /**
         * @property formsRegistry
         * @type Object
         * @description Reference to the form registry
         */
        formsRegistry: formsRegistry,

        /**
         * @property isLoading
         * @type Number
         * @description the number of concurrent loadings (usually requests) pending
         */
        isLoading:0,

        /**
         * @property utils
         * @description utils reference
         * @deprecated
         */
        utils: utils,

        /**
         * @property enginesviews
         * @type Array
         * @static
         * @description used to feed the left menu "Engines"
         */
        enginesviews: [
            {label: __('Selectors'), value: 'view.selectors'},
            {label: __('Event Filter'), value: 'view.filters'},
            {label: __('Performance Data'), value: 'view.series'},
            {label: __('Scheduled Jobs'), value: 'view.jobs'},
            {label: __('Link list'), value: 'view.linklist'}
        ],

        /**
         * @method init
         */
        init: function() {
            console.group('app init');
            notificationUtils.setController(this);

            //Set page title
            var title = get(canopsisConfiguration, 'TITLE');
            if (!isNone(title)) {
                $('title').html(title);
            }

            //TODO refactor this in application route

            console.groupEnd();
            this.refreshPartialsList();
            this._super.apply(this, arguments);

            //close the init group
            console.groupEnd();
            console.tags.remove('init');
        },

        /**
         * @method editAuthConfig
         * @param {String} authType the type of the auth system to edit
         */
        editAuthConfig: function(authType) {
            console.log('edit ' + authType);

            var conf = get(this, authType);

            if(isNone(conf)) {
                this.send(
                    'prompt',
                    'Unable to load ' + authType + ' configuration. No edition possible.'
                );
            } else {

                set(conf, 'crecord_type', authType);

                var editForm = formsUtils.showNew(
                    'modelform',
                    conf,
                    { title: __('Edit ' + authType + ' configuration') }
                );

                editForm.submit.done(function() {
                    conf.save();
                });
            }
        },

        actions: {
            /**
             * @event editConfig
             * @descriptions Shows a form to edit the frontend configuration
             */
            editConfig: function() {
                var frontendConfig = get(this, 'frontendConfig');
                console.log('editConfig', formsUtils, frontendConfig);

                var editForm = formsUtils.showNew('modelform', frontendConfig, { title: __("Edit settings"), inspectedItemType: "frontend" });
                editForm.submit.done(function() {
                    frontendConfig.save();
                });
            },
            /**
             * @event editAuthConfiguration
             * @param {String} authType
             */
            editAuthConfiguration: function(authType) {
                console.log('edit ' + authType);
                this.editAuthConfig(authType);
            },

            /**
             * @event prompt
             * @descriptions Shows a popup with a message
             * @param {String} message
             */
            prompt:function (message) {
                formsUtils.showNew('confirmform', {}, {
                    title: __(message)
                });
            },

            /**
             * @event promptReloadApplication
             * @descriptions Shows a popup with a message
             * @param {String} title
             * @param {String} location the location to redirect the user when he accepts to get redirected. Defaults to "/index.html"
             */
            promptReloadApplication: function(title, location) {
                setTimeout(function (){
                    var recordWizard = formsUtils.showNew('confirmform', {}, {
                        title: __(title)
                    });

                    recordWizard.submit.then(function(form) {
                        void(form);

                        if (isNone(location)) {
                            window.location = '/index.html';
                        } else {
                            window.location = location;
                        }
                    });
                }, 1500);
            },

            /**
             * @event editEventSettings
             * @descriptions Shows a Modelform with event settings
             */
            editEventSettings: function () {
                var dataStore = DS.Store.create({
                    container: get(this, "container")
                });

                dataStore.findQuery('statusmanagement', {}).then(function(queryResults) {

                    console.log('queryResults', queryResults);

                    var record = get(queryResults, 'content')[0];

                    //it is always translated this way
                    var errorMessage = __('Status management information not registered in database.') +
                        ' ' + __('Please contact your administrator.');

                    if (record) {

                        //generating form from record model
                        var recordWizard = formsUtils.showNew('modelform', record, {
                            title: __('Event settings edition'),
                        });

                        //submit form and it s callback
                        recordWizard.submit.then(function(form) {
                            console.log('record going to be saved', record, form);
                            notificationUtils.info(__('Status management information') + ' ' +__('updated'));

                            //generated data by user form fill
                            record = form.get('formContext');
                            record.save();

                        });
                    } else {
                        notificationUtils.error(errorMessage);
                    }
                });
            },

            /**
             * @event editDataclean
             * @descriptions Shows a Modelform to edit data cleaner options
             */
            editDataclean: function () {
                var dataStore = DS.Store.create({
                    container: get(this, "container")
                });

                dataStore.findQuery('datacleaner', {}).then(function(queryResults) {

                    console.log('queryResults', queryResults);

                    var record = get(queryResults, 'content')[0];

                    //it is always translated this way
                    var errorMessage = __('Engine data cleaner information not registered in database.') +
                        ' ' + __('Please contact your administrator.');

                    //generating form from record model
                    var recordWizard = formsUtils.showNew('modelform', record, {
                        title: __('Data clean edition'),
                    });

                    //submit form and it s callback
                    recordWizard.submit.then(function(form) {
                        console.log('record going to be saved', record, form);

                        notificationUtils.info(__('Engine data clean information') + ' ' +__('updated'));
                        //generated data by user form fill
                        record = form.get('formContext');
                        record.save();
                    });
                });
            },


             /**
             * @event editEnabledPlugins
             * @descriptions Shows a form to edit the canopsis UI enabled plugins
             */
            editEnabledPlugins: function() {
                var dataStore = DS.Store.create({
                    container: get(this, "container")
                });

                dataStore.findQuery('enabledmodules', {}).then(function(queryResults) {

                    console.log('queryResults', queryResults);

                    var record = get(queryResults, 'content')[0];

                    //generating form from record model
                    var recordWizard = formsUtils.showNew('modelform', record, {
                        title: __('Enabled plugins'),
                    });

                    var okMessage =__('Enabled plugins') + ' ' + _('information') + ' ' +__('updated');
                    //submit form and it s callback
                    recordWizard.submit.then(function(form) {
                        console.log('record going to be saved', record, form);

                        notificationUtils.info(okMessage);
                        //generated data by user form fill
                        record = form.get('formContext');
                        record.save();
                    });
                });

                dataStore.destroy();
            },

            /**
             * @event editTicketJob
             * @descriptions Shows a form to edit the tickets configuration
             */
            editTicketJob: function() {
                console.group('editTicketJob');

                var ticketConfig = get(this, 'ticketConfig');
                set(ticketConfig, 'crecord_type', 'ticket');

                console.log('ticketConfig:', ticketConfig);

                var job = get(ticketConfig, 'job');
                var params = get(job, 'params');

                console.log('job:', job, params);

                if(params) {
                    console.log('param subject', get(params, 'subject'));
                }

                var editForm = formsUtils.showNew('jobform', job, {
                    scheduled: false
                });

                editForm.submit.done(function(form) {
                    var job = get(form, 'formContext');
                    var params = get(job, 'params');

                    set(ticketConfig, 'job', job);
                    set(ticketConfig, 'job.params', params);

                    ticketConfig.save();
                });

                console.groupEnd();
            },

            /**
             * @event addNewView
             * @descriptions Shows a form to create a new userview
             */
            addNewView: function () {
                var type = "userview";
                var applicationController = this;
                console.log("add", type);

                var containerwidgetId = hashUtils.generateId('container');

                dataUtils.getStore().createRecord('widgetcontainer', {
                    xtype: 'widgetcontainer',
                    mixins : [{
                        name: 'verticallayout'
                    }],
                    id: containerwidgetId
                });

                var userview = dataUtils.getStore().push(type, {
                    id: hashUtils.generateId('userview'),
                    crecord_type: 'view',
                    containerwidget: containerwidgetId,
                    containerwidgetType: 'widgetcontainer'
                });

                console.log('temp record', userview);

                var recordWizard = formsUtils.showNew('modelform', userview, { title: __("Add ") + type });

                recordWizard.submit.done(function() {
                    set(applicationController, 'isLoading', get(applicationController, 'isLoading') + 1);
                    userview.save();
                    applicationController.transitionToRoute("/userview/" + get(userview, 'id'));
                });
            },

            /**
             * @event openTab
             * @descriptions Change frontend route to a new url
             * @param {string} url the new url to go to
             */
            openTab: function(url) {
                this.transitionToRoute(url);
            },

            /**
             * @event logout
             * @descriptions close the user session and go back to the login screen
             */
            logout: function() {
                get(this, 'controllers.login').setProperties({
                    'authkey': null,
                    'errors': []
                });

                window.location = '/logout';
            }
        }

    };

    var controller;

    if(canopsisConfiguration.DEBUG) {
        controller = PartialslotAbleController.extend(
            UserprofilestatusmenuMixin,
            SchemamanagerMixin,
            PromisemanagerMixin,
            ConsolemanagerMixin,
            NotificationsMixin,
            RequirejsmocksmanagerMixin,
            ScreentoolstatusmenuMixin,
            ApplicationControllerDict);
    } else {
        controller = PartialslotAbleController.extend(
            UserprofilestatusmenuMixin,
            ApplicationControllerDict);
    }

    loader.register('controller:application', controller);

    return controller;
});
