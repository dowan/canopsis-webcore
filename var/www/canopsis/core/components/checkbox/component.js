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
    'app/lib/wrappers/icheck'
], function(Ember, DS, Application) {

    var set = Ember.set,
        get = Ember.get;

    var component = Ember.Component.extend({
        didInsertElement: function(){
            var $input = this.$('input');

            Ember.assert('There is no checkbox in the DOM of the checkbox component.', !Ember.isNone($input));

            $input.iCheck({
                checkboxClass: 'icheckbox_minimal-grey',
                radioClass: 'iradio_minimal-grey'
            });

            var checkboxComponent = this;
            $input.on('ifChecked', function(){
                set(checkboxComponent, 'checked', true);
            });

            $input.on('ifUnchecked', function(){
                set(checkboxComponent, 'checked', false);
            });
        },

        checkedChanged: function(){
            console.log('checked changed');
            var $input = this.$('input');

            if(get(this, 'checked')) {
                $input.iCheck('check');
            } else {
                $input.iCheck('uncheck');
            }
        }.observes('checked'),

        willRemoveElement: function() {
            console.log('destroy checkbox', this);
            var $input = this.$('input');

            Ember.assert('There is no checkbox in the DOM of the checkbox component.', !Ember.isNone($input));

            $input.iCheck('destroy');
        }
    });

    Application.ComponentCheckboxComponent = component;

    return component;
});
