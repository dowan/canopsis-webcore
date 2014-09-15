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
    'app/components/progressbar/component'
], function($, WidgetFactory) {
    var get = Ember.get;

    var widget = WidgetFactory('progressbar', {
        init: function() {
            this._super();
            this.set("value" , 26);
            this.set("bad_when_full" , false);
            this.set("ressource" , "cpu");
        },

        actions: {
            changevalue:function(){
                var value = $('#changevalue').val();
                var test = $('#bad_when_full');
                var bad_when_full = $('#bad_when_full')[0].checked ;

                this.set("value", value);
                this.set("bad_when_full", bad_when_full);

            }
        }

    });

    return widget;
});
