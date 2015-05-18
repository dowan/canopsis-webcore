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

            var adapter = Application.__container__.lookup('adapter:snmpmib');
            set(this, 'adapter', adapter);
            var snmpoidComponent = this;
            var content = get(this, 'content');
            //default value in case nothing is found
            set(this, 'label', content);

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
                        var label = get(results.data[0], 'name');
                        if(label) {
                            set(snmpoidComponent, 'label', label);
                        }
                    }
                });
            }

        }

    });

    Ember.Application.initializer({
        name:'component-snmpoidrenderer',
        initialize: function(container, application) {
            application.register('component:component-snmpoidrenderer', component);
        }
    });

    return component;
});
