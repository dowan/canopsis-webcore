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
    'app/application'
], function(Ember, Application) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;


    var component = Ember.Component.extend({

        selectModuleLabel: __('Select a mib module'),

        init: function() {
            this._super();
            set(this, 'showOids', false);
            set(this, 'noSearchModule', false);
            set(this, 'noSearchName', false);
            window.$OID = this;
        },

        didInsertElement: function () {
            this.loadMib();
        },

        loadMib: function () {

            var adapter = Application.__container__.lookup('adapter:snmpmib');

            var snmpoidComponent = this;

            var content = get(this, 'content');

            if (content) {

                var query = {
                    'name': content.mibName,
                    'moduleName': content.moduleName,
                    'nodetype': 'notification',
                };

                snmpoidComponent.send(
                    'setModule',
                    content.moduleName,
                    function () {
                        //initialize component with existing value.
                        set(snmpoidComponent, 'mibName', content.mibName);
                    }
                );

            } else {
                set(snmpoidComponent, 'content', {
                    moduleName: '',
                    oid: '',
                    mibName: ''
                });
            }

        },

        setMibObjects: function (mibObjects) {
            //make object list available to other form editors.
            if (!isNone(mibObjects)) {
                mibObjects = Object.keys(mibObjects);
                var form = get(this, 'crecord.form');
                set(form, 'mibObjects', mibObjects);
                console.log('set', mibObjects, 'to form', form);
            }
        },

        onModuleSearch: function () {

            //avoid loop search when item selected from list and label re-set
            if (get(this, 'noSearchModule')) {
                set(this, 'noSearchModule', false);
                return;
            }
            var snmpoidComponent = this;

            var search = get(this, 'moduleName');

            if (search.length >= 3) {

                console.log('perform search', search);

                var query = {
                    'nodetype': 'notification',
                    'moduleName' : {'$regex': '.*' + search + '.*','$options':'i'}
                };

                var adapter = Application.__container__.lookup('adapter:snmpmib');

                //Do query to snmp api
                adapter.findMib(
                    'snmpmib',
                    {
                        query: JSON.stringify(query),
                        limit: 10,
                    }
                ).then(function(results) {
                    if (results.success && results.data.length) {
                        console.log('found', results.data);
                        set(snmpoidComponent, 'showModules', true);
                        var len = results.data.length;
                        var modules = {};
                        for(var i=0; i<len; i++) {
                            modules[results.data[i].moduleName] = 1;
                        }
                        var modulesList = Object.keys(modules);
                        set(snmpoidComponent, 'modulesElements', modulesList);

                    }
                });
            }
        }.observes('moduleName'),


        onNameSearch: function (callback) {

            var snmpoidComponent = this;

            var query = {
                nodetype: 'notification',
                moduleName: get(this, 'moduleName')
            };

            var adapter = Application.__container__.lookup('adapter:snmpmib');

            //Do query to snmp api
            adapter.findMib(
                'snmpmib',
                {
                    query: JSON.stringify(query),
                    limit: 0,
                }
            ).then(function(results) {
                if (results.success && results.data.length) {
                    console.log('found', results.data);
                    set(snmpoidComponent, 'mibNames', results.data);
                    var len = results.data.length;
                    var names = {};
                    for(var i=0; i<len; i++) {
                        names[results.data[i].name] = results.data[i];
                    }
                    set(snmpoidComponent, 'names', names);

                    if (!isNone(callback)) {
                        callback();
                    } else {
                        //Force combobox selection/initialization on load
                        var namesList = Object.keys(names);
                        if(namesList.length && isNone(get(snmpoidComponent, 'mibName'))) {
                            set(snmpoidComponent, 'mibName', namesList[0]);
                        }
                    }
                }
            });

        },

        onNameUpdate: function () {

            //avoid loop search when item selected from list and label re-set
            if (get(this, 'noSearchName')) {
                set(this, 'noSearchName', false);
                return;
            }

            var label = get(this, 'mibName');
            var mib = get(this, 'names')[label];

            //got mib info when selected module
            console.log('selected mib', label, mib);

            this.setMibObjects(get(mib, 'objects'));

            //Set description for user display purpose.
            set(this, 'mibDescription', get(mib, 'description'));

            //Update editor content
            Ember.setProperties(this, {
                'content.mibName': label,
                'content.oid': mib._id,
            });


        }.observes('mibName'),

        actions: {

            setModule: function (label, callback) {
                console.log(label);
                Ember.setProperties(this, {
                    'showModules': false,
                    'noSearchModule': true,
                    'content.moduleName': label,
                    'moduleName': label,
                });
                this.onNameSearch(callback);
            }
        }
    });

    Ember.Application.initializer({
        name:'component-snmpoid',
        initialize: function(container, application) {
            application.register('component:component-snmpoid', component);
        }
    });

    return component;
});
