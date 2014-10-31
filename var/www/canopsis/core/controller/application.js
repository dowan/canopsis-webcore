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
    'app/mixins/usermenu',
    'app/mixins/schemamanager',
    'app/mixins/consolemanager',
    'app/mixins/promisemanager',
    'app/mixins/notifications',
    'utils',
    'app/lib/utils/forms',
    'app/lib/utils/data',
    'app/lib/utils/hash',
    'app/lib/utils/notification',
    'app/lib/utils/actions',
    'app/adapters/cservice',
    'app/adapters/notification',
    'app/serializers/cservice',
    'app/lib/loaders/helpers',
    'app/adapters/loggedaccount',
    'app/lib/loaders/helpers',
    'app/lib/wrappers/bootstrap',
    'app/lib/wrappers/mousetrap',
    'app/controller/recordinfopopup'
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
    UsermenuMixin,
    SchemamanagerMixin,
    ConsolemanagerMixin,
    PromisemanagerMixin,
    NotificationsMixin,
    utils,
    formsUtils,
    dataUtils,
    hashUtils,
    notificationUtils,
    actionsUtils) {

    var get = Ember.get,
        set = Ember.set,
        __ = Ember.String.loc;


    function bindKey(keyCombination, actionName) {
        Mousetrap.bind([keyCombination], function(e) {
            console.log('binding', arguments);
            actionsUtils.doAction(actionName);

            return false;
        });
    }

    Application.IndexController = Ember.Controller.extend(Ember.Evented, {});

    var controller = PartialslotAbleController.extend(
        SchemamanagerMixin, PromisemanagerMixin, ConsolemanagerMixin, NotificationsMixin, UsermenuMixin, {

        needs: ['login', 'recordinfopopup'],

        partials: {
            statusbar: ['schemamanagerstatusmenu', 'consolemanagerstatusmenu', 'notificationsstatusmenu', 'promisemanagerstatusmenu', 'userstatusmenu']
        },

        editMode: false,

        runtimeConfiguration: canopsisConfiguration,
        debug: Ember.computed.alias('canopsisConfiguration.DEBUG'),

        widgetsRegistry: widgetsRegistry,
        actionsRegistry: actionsRegistry,
        mixinsRegistry: mixinsRegistry,
        inflectionsRegistry: inflectionsRegistry,
        formsRegistry: formsRegistry,

        utils: utils,

        enginesviews: [
            Ember.Object.create({label: __('Events'), value: 'view.event'}),
            Ember.Object.create({label: __('Selectors'), value: 'view.selectors'}),
            Ember.Object.create({label: __('Scheduled Jobs'), value: 'view.jobs'}),
            Ember.Object.create({label: __('Event Filter'), value: 'view.filters'}),
            Ember.Object.create({label: __('Performance Data'), value: 'view.series'}),
            Ember.Object.create({label: __('Streaming'), value: 'view.streaming'})
        ],

        plugins:function(){
            var all_plugins = [];
            var plugins = Application.plugins;
            for ( var pluginName in plugins ){
                if( plugins.hasOwnProperty(pluginName)){
                    all_plugins.pushObject(plugins[pluginName] );
                }
            }
            return all_plugins;
        }.property(),

        init: function() {
            console.group('app init');
            notificationUtils.setController(this);

            var appController = this;

            var devtoolsStore = DS.Store.create({
                container: get(this, "container")
            });

            devtoolsStore.find('userview', 'view.app_devtools').then(function(queryResults) {
                set(appController, 'devtoolsUserview', queryResults);
            });

            console.log('finding cservices config');
            devtoolsStore.find('frontend', 'cservice.frontend').then(function(queryResults) {
                console.log('frontend config found');
                set(appController, 'frontendConfig', queryResults);
                // set(Canopsis, 'conf.frontendConfig', queryResults);

                var keybindings = get(appController, 'frontendConfig.keybindings');

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

            devtoolsStore.find('ticket', 'cservice.ticket').then(function(queryResults) {
                console.log('ticket config found');
                set(appController, 'ticketConfig', queryResults);
                // set(Canopsis, 'conf.ticketConfig', queryResults);
            });

            console.log('finding authentication backends config');

            devtoolsStore.find('ldapconfig', 'cservice.ldapconfig').then(function(queryResults) {
                console.log('ldap config found');
                set(appController, 'ldapConfig', queryResults);
                // set(Canopsis, 'conf.ldapConfig', queryResults);
            }, function() {
                console.log('create base ldap config');

                var record = devtoolsStore.createRecord('ldapconfig', {
                    crecord_type: 'ldapconfig'
                });

                record.id = 'cservice.ldapconfig';

                set(appController, 'ldapConfig', record);
                // set(Canopsis, 'conf.ldapConfig', record);
            });

            devtoolsStore.find('casconfig', 'cservice.casconfig').then(function(queryResults) {
                console.log('cas config found');
                set(appController, 'casConfig', queryResults);
                // set(Canopsis, 'conf.casConfig', queryResults);
            }, function() {
                console.log('create base cas config');

                var record = devtoolsStore.createRecord('casconfig', {
                    crecord_type: 'casconfig'
                });

                record.id = 'cservice.casconfig';

                set(appController, 'casConfig', record);
                // set(Canopsis, 'conf.casConfig', record);
            });

            var footerStore = DS.Store.create({
                container: get(this, "container")
            });

            set(this, "footerViewStore", footerStore);
            footerStore.find('userview', 'view.app_footer').then(function(queryResults) {
                set(appController, 'footerUserview', queryResults);
            });

            var headerStore = DS.Store.create({
                container: get(this, "container")
            });

            set(this, "headerViewStore", headerStore);

            headerStore.find('userview', 'view.app_header').then(function(queryResults) {
                set(appController, 'headerUserview', queryResults);
            });


            // console.groupEnd();
            this.refreshPartialsList();
            this._super.apply(this, arguments);

            //close the init group
            console.groupEnd();
            console.tags.remove('init');

        },


        actions: {
            promptReloadApplication: function(title, location) {
                setTimeout(function (){
                    console.log('in promptReloadApplication');
                    var recordWizard = formsUtils.showNew('confirmform', {}, {
                        title: __(title)
                    });

                    recordWizard.submit.then(function(form) {
                        if (Ember.isNone(location)) {
                            window.location = '/index.html';
                        } else {
                            window.location = location;
                        }
                    });
                }, 1500);
            },

            showUserProfile: function (){
                var applicationController = this;

                var ouser = get(utils, 'session');
                var recordWizard = formsUtils.showNew('modelform', ouser, {
                    title: get(ouser, '_id') + ' ' + __('profile')
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

                    //generating form from record model
                    var recordWizard = formsUtils.showNew('modelform', record, {
                        title: __('Event settings edition'),
                    });

                    //submit form and it s callback
                    recordWizard.submit.then(function(form) {
                        console.log('record going to be saved', record, form);

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
                    ticketConfig.set('job', job);
                    ticketConfig.save();
                });

                console.groupEnd();
            },

            editLdapConfig: function() {
                console.log('editLdapConfig');

                var ldapConfig = get(this, 'ldapConfig');
                var editForm = formsUtils.showNew('modelform', ldapConfig, { title: __('Edit LDAP configuration') });
                editForm.submit.done(function() {
                    ldapConfig.save();
                });
            },

            editCasConfig: function() {
                console.log('editCasConfig');

                var casConfig = get(this, 'casConfig');
                var editForm = formsUtils.showNew('modelform', casConfig, { title: __('Edit CAS configuration') });
                editForm.submit.done(function() {
                    casConfig.save();
                });
            },

            addNewView: function () {
                var type = "userview";
                var applicationController = this;
                console.log("add", type);

                var containerwidgetId = hashUtils.generateId('container');

                var containerwidget = dataUtils.getStore().createRecord('verticalbox', {
                    xtype: 'verticalbox',
                    id: containerwidgetId
                });

                var userview = dataUtils.getStore().push(type, {
                    id: hashUtils.generateId('userview'),
                    crecord_type: 'view',
                    containerwidget: containerwidgetId,
                    containerwidgetType: 'verticalbox'
                });

                console.log('temp record', userview);

                var recordWizard = formsUtils.showNew('modelform', userview, { title: __("Add ") + type });

                function transitionToView(userview) {
                    console.log('userview saved, switch to the newly created view');
                    applicationController.send('showView', get(userview, 'id'));
                }

                recordWizard.submit.done(function() {
                    console.log("userview.save()");
                    console.log(userview.save());
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
