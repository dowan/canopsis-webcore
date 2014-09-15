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
    'ember-data',
    'app/application',
    'app/controller/partialslotablecontroller',
    'app/mixins/usermenu',
    'app/mixins/schemamanager',
    'app/mixins/consolemanager',
    'app/mixins/notifications',
    'app/routes/application',
    'utils',
    'app/lib/utils/forms',
    'app/adapters/cservice',
    'app/adapters/notification',
    'app/serializers/cservice'
], function(Ember, DS, Application, PartialslotAbleController, UsermenuMixin, SchemamanagerMixin, ConsolemanagerMixin, NotificationsMixin, ApplicationRoute, utils, formUtils) {
    var get = Ember.get,
        set = Ember.set;

    Application.ApplicationController = PartialslotAbleController.extend(
        SchemamanagerMixin, ConsolemanagerMixin, NotificationsMixin, UsermenuMixin, {
        needs: ['login'],

        utils: utils,

        enginesviews: [
            Ember.Object.create({ label: __("Events"), value: 'view.event'}),
            Ember.Object.create({ label: __("Selectors"), value: 'view.selectors'}),
            Ember.Object.create({ label: __("Scheduled Jobs"), value: 'view.jobs'}),
            Ember.Object.create({ label: __("Event Filter"), value: 'view.filters'})
        ],


        plugins:function(){
            var all_plugins = [];
            var plugins = Application.plugins ;
            for ( var pluginName in plugins ){
                if( plugins.hasOwnProperty(pluginName)){
                    all_plugins.push(plugins[pluginName] );
                }
            }
            return all_plugins;
        }.property(),

        init: function() {
            console.group('app init');
            utils.notification.controller = this;

            var appController = this;

            var headerStore = DS.Store.create({
                container: get(this, "container")
            });

            set(this, "headerViewStore", headerStore);

            headerStore.find('userview', 'view.app_header').then(function(queryResults) {
                set(appController, 'headerUserview', queryResults);
            });

            var indexStore = DS.Store.create({
                container: get(this, "container")
            });

            set(this, "indexViewStore", indexStore);

            indexStore.find('userview', 'view.app_index').then(function(queryResults) {
                set(appController, 'indexUserview', queryResults);
            });

            console.log('finding cservices config');
            headerStore.find('frontend', 'cservice.frontend').then(function(queryResults) {
                console.log('frontend config found');
                set(appController, 'frontendConfig', queryResults);
                set(Canopsis, 'conf.frontendConfig', queryResults);
            });

            headerStore.find('ticket', 'cservice.ticket').then(function(queryResults) {
                console.log('ticket config found');
                set(appController, 'ticketConfig', queryResults);
                set(Canopsis, 'conf.ticketConfig', queryResults);
            });

            console.log('finding authentication backends config');

            headerStore.find('ldapconfig', 'ldap.config').then(function(queryResults) {
                console.log('ldap config found');
                set(appController, 'ldapConfig', queryResults);
                set(Canopsis, 'conf.ldapConfig', queryResults);
            }, function() {
                console.log('create base ldap config');

                var record = headerStore.createRecord('ldapconfig', {
                    crecord_type: 'ldapconfig'
                });

                record.id = 'ldap.config';

                set(appController, 'ldapConfig', record);
                set(Canopsis, 'conf.ldapConfig', record);
            });

            headerStore.find('casconfig', 'cas.config').then(function(queryResults) {
                console.log('cas config found');
                set(appController, 'casConfig', queryResults);
                set(Canopsis, 'conf.casConfig', queryResults);
            }, function() {
                console.log('create base cas config');

                var record = headerStore.createRecord('casconfig', {
                    crecord_type: 'casconfig'
                });

                record.id = 'cas.config';

                set(appController, 'casConfig', record);
                set(Canopsis, 'conf.casConfig', record);
            });

            var footerStore = DS.Store.create({
                container: get(this, "container")
            });

            set(this, "footerViewStore", footerStore);
            footerStore.find('userview', 'view.app_footer').then(function(queryResults) {
                set(appController, 'footerUserview', queryResults);
            });

            console.groupEnd();
            this._super.apply(this, arguments);
        },

        username: function () {
            return this.get('controllers.login').get('username');
        }.property('controllers.login.username'),

        actions: {

            promptReloadApplication: function(title, location) {
                setTimeout(function (){
                    console.log('in promptReloadApplication');
                    var recordWizard = Canopsis.utils.forms.showNew('confirmform', {}, {
                        title: __(title)
                    });

                    recordWizard.submit.then(function(form) {
                        if (Ember.isNone(location)) {
                            window.location = '/index.html';
                        } else {
                            window.location = location;
                        }
                    });
                },1500);
            },

            showUserProfile: function (){

                var applicationController = this;

                var username = utils.session.get('username');

                var dataStore = DS.Store.create({
                    container: this.get("container")
                });

                var record = dataStore.findQuery('account', {
                    filter: JSON.stringify({
                        user: username
                    })
                }).then(function(queryResults) {
                    console.log('query result', queryResults);
                    var record = queryResults.get('content')[0];
                    var previousUiLanguage = get(record, 'ui_language');
                    console.log('previousUiLanguage', previousUiLanguage);
                    //generating form from record model
                    var recordWizard = utils.forms.showNew('modelform', record, {
                        title: username +' '+__('profile'),
                        filterFieldByKey: {
                            'firstname': {readOnly : true},
                            'lastname': {readOnly : true},
                            'authkey': {readOnly : true},
                            'mail': true,
                            'ui_language': true
                        }
                    });

                    //submit form and it s callback
                    recordWizard.submit.then(function(form) {
                        console.log('record going to be saved', record, form);

                        //generated data by user form fill
                        record = form.get('formContext');

                        record.save();

                        utils.notification.info(__('profile') + ' ' +__('updated'));
                        console.log(get(record, 'ui_language') , previousUiLanguage);
                        if (get(record, 'ui_language') !== previousUiLanguage) {
                            console.log('Language changed, will prompt for application reload');
                            applicationController.send(
                                'promptReloadApplication',
                                'Interface language has changed, reload canopsis to apply changes ?'
                            );
                        }


                    });
                });


            },

            editConfig: function() {
                console.log('editConfig', formUtils);
                var frontendConfig = get(this, 'frontendConfig');
                var editForm = formUtils.showNew('modelform', frontendConfig, { title: __("Edit settings"), inspectedItemType: "frontend" });
                editForm.submit.done(function() {
                    frontendConfig.save();
                });
            },

            editTicketJob: function() {
                console.group('editTicketJob');

                var ticketConfig = get(this, 'ticketConfig');

                console.log('ticketConfig:', ticketConfig);

                var job = ticketConfig.get('job');
                var params = job.get('params');

                console.log('job:', job, params);

                if(params) {
                    console.log('param subject', params.get('subject'));
                }

                var editForm = formUtils.showNew('jobform', job, {
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
                var editForm = formUtils.showNew('modelform', ldapConfig, { title: __('Edit LDAP configuration') });
                editForm.submit.done(function() {
                    ldapConfig.save();
                });
            },

            editCasConfig: function() {
                console.log('editCasConfig');

                var casConfig = get(this, 'casConfig');
                var editForm = formUtils.showNew('modelform', casConfig, { title: __('Edit CAS configuration') });
                editForm.submit.done(function() {
                    casConfig.save();
                });
            },

            toggleEditMode: function() {
                if (Canopsis.editMode === true) {
                    console.info('Entering edit mode');
                    set(Canopsis, 'editMode', false);
                } else {
                    console.info('Leaving edit mode');
                    set(Canopsis, 'editMode', true);
                }
            },

            addNewView: function () {
                var type = "userview";
                var applicationController = this;
                console.log("add", type);

                var containerwidgetId = utils.hash.generateId('container');

                var containerwidget = Canopsis.utils.data.getStore().createRecord('verticalbox', {
                    xtype: 'verticalbox',
                    id: containerwidgetId
                });

                var userview = Canopsis.utils.data.getStore().push(type, {
                    id: utils.hash.generateId('userview'),
                    crecord_type: 'view',
                    containerwidget: containerwidgetId,
                    containerwidgetType: 'verticalbox'
                });

                console.log('temp record', userview);

                var recordWizard = Canopsis.utils.forms.showNew('modelform', userview, { title: __("Add ") + type });

                function transitionToView(userview) {
                    console.log('userview saved, switch to the newly created view');
                    applicationController.send('showView', userview.get('id'));
                }

                recordWizard.submit.done(function() {
                    console.log("userview.save()");
                    console.log(userview.save());
                    applicationController.transitionToRoute("/userview/" + userview.get('id'));
                });
            },

            openTab: function(url) {
                this.transitionToRoute(url);
            },

            addModelInstance: function(type) {
                console.log("add", type);

                var record = Canopsis.utils.data.getStore().createRecord(type, {
                    crecord_type: type.underscore()
                });
                console.log('temp record', record);

                var recordWizard = Canopsis.utils.forms.showNew('modelform', record, { title: __("Add ") + type });

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

    void (utils);
    return Application.ApplicationController;
});
