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
    'app/mixins/schemamanager',
    'app/mixins/consolemanager',
    'app/mixins/promisemanager',
    'app/mixins/notifications',
    'utils',
    'app/lib/utils/forms',
    'app/lib/utils/data',
    'app/lib/utils/hash',
    'app/lib/utils/notification',
    'app/adapters/cservice',
    'app/adapters/notification',
    'app/serializers/cservice',
    'app/lib/loaders/helpers',
    'app/adapters/loggedaccount',
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

    var controller = PartialslotAbleController.extend(
        SchemamanagerMixin, PromisemanagerMixin, ConsolemanagerMixin, NotificationsMixin, {

        needs: ['login', 'recordinfopopup'],

        partials: {
            statusbar: []
        },

        editMode: false,

        runtimeConfiguration: canopsisConfiguration,
        debug: Ember.computed.alias('runtimeConfiguration.DEBUG'),

        widgetsRegistry: widgetsRegistry,
        actionsRegistry: actionsRegistry,
        mixinsRegistry: mixinsRegistry,
        inflectionsRegistry: inflectionsRegistry,
        formsRegistry: formsRegistry,

        isLoading:0,

        utils: utils,

        enginesviews: [
            {label: __('Selectors'), value: 'view.selectors'},
            {label: __('Scheduled Jobs'), value: 'view.jobs'},
            {label: __('Event Filter'), value: 'view.filters'},
            {label: __('Performance Data'), value: 'view.series'},
        ],

        plugins:function(){
            var all_plugins = [];
            var plugins = Application.plugins;
            for(var pluginName in plugins) {
                if(plugins.hasOwnProperty(pluginName)){
                    all_plugins.pushObject(plugins[pluginName]);
                }
            }
            return all_plugins;
        }.property(),

        init: function() {
            console.group('app init');
            notificationUtils.setController(this);

            if(canopsisConfiguration.DEBUG) {
                this.partials.statusbar.pushObject('schemamanagerstatusmenu');
                this.partials.statusbar.pushObject('consolemanagerstatusmenu' );
                this.partials.statusbar.pushObject('notificationsstatusmenu');
                this.partials.statusbar.pushObject('promisemanagerstatusmenu');
            }

            this.partials.statusbar.pushObject('userstatusmenu');

            var appController = this;

            var devtoolsStore = DS.Store.create({
                container: get(this, "container")
            });

            set(this, 'devtoolsStore', devtoolsStore);

            console.log('finding authentication backends config');

            //TODO refactor this in application route
            appController.authConfig('authconfiguration', function (authconfigurationRecord) {

                var serviceList = get(authconfigurationRecord, 'services');

                console.log('authconfigurationRecord', authconfigurationRecord, serviceList);

                if(!isNone(serviceList)) {
                    var length = serviceList.length;
                    for(var i = 0 ; i < length; i++) {
                        //this test avoids empty strings
                        if(serviceList[i]) {
                            appController.authConfig(serviceList[i]);
                        }
                    }
                }
            });

            console.groupEnd();
            this.refreshPartialsList();
            this._super.apply(this, arguments);

            //close the init group
            console.groupEnd();
            console.tags.remove('init');
        },

        authConfig: function (authType, callback) {

            var authId = 'cservice.' + authType;
            var appController = this;
            var store = get(this, 'devtoolsStore');

            var onReadyRecord = function(appController, authType, record, callback) {
                set(appController, authType, record);

                if(!isNone(callback)) {
                    callback(record);
                }
            };

            store.find(authType, authId).then(function(queryResults) {

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

        },

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

            editAuthConfiguration: function(authType) {
                console.log('edit ' + authType);
                this.editAuthConfig(authType);
            },

            prompt:function (message) {
                formsUtils.showNew('confirmform', {}, {
                    title: __(message)
                });
            },

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

            showUserProfile: function () {
                var applicationController = this;

                var ouser = get(utils, 'session');
                var recordWizard = formsUtils.showNew('modelform', ouser, {
                    title: get(ouser, '_id') + ' ' + __('profile'),
                    filterFieldByKey: {
                        firstname: {readOnly: true},
                        lastname: {readOnly: true},
                        authkey: {readOnly: true},
                        ui_language: true,
                        mail: true,
                        userpreferences: true,
                    }
                });

                recordWizard.submit.then(function(form) {
                    console.group('submit form:', form);

                    //generated data by user form fill
                    record = form.get('formContext');
                    console.log('save record:', record);

                    set(record, 'crecord_type', 'user');
                    record.save();

                    notificationUtils.info(__('profile') + ' ' +__('updated'));

                    uilang = get(record, 'ui_language');
                    ouilang = get(ouser, 'ui_language');

                    console.log('Lang:', uilang, ouilang);

                    if (uilang !== ouilang) {
                        console.log('Language changed, will prompt for application reload');
                        applicationController.send(
                            'promptReloadApplication',
                            'Interface language has changed, reload canopsis to apply changes ?'
                        );
                    }

                    console.groupEnd();
                });
            },

            editEventSettings: function () {

                var applicationController = this;

                var dataStore = DS.Store.create({
                    container: get(this, "container")
                });

                var record = dataStore.findQuery('statusmanagement', {}).then(function(queryResults) {

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

            editDataclean: function () {

                var applicationController = this;

                var dataStore = DS.Store.create({
                    container: get(this, "container")
                });

                var record = dataStore.findQuery('datacleaner', {}).then(function(queryResults) {

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

            editConfig: function() {
                var frontendConfig = get(this, 'frontendConfig');
                console.log('editConfig', formsUtils, frontendConfig);

                var editForm = formsUtils.showNew('modelform', frontendConfig, { title: __("Edit settings"), inspectedItemType: "frontend" });
                editForm.submit.done(function() {
                    frontendConfig.save();
                });
            },

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

                editForm.submit.done(function() {
                    set(ticketConfig, 'job', job);
                    ticketConfig.save();
                });

                console.groupEnd();
            },

            addNewView: function () {
                var type = "userview";
                var applicationController = this;
                console.log("add", type);

                var containerwidgetId = hashUtils.generateId('container');

                var containerwidget = dataUtils.getStore().createRecord('widgetcontainer', {
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

                function transitionToView(userview) {
                    console.log('userview saved, switch to the newly created view');
                    applicationController.send('showView', get(userview, 'id'));
                }

                recordWizard.submit.done(function() {
                    set(applicationController, 'isLoading', get(applicationController, 'isLoading') + 1);
                    userview.save();
                    applicationController.transitionToRoute("/userview/" + get(userview, 'id'));
                });
            },

            openTab: function(url) {
                this.transitionToRoute(url);
            },

            addModelInstance: function(type) {
                console.log("add", type);

                var record = dataUtils.getStore().createRecord(type, {
                    crecord_type: type.underscore()
                });

                console.log('temp record', record);

                var recordWizard = formsUtils.showNew('modelform', record, { title: __("Add ") + type });

                recordWizard.submit.done(function() {
                    record.save();
                });
            },

            logout: function() {
                get(this, 'controllers.login').setProperties({
                    'authkey': null,
                    'errors': []
                });

                window.location = '/logout';
            }
        }

    });

    loader.register('controller:application', controller);

    void (utils);
    return controller;
});
