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
	'app/lib/factories/widget',
	'app/mixins/pagination',
	'app/mixins/inspectablearray',
	'app/mixins/arraysearch',
	'app/mixins/sortablearray',
	'app/mixins/history',
	'app/mixins/sendevent',
	'utils',
	'app/lib/utils/dom',
	'app/lib/loaders/schema-manager',
	'app/adapters/event',
	'app/adapters/userview',
	'canopsis/core/lib/wrappers/ember-cloaking',
	'app/view/listline',
	'app/lib/wrappers/datatables',
	'app/lib/wrappers/bootstrap-contextmenu'
], function(Ember, DS, WidgetFactory, PaginationMixin, InspectableArrayMixin,
		ArraySearchMixin, SortableArrayMixin, HistoryMixin, SendEventMixin, utils, domUtils) {

	var get = Ember.get,
		set = Ember.set;

	var listOptions = {
		mixins: [
			InspectableArrayMixin,
			ArraySearchMixin,
			SortableArrayMixin,
			PaginationMixin,
			HistoryMixin,
			SendEventMixin
		]
	};

	var ListViewMixin = Ember.Mixin.create({
		classNames: ['list'],

		didInsertElement: function() {
			console.log('did insert list', this.$);

			//FIXME datatables not working atm
			// this.$('table').dataTable();

			this.$('table').contextMenu({
				menuSelector: "#contextMenu",
				menuSelected: function (invokedOn, selectedMenu) {
					var msg = "You selected the menu item '" + selectedMenu.text() +
						"' on the value '" + invokedOn.text() + "'";

					var targetView = domUtils.getViewFromJqueryElement(invokedOn, 'listline');
					var lineModelInstance = get(targetView, 'controller.content');

					console.info(msg, lineModelInstance);
					get(targetView, 'controller').send(selectedMenu.attr('data-action'), lineModelInstance);
				}
			});
			this._super.apply(this, arguments);
		}
	});

	var widget = WidgetFactory('list',
		{
			needs: ['login'],
			viewMixins: [
				ListViewMixin
			],

			init: function() {
				set(this, 'findParams_cfilterFilterPart', get(this, 'default_filter'));
				this._super();
			},

			itemType: function() {
				var listed_crecord_type = this.get("listed_crecord_type");
				console.info('listed_crecord_type', listed_crecord_type);
				if(listed_crecord_type !== undefined && listed_crecord_type !== null ) {
					return this.get("listed_crecord_type");
				} else {
					return 'event';
				}
			}.property("listed_crecord_type"),

			widgetData: [],

			findOptions : {},

			loaded: false,

			itemsPerPagePropositions : [5, 10, 20, 50],

			isAllSelectedChanged: function(){
				console.log('toggle isAllSelected');
				this.get('widgetData').content.setEach('isSelected', get(this, 'isAllSelected'));
			}.observes('isAllSelected'),

			//Mixin aliases
			//history
			historyMixinFindOptions: Ember.computed.alias("findOptions.useLogCollection"),
			//inspectedDataItemMixin
			inspectedDataArray: Ember.computed.alias("widgetData"),
			itemsPerPage: Ember.computed.alias("content.itemsPerPage"),
			//pagination
			paginationMixinFindOptions: Ember.computed.alias("findOptions"),

			onReload: function (element) {
				this._super();
			},

			onDomReady: function (element) {
				void(element);
			},

			actions: {
				//TODO refactor buttons as components
				info: function(record) {
					var list_info_button_pattern = get(Canopsis.conf.frontendConfig, "list_info_button_pattern");

					var template = list_info_button_pattern;
					var context = record._data;
					var compiledUrl = Handlebars.compile(template)(context); 

					console.log('info', compiledUrl, record._data);
					window.open(compiledUrl, '_blank');
				},

				setFilter: function (filter) {
					set(this, 'findParams_cfilterFilterPart', filter);

					if (this.currentPage !== undefined) {
						this.set("currentPage", 1);
					}

					this.refreshContent();
				},

				moveColumn: function (attr, direction) {
					console.log('moving', attr, direction);
					var columns = this.get('shown_columns');
					var col;
					for (var i=0; i<columns.length; i++) {
						if (columns[i].field === attr.field) {
							console.log(attr.field +  ' found at position ' + i);
							col = i;
							break;
						}
					}
					if (col !== undefined) {
						if( !(col === 0 && direction === 'left') && !(col === columns.length && direction === 'right')) {
							var permutation;
							if (direction === 'left') {
								permutation = columns[col - 1];
								columns[col - 1] = columns[col];
								columns[col] = permutation;
							} else {
								permutation = columns[col + 1];
								columns[col + 1] = columns[col];
								columns[col] = permutation;
							}
							console.debug('permuting column to ' + direction);
							this.set('userParams.user_show_columns', columns);
							this.get('userConfiguration').saveUserConfiguration();
							this.trigger('refresh');
						} else {
							console.debug('impossible action for colums switch');
						}
					}

				},

				switchColumnDisplay: function (attr) {
					console.log('column switch display', attr);
					console.log('attribute keys', this.get('attributesKeys'));
					Ember.set(attr, 'options.show', !Ember.get(attr, 'options.show'));
					var columns = this.get('shown_columns');
					console.log('Columns on reload', columns);
					this.set('userParams.user_show_columns', columns);
					this.get('userConfiguration').saveUserConfiguration();
				},

				show: function(id) {
					console.log("Show action", arguments);
					utils.routes.getCurrentRouteController().send('showView', id);
				},

				add: function (recordType) {
					console.log("add", recordType);

					var record = this.get("widgetDataStore").createRecord(recordType, {
						crecord_type: recordType
					});
					console.log('temp record', record);

					var recordWizard = utils.forms.showNew('modelform', record, { title: "Add " + recordType });

					var listController = this;

					recordWizard.submit.then(function(form) {
						console.log('record going to be saved', record, form);

						record = form.get('formContext');

						record.save();

						listController.trigger('refresh');

						listController.startRefresh();
					});
				},

				edit: function (record) {
					console.log("edit", record);

					var listController = this;
					var recordWizard = utils.forms.showNew('modelform', record, { title: "Edit " + record.get('crecord_type') });

					recordWizard.submit.then(function(form) {
						console.log('record going to be saved', record, form);

						record = form.get('formContext');

						record.save();
						listController.trigger('refresh');
					});
				},

				removeRecord: function(record) {
					console.info('removing record', record);
					record.deleteRecord();
					record.save();
				},

				removeSelection: function() {
					var selected = this.get("widgetData").filterBy('isSelected', true);
					console.log("remove action", selected);
					for (var i = 0; i < selected.length; i++) {
						var currentSelectedRecord = selected[i];
						this.send("removeRecord", currentSelectedRecord);
					}
				}
			},

			findItems: function() {
				var me = this;

				if (this.get("widgetDataStore") === undefined) {
					this.set("widgetDataStore", DS.Store.create({
						container: this.get("container")
					}));
				}

				var itemType = this.get("itemType");

				console.log("findItems", itemType);

				if (itemType === undefined || itemType === null) {
					console.error ("itemType is undefined for", this);
					return;
				}

				var findParams = this.computeFindParams();

				console.tags.add('data');
				console.log("find items of type", itemType, "with options", findParams);
				console.tags.remove('data');

				this.get("widgetDataStore").findQuery(itemType, findParams).then(function(queryResults) {
					console.tags.add('data');
					console.log("got results in widgetDataStore", itemType, "with options", findParams);
					console.tags.remove('data');

					//retreive the metas of the records
					me.set("widgetDataMetas", me.get("widgetDataStore").metadataFor(me.get("listed_crecord_type")));
					me.extractItems.apply(me, [queryResults]);
					me.set('loaded', true);

					me.trigger('refresh');
				});
			},

			attributesKeysDict: function() {
				var res = {};
				var attributesKeys = this.get('attributesKeys');
				var sortedAttribute = this.get('sortedAttribute');

				for (var i = 0; i < attributesKeys.length; i++) {
					if (sortedAttribute !== undefined && sortedAttribute.field === attributesKeys[i].field) {
						res[attributesKeys[i].field] = sortedAttribute;
					} else {
						res[attributesKeys[i].field] = attributesKeys[i];
					}
				}

				return res;
			}.property('attributesKeys'),

			shown_columns: function() {
				console.log("compute shown_columns", this.get('sorted_columns'), this.get('attributesKeys'), this.get('sortedAttribute'));
				if (this.get('user_show_columns') !== undefined) {
					console.log('user columns selected', this.get('user_show_columns'));
					return this.get('user_show_columns');
				}

				var shown_columns = [];
				if (this.get('displayed_columns') !== undefined && this.get('displayed_columns').length > 0) {

					var attributesKeysDict = this.get('attributesKeysDict');

					var sorted_columns = this.get('displayed_columns');

					for (var i = 0; i < sorted_columns.length; i++) {
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
				for(var column=0; column < shown_columns.length; column++) {

					shown_columns[column].options.show = true;
					if ($.inArray(shown_columns[column].field, this.get('hidden_columns')) === -1) {
						selected_columns.push(shown_columns[column]);
					}
				}
				return selected_columns;

			}.property('attributesKeysDict', 'attributesKeys', 'sorted_columns'),

			searchCriterionChanged: function () {
				console.log('searchFieldValueChanged', get(this, 'searchCriterion'), get(this, 'searchFieldValue'));

				var searchCriterion = get(this, 'searchFieldValue');
				var filter = {};

				if(searchCriterion !== null && searchCriterion !== undefined) {
					var searchFilterPart = this.computeFilterPartForCriterion(searchCriterion);
					console.log('searchFilterPart', searchFilterPart);
					filter = searchFilterPart;
				}

				set(this, 'findParams_searchFilterPart', filter);
				this.refreshContent();
			}.observes('searchCriterion'),

			computeFindParams: function(){
				console.group('computeFindParams');

				var searchFilterPart = get(this, 'findParams_searchFilterPart');
				var cfilterFilterPart = get(this, 'findParams_cfilterFilterPart');

				var filter;

				function isDefined(filterPart) {
					if(filterPart === {} || filterPart === null || filterPart === undefined)
						return false;

					return true;
				}

				if(isDefined(searchFilterPart)) {
					filter = searchFilterPart;

					if(isDefined(cfilterFilterPart)) {
						console.log('combine cfilter & search filterParts');

						filter = JSON.stringify({ '$and': [
							JSON.parse(searchFilterPart),
							JSON.parse(cfilterFilterPart)
						]});
					}
				}
				else if(isDefined(cfilterFilterPart)) {
					filter = cfilterFilterPart;
				}

				var params = {};

				params.filter = filter;

				params.limit = this.get('itemsPerPage');
				params.start = this.get('paginationFirstItemIndex') - 1;

				var sortedAttribute = this.get('sortedAttribute');

				console.log('sortedAttribute', sortedAttribute);

				if(isDefined(sortedAttribute)) {

					var direction = "ASC";

					if(sortedAttribute.headerClassName === "sorting_desc") {
						direction = "DESC";
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