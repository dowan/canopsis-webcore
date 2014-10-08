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
    'ember',
    'ember-data',
    'app/lib/factories/widget',
    'app/mixins/pagination',
    'app/mixins/inspectablearray',
    'app/mixins/arraysearch',
    'app/mixins/sortablearray',
    'app/mixins/history',
    'app/mixins/ack',
    'app/mixins/infobutton',
    'app/mixins/sendevent',
    'app/mixins/customfilter',
    'utils',
    'app/lib/utils/dom',
    'app/lib/utils/routes',
    'app/lib/utils/forms',
    'app/mixins/foldablelistlinemixin',
    'app/lib/loaders/schemas',
    'app/adapters/event',
    'app/adapters/userview',
    'canopsis/core/lib/wrappers/ember-cloaking',
    'app/view/listline',
    'app/lib/wrappers/datatables',
    'app/lib/loaders/components',
    'app/lib/wrappers/bootstrap-contextmenu',
    'app/adapters/group'
], function($, Ember, DS, WidgetFactory, PaginationMixin, InspectableArrayMixin,
        ArraySearchMixin, SortableArrayMixin, HistoryMixin, AckMixin, InfobuttonMixin, SendEventMixin, CustomFilterManagerMixin, utils, domUtils, routesUtils, formsUtils, FoldableListLineMixin) {

    var get = Ember.get,
        set = Ember.set;

    var listOptions = {
        mixins: [
            InspectableArrayMixin,
            PaginationMixin
        ],
    };

    var ListViewMixin = Ember.Mixin.create({
        classNames: ['list'],

        didInsertElement: function() {
            //reactivate this for table overflow
            // this.$('table').tableOverflow();

            var list = this;

            this.$('td').resize(function(){
                var td = $(this);
                var element = td.children('.renderer');

                if(element === undefined) {
                    return;
                }

                td.removeClass('overflowed');
                td.unbind('mouseover');
                var $divs = td.children('.placeddiv');
                if($divs.length) {
                    $divs.remove();
                }

                var el_w = element.width(), td_w = td.width();

                if(el_w > td_w) {

                    td.addClass('overflowed');
                    td.mouseenter(function(){
                        var $divs = td.children('.placeddiv');
                        if($divs.length) {
                            return;
                        }

                        var newDiv = $('<div class="placeddiv">content</div>');

                        td.append(newDiv);

                        var offset = td.offset();

                        newDiv.css('padding', td.css('padding'));
                        newDiv.css('backgroundColor', td.css('backgroundColor'));
                        newDiv.css('position', 'absolute');

                        newDiv.offset(offset);
                        newDiv.html(element.html());

                        var tdHeight = td.parent().height(),
                            divHeight = newDiv.height();

                        if(tdHeight > divHeight) {
                            newDiv.css('height', tdHeight);
                        } else {
                            newDiv.css('height', divHeight);
                        }

                        td.on('mouseleave', function(e) {
                            newDiv.remove();
                        });
                   });
                }
            });

            this.$('td').resize();
            this._super.apply(this, arguments);
        }
    });

    var widget = WidgetFactory('list',
        {
            needs: ['login', 'application', 'recorddisplayer'],

            viewMixins: [
                ListViewMixin
            ],

            actions: {
                sendDisplayRecord: function (dest, record) {
                    //This method is not ugly TODO refactor, it would be better if event bubble until application directly
                    // but at the moment, event doen t bubble properly
                    console.debug('sendDisplayRecord action called with params', dest, record);

                    var template = get(dest, 'record_template');
                    if (Ember.isNone(template)){
                        template = '';
                    }

                    console.debug('Template is ', template);

                    //FIXME @eric WTF is that?!?
                    var recorddisplayerController = get(dest, 'controllerInstance.controllers.recorddisplayer');

                    var recorddisplayerController = this.get('controllers.recorddisplayer');

                    recorddisplayerController.send('show', record, template);
                }
            },


            rights: Ember.computed.alias('controllers.login.record.rights'),
            safeMode: Ember.computed.alias('controllers.application.frontendConfig.safe_mode'),

            custom_filters: [],

            init: function() {
                set(this, 'findParams_cfilterFilterPart', get(this, 'default_filter'));

                //prepare user configuration to fetch customer preference by reseting data.
                //dont understand why without this reset, values same values are set into many list instances.
                set(this, 'custom_filters', []);

                this._super.apply(this, arguments);
            },

            /**
            * Manages how time filter is set to the widget
            **/
            updateInterval: function (interval){
                console.warn('Set widget list time interval', interval);
                set(this, 'timeIntervalFilter', interval);
                this.refreshContent();
            },

            /**
            * Manages how time filter is get from the widget for refresh purposes
            **/
            getTimeInterval: function () {
                var interval = get(this, 'timeIntervalFilter');
                if (Ember.isNone(interval)) {
                    return {};
                } else {
                    return interval;
                }

            },

            itemType: function() {
                var listed_crecord_type = get(this, 'listed_crecord_type');
                console.info('listed_crecord_type', listed_crecord_type);
                if(listed_crecord_type !== undefined && listed_crecord_type !== null ) {
                    return get(this, 'listed_crecord_type');
                } else {
                    return 'event';
                }
            }.property('listed_crecord_type'),

            widgetData: [],

            findOptions : {},

            loaded: false,

            isAllSelectedChanged: function(){
                console.log('toggle isAllSelected');
                this.get('widgetData').content.setEach('isSelected', get(this, 'isAllSelected'));
            }.observes('isAllSelected'),

            //Mixin aliases
            //history
            historyMixinFindOptions: Ember.computed.alias('findOptions.useLogCollection'),
            //inspectedDataItemMixin
            inspectedDataArray: Ember.computed.alias('widgetData'),
            //pagination
            paginationMixinFindOptions: Ember.computed.alias('findOptions'),

            onReload: function (element) {
                this._super();
            },

            onDomReady: function (element) {
                void(element);
            },

            findItems: function() {
                var me = this;

                if (get(this, 'widgetDataStore') === undefined) {
                    set(this, 'widgetDataStore', DS.Store.create({
                        container: get(this, 'container')
                    }));
                }

                var itemType = get(this, 'itemType');

                console.log('findItems', itemType);

                if (itemType === undefined || itemType === null) {
                    console.error ('itemType is undefined for', this);
                    return;
                }

                var findParams = this.computeFindParams();

                //Setting default sort order param to the query depending on widget configuration
                var columnSort = this.get('default_column_sort');
                if (Ember.isNone(findParams.sort) && !Ember.isNone(columnSort)) {
                    if (!Ember.isNone(columnSort.property)){
                        var direction = 'DESC';
                        if (columnSort.direction === 'DESC' || columnSort.direction === 'ASC') {
                            direction = columnSort.direction;
                        }
                        //Sort order has been found.
                        findParams.sort = JSON.stringify([{property: columnSort.property, direction: direction}]);
                    }
                }

                console.tags.add('data');
                console.log('find items of type', itemType, 'with options', findParams);
                console.tags.remove('data');

                get(this, 'widgetDataStore').findQuery(itemType, findParams).then(function(queryResults) {
                    console.tags.add('data');
                    console.log('got results in widgetDataStore', itemType, 'with options', findParams);
                    console.tags.remove('data');

                    //retreive the metas of the records
                    set(me, 'widgetDataMetas', get(me, 'widgetDataStore').metadataFor(get(me, 'listed_crecord_type')));
                    me.extractItems.apply(me, [queryResults]);
                    set(me, 'loaded', true);

                    console.log('Initializing special fields in list records',queryResults);
                    for(var i = 0, l = queryResults.content.length; i < l; i++) {
                        //This value reset spiner display for record in flight status
                        queryResults.content[i].set('pendingOperation', false);
                    }

                    me.trigger('refresh');
                }).catch(function (promiseProxy) {
                    console.warn('Catching error', promiseProxy);
                    set(me, 'dataError', promiseProxy);
                });
            },

            attributesKeysDict: function() {
                var res = {};
                var attributesKeys = get(this, 'attributesKeys');
                var sortedAttribute = get(this, 'sortedAttribute');

                for (var i = 0, l = attributesKeys.length; i < l; i++) {
                    if (sortedAttribute !== undefined && sortedAttribute.field === attributesKeys[i].field) {
                        res[attributesKeys[i].field] = sortedAttribute;
                    } else {
                        res[attributesKeys[i].field] = attributesKeys[i];
                    }
                }

                return res;
            }.property('attributesKeys'),

            shown_columns: function() {
                console.log('compute shown_columns', get(this, 'sorted_columns'), get(this, 'attributesKeys'), get(this, 'sortedAttribute'));

                //user preference for displayed columns.
                if (this.get('user_show_columns') !== undefined) {
                    console.log('user columns selected', get(this, 'user_show_columns'));
                    return get(this, 'user_show_columns');
                }

                var shown_columns = [];
                var displayed_columns = get(this, 'displayed_columns') || get(this, 'content._data.displayed_columns') ;
                if (displayed_columns !== undefined && displayed_columns.length > 0) {

                    var attributesKeysDict = this.get('attributesKeysDict');

                    //var sorted_columns = this.get('displayed_columns');
                    var sorted_columns = displayed_columns;

                    for (var i = 0, li = sorted_columns.length; i < li; i++) {
                        if (attributesKeysDict[sorted_columns[i]] !== undefined) {
                            attributesKeysDict[sorted_columns[i]].options.show = true;
                            shown_columns.push(attributesKeysDict[sorted_columns[i]]);
                        }
                    }
                } else {
                    console.log('no shown columns set, displaying everything');
                    shown_columns = this.get('attributesKeys');
                }

                var selected_columns = [];
                for(var column=0, l = shown_columns.length; column < l; column++) {

                    shown_columns[column].options.show = true;

                    //reset previous if any in case list configuration is updated
                    if (shown_columns[column].options.canUseDisplayRecord) {
                        delete shown_columns[column].options.canUseDisplayRecord;
                    }

                    //set option display record field to true allow list line template to change renderer
                    //diusplay and if true, an action can be triggrered from trusted column.
                    if (shown_columns[column].field === get(this, 'display_record_field')) {
                        shown_columns[column].options.canUseDisplayRecord = true;
                    }

                    //Manage hidden colums from the list parameters information.
                    //If colname exists in hidden_column list, then it is not displayed.
                    if ($.inArray(shown_columns[column].field, get(this, 'hidden_columns')) === -1) {
                        selected_columns.pushObject(shown_columns[column]);
                    }
                }

                if(get(this, 'maximized_column_index')) {
                    selected_columns[get(this, 'maximized_column_index')].maximized = true;
                }

                console.debug('selected cols', selected_columns);

                return selected_columns;

            }.property('attributesKeysDict', 'attributesKeys', 'sorted_columns', 'maximized_column_index'),

            computeFindParams: function(){
                console.group('computeFindParams');

                var searchFilterPart = get(this, 'findParams_searchFilterPart');
                var cfilterFilterPart = get(this, 'findParams_cfilterFilterPart');

                var filter;

                function isDefined(filterPart) {
                    if(filterPart === {} || Ember.isNone(filterPart)) {
                        return false;
                    }

                    return true;
                }

                var sourceFilter = [
                    searchFilterPart,
                    cfilterFilterPart,
                    this.getTimeInterval()
                ];

                var filters = [];

                for (var i = 0, l = sourceFilter.length; i < l; i++) {
                    if(typeof sourceFilter[i] === 'string') {
                        //if json, parse json
                        sourceFilter[i] = JSON.parse(sourceFilter[i]);
                    }
                    if (isDefined(sourceFilter[i])) {
                        //when defined filter then it is added to the filter list
                        filters.pushObject(sourceFilter[i]);
                    }
                }

                var params = {};

                if (filters.length) {
                    params.filter = JSON.stringify({ '$and': filters });
                }

                console.log('List computed filter is', params.filter);

                params.limit = get(this, 'itemsPerPage');

                //TODO check if useless or not
                if(params.limit === 0) {
                    params.limit = 5;
                }

                params.start = get(this, 'paginationFirstItemIndex') - 1;

                var sortedAttribute = get(this, 'sortedAttribute');

                console.log('sortedAttribute', sortedAttribute);

                if(isDefined(sortedAttribute)) {
                    var direction = 'ASC';

                    if(sortedAttribute.headerClassName === 'sorting_desc') {
                        direction = 'DESC';
                    }

                    params.sort = [{ property : sortedAttribute.field, direction: direction }];
                    console.log('params.sort', params.sort);
                    params.sort = JSON.stringify(params.sort);
                }

                console.groupEnd();

                return params;
            }

    }, listOptions);

    return widget;
});
