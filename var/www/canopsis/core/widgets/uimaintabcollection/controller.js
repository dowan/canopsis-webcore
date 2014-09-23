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
    'app/lib/factories/widget',
    'app/lib/wrappers/bootstrap'
], function($, WidgetFactory) {

    var get = Ember.get,
        set = Ember.set;


    var UimaintabcollectionViewMixin = Ember.Mixin.create({
        didInsertElement: function() {
            var $dropdowns = this.$('.dropdown-toggle');

            console.log('didInsertElement', $dropdowns);

            if($dropdowns) {
                $dropdowns.dropdown();
            }

            this._super.apply(this, arguments);
        }
    });

    var widget = WidgetFactory('uimaintabcollection',{
        needs: ['application'],
        viewMixins: [
            UimaintabcollectionViewMixin
        ],

        currentViewId: Ember.computed.alias('controllers.application.currentViewId'),
        tagName: 'span',

        preparedTabs: function() {
            var uimaintabcollectionController = this;

            var res = Ember.A();

            get(this, 'tabs').forEach(function(item, index) {
                if(item.value === get(uimaintabcollectionController, 'currentViewId')) {
                    item.isActive = true;
                } else {
                    item.isActive = false;
                }
                res.push(item);
            });

            return res;
        }.property('tabs', 'currentViewId'),

        actions: {
            do: function(action, params) {
                if(params === undefined || params === null){
                    params = [];
                }

                this.send(action, params);
            },
            testAction: function() {
                console.log('testAction');
            }
        }
    });

    return widget;
});
