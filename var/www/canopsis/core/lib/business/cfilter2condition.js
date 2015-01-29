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

define(['ember'], function(Ember) {

    var get = Ember.get,
        set = Ember.set;


    var Condition = Ember.Object.extend({


        init: function () {
            this.setProperties({
                'conditions': [],
                'clauses': []
            });
        },

        jsonstring: function () {
            var json = get(this, 'json');
            json = JSON.stringify(json, undefined, 2);
            return json;
        }.property('json'),

        json: function () {

            var json = {
                conditions: [],
                clauses: [],
                label: get(this, 'label'),
                value: get(this, 'value'),
            };

            var itemList = ['conditions', 'clauses'];
            var listlen = itemList.length;


            for (var j=0; j<listlen; j++) {

                var selectedItem = itemList[j];
                var itemArray = get(this, selectedItem);
                var len = itemArray.length;

                for (var i=0; i<len;i++) {
                    var treeNode = itemArray[i];
                    json[selectedItem].push(get(treeNode, 'json'));
                }
            }

            console.log('condition json', json);

            return json;

        }.property('conditions', 'clauses')

    });


    return Condition;
});
