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
        init: function() {
            this._super();
            set(this, 'showOids', false);
            set(this, 'noSearch', false);
            this.loadMib();
        },

        loadMib: function () {
            var adapter = Application.__container__.lookup('adapter:snmpmib');
            set(this, 'adapter', adapter);
            var snmpoidComponent = this;
            var content = get(this, 'content');
            if (content) {
                var query = {
                    '_id': content,
                    'nodetype': 'notification',
                };

                get(this, 'adapter').findMib(
                    'snmpmib',
                    {
                        query: JSON.stringify(query),
                        limit: 1,
                    }
                ).then(function(results) {
                    if (results.success && results.data.length) {
                        console.log('found', results.data);
                        var label = get(results.data[0], 'name');
                        set(snmpoidComponent, 'noSearch', true);
                        set(snmpoidComponent, 'mibLabel', label);
                        var mibObjects = get(results.data[0], 'objects');

                        //make object list available to other form editors.
                        if (!isNone(mibObjects)) {
                            mibObjects = Object.keys(mibObjects);
                            var form = get(snmpoidComponent, 'crecord.form');
                            set(form, 'mibObjects', mibObjects);
                            console.log('set', mibObjects, 'to form', form);
                        }

                    }
                });
            }

        },

        onNameSearch: function () {

            //avoid loop search when item selected from list and label re-set
            if (get(this, 'noSearch')) {
                set(this, 'noSearch', false);
                return;
            }
            var snmpoidComponent = this;

            var search = get(this, 'mibLabel');

            if (search.length >= 3) {

                console.log('perform search', search);

                var query = {
                    'name': {'$regex': '.*' + search + '.*','$options':'i'},
                    'nodetype': 'notification',
                };

                var adapter = Application.__container__.lookup('adapter:snmpmib');

                //Do query entity link api
                adapter.findMib(
                    'snmpmib',
                    {
                        query: JSON.stringify(query),
                        limit: 10,
                    }
                ).then(function(results) {
                    if (results.success && results.data.length) {
                        console.log('found', results.data);
                        set(snmpoidComponent, 'showOids', true);
                        set(snmpoidComponent, 'oidElements', results.data);
                    }
                });
            }
        }.observes('mibLabel'),

        onModuleSearch: function () {
            //as this method is used in two cases, some information may vary
            var searchType = 'module';

            var info = {
                module: {
                    noSearch: 'noSearchModule',
                    searchText: 'moduleName',
                    searchField: 'moduleName',
                    listShow: 'showModules',
                    listElements: 'ModulesElements'

                },
                name: {
                    noSearch: 'noSearchName',
                    searchText: 'mibLabel',
                    searchField: 'name',
                    listShow: 'showOids',
                    listElements: 'oidElements'
                }
            }[searchType];


            //avoid loop search when item selected from list and label re-set
            if (get(this, info.noSearch)) {
                set(this, info.noSearch, false);
                return;
            }
            var snmpoidComponent = this;

            var search = get(this, info.searchText);

            if (search.length >= 3) {

                console.log('perform search',info.searchField, search);

                var searchField = info.searchField;

                var query = {
                    searchField: {'$regex': '.*' + search + '.*','$options':'i'},
                    'nodetype': 'notification',
                };

                //Additional query filter in case name is searched
                if (searchType === 'name') {
                    query.moduleName = get(this, 'moduleName');
                }

                var adapter = Application.__container__.lookup('adapter:snmpmib');

                //Do query entity link api
                adapter.findMib(
                    'snmpmib',
                    {
                        query: JSON.stringify(query),
                        limit: 10,
                    }
                ).then(function(results) {
                    if (results.success && results.data.length) {
                        console.log('found', results.data);
                        set(snmpoidComponent, info.listShow, true);
                        set(snmpoidComponent, info.listElements, results.data);
                    }
                });
            }
        }.observes('moduleName'),


        actions: {
            setOid: function (oidElement) {
                console.log(oidElement);
                var oid = get(oidElement, '_id');
                var label = get(oidElement, 'name');
                set(this, 'showOids', false);
                set(this, 'noSearch', true);
                set(this, 'content', oid);
                set(this, 'mibLabel', label);
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
