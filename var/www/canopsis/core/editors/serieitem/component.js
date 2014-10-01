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
    'app/application',
    'app/editors/modelselect/component'
], function(Ember, Application) {

    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        init: function() {
            this._super(arguments);

            set(this, "componentDataStore", DS.Store.create({
                container: get(this, "container")
            }));

            var typekey = get(this, 'content.model.options.model');
            var typekeySplit = typekey.split('.');

            var modelname = typekeySplit[typekeySplit.length - 1];
            var model = Application[modelname.capitalize()].proto();
            console.log('Fetch model:', modelname, model);

            var item = {};

            console.group('Create virtual attributes for serieitem:');
            model.eachAttribute(function(name, attr) {
                var val = get(this, 'content.value.' + name);
                var defaultVal = get(attr, 'defaultValue');

                item[name] = {
                    value: val || defaultVal,
                    model: attr
                };

                console.log(name, val, defaultVal, item[name]);
            });

            console.groupEnd();

            set(this, 'item', item);
        },

        serieChanged: function() {
            var val = get(this, 'item.serie.value');
            set(this, 'content.value.serie', val);
        }.observes('item.serie.value'),

        curveChanged: function() {
            var val = get(this, 'item.curve.value');
            set(this, 'content.value.curve', val);
        }.observes('item.curve.value'),

        colorChanged: function() {
            var val = get(this, 'item.color.value');
            set(this, 'content.value.color', val);
        }.observes('item.color.value')
    });

    Application.ComponentSerieitemComponent = component;

    return component;
});
