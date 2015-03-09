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
    'app/lib/factories/mixin',
    'app/view/draggablewidgeticon',
    'app/view/placedwidget'
], function(Ember, Mixin) {

    var get = Ember.get;


    var mixin = Mixin('fixedlayout', {
        partials: {
            layout: ['fixedlayout']
        },

        unplacedWidgets: function() {
            return get(this, 'content.items').filter(function(item){
                if(!get(item, 'position')) {
                    return true;
                }
            });
        }.property('content.items'),

        placedWidgets: function() {
            return get(this, 'content.items').filter(function(item){
                if(item.position && item.position.left && item.position.top) {
                    return true;
                }
            });
        }.property('content.items'),

        rowsEmptyArray: function(){
            var timesArray = [];

            for(var i = 0, l = this.get('mixinOptions.fixedlayout.rowNumber'); i < l; i++) {
                timesArray[i] = i;
            }

            return timesArray;
        }.property('mixinOptions.fixedlayout.rowNumber'),

        columnsEmptyArray: function(){
            var timesArray = [];

            for(var i = 0, l = this.get('mixinOptions.fixedlayout.columnNumber'); i < l; i++) {
                timesArray[i]=i;
            }

            return timesArray;
        }.property('mixinOptions.fixedlayout.columnNumber')

    });

    return mixin;
});
