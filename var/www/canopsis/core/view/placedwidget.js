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
    'jquery',
    'ember',
    'app/view/widgetslot',
    'jqueryui',
], function($, Ember, WidgetslotView) {

    /**
     * This view is used in the fixed layout mixin
     */
    // var view = WidgetslotView.extend({
    //     templateName:'widgetslot-default',

    //     didInsertElement: function() {
    //         var table  = this.$().parent().children('table');

    //         var rowNumber = table.find('tr').length;
    //         var colNumber = $(table.find('tr')[0]).find('td').length;

    //         var grid_x = table.width() / colNumber;
    //         var grid_y = table.height() / rowNumber;

    //         // this.$().css({
    //         //     'position': 'relative',
    //         //     'top': grid_y * this.widgetslot.position.top,
    //         //     'left': grid_x * this.widgetslot.position.left
    //         // });

    //         // console.log('>> ws', this.get('widgetslot'));

    //     }
    // });

    var get = Ember.get,
        set = Ember.set;

    var view = WidgetslotView.extend({
        didInsertElement: function() {
            var table  = this.$().parent().parent().children('table');

            var rowNumber = table.find('tr').length;
            var colNumber = $(table.find('tr')[0]).find('td').length;

            var grid_x = table.width() / colNumber;
            var grid_y = table.height() / rowNumber;

            this.$().css({
                'position': 'relative',
                'top': grid_y * (this.item.position.top + 1),
                'left': grid_x * this.item.position.left,
                'width': grid_x,
                'height': grid_y
            });
        }
    });


    loader.register('view:placedwidget', view);

    Ember.Handlebars.helper('placedwidget', view);

    return view;
});
