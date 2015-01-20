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
    'app/mixins/userconfiguration',
    'app/mixins/draggablecolumns',
    'app/lib/utils/dom',
    'app/lib/utils/routes',
    'app/lib/utils/forms',
    'app/controller/listline',
    'app/view/listline',
    'app/lib/loaders/schemas',
    'app/adapters/event',
    'app/adapters/userview',
    'canopsis/core/lib/wrappers/ember-cloaking',
    'app/lib/wrappers/datatables',
    'app/adapters/acl'
], function($,
    Ember,
    DS,
    WidgetFactory,
    PaginationMixin,
    InspectableArrayMixin,
    UserConfigurationMixin,
    DraggableColumnsMixin,
    domUtils,
    routesUtils,
    formsUtils,
    ListlineController
) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    Ember.Handlebars.registerBoundHelper('renderListline', function(callingContext, event, options) {
        return Ember.Handlebars.helpers.render.helperFunction(callingContext, "listlineTest", 'event', options);
    });

    var listOptions = {
        mixins: [
            InspectableArrayMixin,
            PaginationMixin,
            UserConfigurationMixin
        ],
    };

    var widget = WidgetFactory('list',
        {
            css :"table table-striped table-bordered table-hover dataTable sortable",
            needs: ['login', 'application', 'recordinfopopup'],

            /**
             * Whether to display the list as the regular table or not.
             * Used with mixin that fill the partial slot "alternativeListDisplay", this can help to provide alternative displays
             */
            standardListDisplay: true,

            viewMixins: [
                DraggableColumnsMixin
            ],

            dynamicTemplateName: 'listlineTest',

            //TODO test if this is needed (used in cloaked mode)
            listlineControllerClass: ListlineController,

            actions: {
                sendDisplayRecord: function (dest, record) {
                    //This method is not ugly TODO refactor, it would be better if event bubble until application directly
                    // but at the moment, event doen t bubble properly
                    console.debug('sendDisplayRecord action called with params', dest, record);

                    var template = get(dest, 'record_template');
                    if (isNone(template)) {
                        template = '';
                    }

                    console.debug('Template is ', template);

                    var recordinfopopupController = get(this, 'controllers.recordinfopopup');

                    recordinfopopupController.send('show', record, template);
                }
            },

            user: Ember.computed.alias('controllers.login.record._id'),
            rights: Ember.computed.alias('controllers.login.record.rights'),
            safeMode: Ember.computed.alias('controllers.application.frontendConfig.safe_mode'),

            custom_filters: [],

            init: function() {

                //prepare user configuration to fetch customer preference by reseting data.
                //dont understand why without this reset, values same values are set into many list instances.
                Ember.setProperties(this, {
                    findParams_cfilterFilterPart: get(this, 'default_filter'),
                    custom_filters: [],
                    widgetData: [],
                    findOptions: {},
                    loaded: false
                });

                this._super.apply(this, arguments);
            },

            generateListlineTemplate: function (shown_columns) {
                var html = '<td>{{#if pendingOperation}}<i class="fa fa-cog fa-spin"></i>{{/if}}{{component-checkbox checked=isSelected class="toggle"}}</td>';

                if(get(this, '_partials.columnsLine')) {
                    html += '{{#each columns in controller.parentController._partials.columnsLine}}<td>{{partial columns}}</td>{{/each}}';
                }

                for (var i = 0, l = shown_columns.length; i < l; i++) {
                    var currentColumn = shown_columns[i];
                    console.log('currentColumn', currentColumn);

                    if(get(currentColumn, 'options.show')) {
                        if(currentColumn.renderer) {
                            html += '<td class="' + currentColumn.field + '">{{component-renderer rendererType="' + currentColumn.renderer + '" value=this.'+ currentColumn.field +' record=this}}</td>';
                        } else {
                            html += '<td class="' + currentColumn.field + '">{{this.'+ currentColumn.field + '}}</td>';
                        }
                    }
                }

                var itemActionbuttons = get(this, '_partials.itemactionbuttons');
                if(itemActionbuttons) {
                    console.log("itemactionbuttons", itemActionbuttons);
                    html += '<td style="padding-left:0; padding-right:0"><div style="display:flex">';

                    for (var j = 0, lj = itemActionbuttons.length; j < lj; j++) {
                        html += '{{partial "' + itemActionbuttons[j] + '"}}';
                    }

                    html += '</div></td>';
                }

                console.log('generatedListlineTemplate', html);
                return html;
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
                if (isNone(interval)) {
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


            isAllSelectedChanged: function(){
                get(this, 'widgetData').content.setEach('isSelected', get(this, 'isAllSelected'));
            }.observes('isAllSelected'),

            //Mixin aliases
            //history
            historyMixinFindOptions: Ember.computed.alias('findOptions.useLogCollection'),
            //inspectedDataItemMixin
            inspectedDataArray: Ember.computed.alias('widgetData'),
            //pagination
            paginationMixinFindOptions: Ember.computed.alias('findOptions'),

            widgetDataMetas: {},

            findItems: function() {
                var me = this;

                var appController = get(this, 'controllers.application');
                set(appController, 'isLoading', get(appController, 'isLoading') + 1);

                if (get(this, 'widgetDataStore') === undefined) {
                    set(this, 'widgetDataStore', DS.Store.create({
                        container: get(this, 'container')
                    }));
                }

                var itemType = get(this, 'itemType');

                console.log('findItems', itemType);

                if (itemType === undefined || itemType === null) {
                    console.error('itemType is undefined for', this);
                    return;
                }

                var findParams = this.computeFindParams();

                //Setting default sort order param to the query depending on widget configuration
                var columnSort = get(this, 'default_column_sort');

                //when find params does not contains already a sort infomation, then apply default one if any
                if (!isNone(findParams) && isNone(findParams.sort) && !isNone(columnSort)) {
                    if (!isNone(columnSort.property) && isNone(findParams.sort)){
                        var direction = 'DESC';
                        if (columnSort.direction === 'DESC' || columnSort.direction === 'ASC') {
                            direction = columnSort.direction;
                        }
                        //Sort order has been found.
                        findParams.sort = JSON.stringify([{property: columnSort.property, direction: direction}]);
                        console.log('use default sort',findParams.sort);
                    }
                }
                console.log('findParams.sort',findParams.sort);

                get(this, 'widgetDataStore').findQuery(itemType, findParams).then(function(queryResults) {
                    //retreive the metas of the records
                    var listed_crecord_type = get(me, 'listed_crecord_type');
                    var crecordTypeMetadata = get(me, 'widgetDataStore').metadataFor(listed_crecord_type);
                    console.log('crecordTypeMetadata', crecordTypeMetadata);

                    Ember.setProperties(me, {
                        widgetDataMetas: crecordTypeMetadata,
                        loaded: true
                    });

                    me.extractItems.apply(me, [queryResults]);

                    for(var i = 0, l = queryResults.content.length; i < l; i++) {
                        //This value reset spiner display for record in flight status
                        queryResults.content[i].set('pendingOperation', false);
                    }

                    set(appController, 'isLoading', get(appController, 'isLoading') - 1);

                    me.trigger('refresh');
                }).catch(function (promiseProxy) {
                    console.warn('Catching error', promiseProxy);
                    //TODO add an error in displayedErrors array, to warn the user that the data cannot be displayed
                    get(this, 'content.displayedErrors').pushObject('There seems to be an error with listed data.');
                    set(me, 'dataError', promiseProxy);
                });
            },

            attributesKeysDict: function() {
                var res = {};
                var attributesKeys = get(this, 'attributesKeys');
                var sortedAttribute = get(this, 'sortedAttribute');

                for (var i = 0, l = attributesKeys.length; i < l; i++) {
                    if (sortedAttribute !== undefined && sortedAttribute.field === attributesKeys[i].field) {
                        sortedAttribute.renderer = this.rendererFor(sortedAttribute);
                        res[attributesKeys[i].field] = sortedAttribute;
                    } else {
                        attributesKeys[i].renderer = this.rendererFor(attributesKeys[i]);
                        res[attributesKeys[i].field] = attributesKeys[i];
                    }
                }

                return res;
            }.property('attributesKeys'),

            rendererFor: function(attribute) {
                var type = get(attribute, 'type');
                var role = get(attribute, 'options.role');
                if(get(attribute, 'model.options.role')) {
                    role = get(attribute, 'model.options.role');
                }

                var rendererName;
                if (role) {
                    rendererName = 'renderer-' + role;
                } else {
                    rendererName = 'renderer-' + type;
                }

                if (Ember.TEMPLATES[rendererName] === undefined) {
                    rendererName = undefined;
                }

                return rendererName;
            },

            shown_columns: function() {
                console.log('compute shown_columns', get(this, 'sorted_columns'), get(this, 'sortedAttribute'));

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
                            set(attributesKeysDict[sorted_columns[i]].options, 'show', true);
                            shown_columns.push(attributesKeysDict[sorted_columns[i]]);
                        }
                    }
                } else {
                    console.log('no shown columns set, displaying everything');
                    shown_columns = this.get('attributesKeys');
                }

                var selected_columns = [];
                var sortedAttribute = get(this, 'sortedAttribute');
                var columnSort = get(this, 'default_column_sort');
                for(var column=0, l = shown_columns.length; column < l; column++) {
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

                    //Manage sort icon from default sort
                    if (!isNone(columnSort) &&
                        columnSort.property === shown_columns[column].field &&
                        !isNone(columnSort.direction) &&
                        (isNone(sortedAttribute) || sortedAttribute === {})) {
                        var headerClass = columnSort.direction === 'ASC' ? 'sorting_asc' : 'sorting_desc';
                        shown_columns[column].headerClassName = headerClass;
                    }

                }

                console.debug('selected cols', selected_columns);

                var tpl = Ember.Handlebars.compile(this.generateListlineTemplate(selected_columns));

                var dynamicTemplateName = 'dynamic-list' + Math.floor(Math.random() * 10000);

                Ember.TEMPLATES[dynamicTemplateName] = tpl;
                set(this, 'dynamicTemplateName', dynamicTemplateName);

                return selected_columns;

            }.property('attributesKeysDict', 'sorted_columns'),

            computeFindParams: function(){
                console.group('computeFindParams');

                var searchFilterPart = get(this, 'findParams_searchFilterPart');
                var cfilterFilterPart = get(this, 'findParams_cfilterFilterPart');
                var additionalFilterPart = get(this, 'additional_filter');

                var filter;

                function isDefined(filterPart) {
                    if(filterPart === {} || isNone(filterPart)) {
                        return false;
                    }

                    return true;
                }

                var sourceFilter = [
                    searchFilterPart,
                    cfilterFilterPart,
                    this.getTimeInterval(),
                    additionalFilterPart
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
