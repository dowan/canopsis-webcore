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
    'utils'
], function(Ember, Application, cutils) {

    Application.ComponentSessionComponent = Ember.Component.extend({
        fieldValue: function() {
            var key = this.get('attr.model.options.valueFrom');
            var value = cutils.session[key];

            console.group('editor-session');
            console.log('key:', key);
            console.log('value:', value);
            console.groupEnd();

            return value;
        }.property('attr.field'),

        init: function() {
            this._super(arguments);

            if(this.get('attr.value') === undefined) {
                this.set('attr.value', this.get('fieldValue'));
            }
        }
    });

    return Application.ComponentSessionComponent;
});
