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
    'app/lib/utils/forms',
    'app/lib/utils/hash',
    'app/lib/factories/mixin',
    'webcore-libs/stacktable/stacktable',
    'link!webcore-libs/stacktable/stacktable.css'
], function(Ember, formsUtils, hashUtils, Mixin) {

    var get = Ember.get,
        set = Ember.set;


    function getColumnIndexesPriorities(viewMixin) {
        var stackableColumnsPriority = get(viewMixin, 'controller.stackableColumnsPriority');
        var controller = get(viewMixin, 'controller');
        var shownColumns = get(controller, 'shown_columns');

        columnStackingPriority = Ember.A();

        console.log('stackableColumnsPriority', stackableColumnsPriority, shownColumns);
        for (var i = 0, l = stackableColumnsPriority.length; i < l; i++) {
            var currentColumn = shownColumns.findBy('field', stackableColumnsPriority[i]);
            if(currentColumn !== undefined) {
                console.log('currentColumn', currentColumn);
                var columnIndex = Ember.get(currentColumn, 'index');
                console.log('columnIndex', columnIndex);
                columnStackingPriority.pushObject(columnIndex);
            }
        }

        return columnStackingPriority;
    }

    function hideColumn(viewMixin, columnToHide) {
        console.log('hideColumn', columnToHide);

        if(!!columnToHide) {
            this.$('th.' + columnToHide.field).css("display", "none");
            this.$('td.' + columnToHide.field).css("display", "none");
            get(viewMixin, 'groupedColumns').pushObject(columnToHide);
            viewMixin.notifyPropertyChange('groupedColumns');
        }
    }


    function checkToToggleStackedDisplay(viewMixin, thresholds, tableContainerWidth, tableWidth) {
        var isTableOverflowing = tableContainerWidth < tableWidth;

        var controller = get(viewMixin, 'controller');
        var shownColumns = get(controller, 'shown_columns');
        var columnStackingPriority = getColumnIndexesPriorities(viewMixin);
        console.log('columnStackingPriority', columnStackingPriority);

        if(isTableOverflowing) {
            console.group('table overflowing, starting shrink loop');
            var i = -1;
            var newTableWidth = tableWidth;

            while(isTableOverflowing) {
                i++;

                console.log('while shownColumns[i]', i, shownColumns, shownColumns[i], columnStackingPriority);

                if(shownColumns[i] !== undefined) {
                    if(columnStackingPriority[i] === undefined) {
                        console.log('no stacking priority, return', i, columnStackingPriority);
                        return;
                    }

                    hideColumn(viewMixin, shownColumns[columnStackingPriority[i]]);

                    newTableWidth -= shownColumns[i].width;
                    isTableOverflowing = tableContainerWidth < newTableWidth;
                }
            }
            console.groupEnd();
        }
    }


    function getTableThresholds(viewMixin) {
        var controller = get(viewMixin, 'controller');

        var shownColumns = get(controller, 'shown_columns');
        for (var i = 0, l = shownColumns.length; i < shownColumns.length; i++) {
            set(shownColumns[i], 'width', this.$('th.' + shownColumns[i].field).width());
            set(shownColumns[i], 'index', i);
        }
    }


    function checkToToggleStandardDisplay(viewMixin, threshold) {
        var isTableOverflowing = viewMixin.$('.table-responsive table').parent().width() < threshold;

        var controller = get(viewMixin, 'controller');
        if(isTableOverflowing) {
            set(controller, 'standardListDisplay', false);
        } else {
            set(controller, 'standardListDisplay', true);
        }
    }

    var viewMixin = Ember.Mixin.create({
        classNames: ['list'],
        groupedColumns: Ember.A(),

        /**
         * Indicates the number of invisible cells to generate in the stackedcolumns view, to prevent some draggableColumnsMixin bugs
         */
        invisibleCellsCount: function() {
            var shownColumns = get(this, 'controller.shown_columns');
            return shownColumns.length - 1;
        }.property('controller.shown_columns'),

        init: function() {
            this._super.apply(this, arguments);
        },

        didInsertElement: function() {
            this._super.apply(this, arguments);

            var viewMixin = this;
            // get(viewMixin, 'controller.groupedColumns').clear();

            var ths = this.$('th');

            get(viewMixin, 'groupedColumns').clear();

            var thresholds = getTableThresholds(viewMixin);

            var searchable_columns = get(this, 'searchable_columns');

            var controller = get(viewMixin, 'controller');
            var shownColumns = get(controller, 'shown_columns');

            console.log('resize call');
            var tableContainerWidth = viewMixin.$('.table-responsive table').parent().width();
            var tableWidth = viewMixin.$('.table-responsive table').width();

            checkToToggleStackedDisplay(viewMixin, thresholds, tableContainerWidth, tableWidth);
            // checkToToggleStandardDisplay(viewMixin, 400);

        }
    });


    var mixin = Mixin('responsivelist', {
        partials: {
            alternativeListDisplay: ['groupedrowslistlayout'],
            subRowInformation: ['stackedcolumns']
        },

        stackedColumns: Ember.A(),

        groupedColumnsBindingActivator: 0,

        init:function() {
            console.log('init responsivelist');
            this.viewMixins.push(viewMixin);
            this._super.apply(this, arguments);
        }
    });

    return mixin;
});
