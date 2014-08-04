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
	'app/lib/loaders/schema-manager',
	'app/adapters/event',
	'app/adapters/userview',
	'canopsis/core/lib/wrappers/ember-cloaking',
	'app/view/listline',
], function(Ember, DS, WidgetFactory, PaginationMixin, InspectableArrayMixin,
		ArraySearchMixin, SortableArrayMixin, HistoryMixin, SendEventMixin, utils  ) {

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
	]};
// TODO : child of list OR mixin for ajax  and mixin for mutli find
	var widget = WidgetFactory('multicrecordlist',
		{
			needs: ['login'],

			init: function() {
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

			findOptions: {},
			loaded: false,

			itemsPerPagePropositions : [5, 10, 20, 50],
			userDefinedItemsPerPageChanged : function() {
				this.set('itemsPerPage', this.get('userDefinedItemsPerPage'));
				this.refreshContent();
			}.observes('userDefinedItemsPerPage'),

			//Mixin aliases
			//history
			historyMixinFindOptions: Ember.computed.alias("findOptions.useLogCollection"),
			//inspectedDataItemMixin
			inspectedDataArray: Ember.computed.alias("widgetData"),
			itemsPerPage: Ember.computed.alias("content.itemsPerPage"),
			//pagination
			paginationMixinFindOptions: Ember.computed.alias("findOptions"),

			onReload: function () {
				this._super();
			},

			onDomReady: function (element) {
				void(element);
			},

			transitionToPost : function (post) {
			},

			failure :function ( record) {

			},



			actions: {
				setFilter: function (filter) {
					this.findOptions.filter = filter;

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
			//	var widgetChooserForm = Canopsis.utils.forms.showNew('widgetform', this);
					var widgetDataStore = this.get("widgetDataStore");
					var record = this.get("widgetDataStore").createRecord(recordType, {
						crecord_type: recordType
					});



					console.log('temp record', record);
					var listController = this;
					Canopsis.Application.listController = listController;
					var recordWizard = utils.forms.showNew('connectorform', this , {listController : listController} );// { title: "test " + recordType });

				},

				connectorAction :function(action , record ){

					var id = record.get("id");
					var ctype = record.get("crecord_type");
					if ( ctype === "view" ){
						var selected = this.get("widgetData").filterBy('isSelected', true);
						for (var i = 0; i < selected.length; i++) {
							var currentSelectedRecord = selected[i];
							this.send("ajaxCall", action , currentSelectedRecord);
						}
					}
					else {
						this.send("ajaxCall", action , record);
					}
				},


				ajaxCall :function(action , record ){
					// action must be take in count here
					debugger;
					//cat/connectors/:ctype/:action/:id
					var ctype = record.get("crecord_type");
					var id = record.get("id_connector");
					var url = "cat/connectors/" + ctype + "/" + action + "/" + id;
					$.ajax({ url: "index.html",
  							 context: this
					})
					.done( function (reponse) {
						var callbackName = "";
						var tesData;
						switch(action) {
							// most will go on default after
						    case "start":
						        callbackName = "getState";
						        tesData = { ts:1406881698 , connector:"1", subprocess:[{ nagios:"1"} , { shinken:"1" }] };

						        break;
						    case "stop":
						        callbackName = "getState";
						        tesData = { ts:1406881698 , connector:"0", subprocess:[{ nagios:"1"} , { shinken:"1" }] };

						        break;
						    case "getState":
						        callbackName = "getState";
						        tesData = { ts:1406881698 , connector:"1", subprocess:[{ nagios:"1"} , { shinken:"1" }] };

						        break;
						    case "getconf":
						        callbackName = "setReceivedConf";
						        tesData = { port:"122",host:"rabbitmq-vip" };

						        break;

						    default:
						        tesData = { ts:1406881698 , connector:"1", subprocess:[{ nagios:"1"} , { shinken:"1" }] };
						    	callbackName = "getState"
						}
						this.send( callbackName , reponse , record , tesData );
					});
				},

				setReceivedConf: function( reponse , record  , tesData){
					debugger;

					for ( var conf in tesData ){
						if ( tesData.hasOwnProperty( conf )){
							var nameVar = "_opt_"+conf;
							var current = tesData[ conf ];
							record.set( nameVar , current );
						}
					}
					record.save();
					this.trigger('refresh');

					console.log("failed");
				},


				getState: function( reponse , record  , tesData){
					var state 		= 	( tesData.connector == "1" )? true : false ;
					var subprocess  =	tesData.subprocess;

					var actuel = new Date().getTime();
					var not = Math.ceil( actuel / 1000);
					record.set('state', state);
					record.set('timeStampState', not );
					record.set('subprocess', subprocess);
					record.set('connection', true);
					record._data.subprocess = subprocess;
					debugger;
					record.save();
					this.trigger('refresh');

					console.log("failed");
				},


				edit: function (record) {

/*				   function convertDictToArray (item) {
					    var fieldsArray = Ember.A();
						for (var attr in item) {
						//if option isn't in current model's options
							if (item.hasOwnProperty(attr)) {
							// I keep it for remenber how to keep track of true reference value
								var newObject = Ember.Object.create({value : item[attr] , field : attr });
								//newObject.addObserver('value',item, this.fooDidChange);

								fieldsArray.pushObject(newObject);
								console.log ( "Added "+ attr + " = " + item[attr] +" newObject = " + newObject[attr]);
							}
						}
						return fieldsArray;
					}

					console.log("edit", record);

					var listController = this;
					var connectorType = record.get('connector_type');
					var TRUErecord =Canopsis.utils.data.getStore().createRecord(
						connectorType,
						{ crecord_type: connectorType }
					);

					var test1 = convertDictToArray(  TRUErecord.__proto__ );
					var test2 = convertDictToArray(  record.__proto__ );
					var t = [];

					for ( var i = 0 ; i < test2.length ; i++ ){
						var temp =  test2[i]["field"];
						if ( temp ){
							t.push( temp );
						}
					}

					var tabFiltered = test1.filter( function ( content ) {
						var keep = t.contains( content.field );
				    	return !keep;
				    });


					record.constructor = TRUErecord.constructor;

					record.__proto__ = TRUErecord.__proto__;

					var data = record._data;
					for( var i = 0 ; i < tabFiltered.length ;  i++ ){
						var field = tabFiltered[i].field ;
						var value = record._data[field] ;

						record.set( field , value );

					}
					*/
					var listController = this;

					var recordWizard = utils.forms.showNew('modelform', record, { title: "Edit " + record.get('crecord_type') });
					var actualRecord = record;

					recordWizard.submit.then(function(form) {
						console.log('record going to be saved', record, form);

						record = form.get('formContext');
					//	record.set( 'crecord_type' , "connector" );
/*
						var data = record._data;

						for( var attr in data ){
							if ( data.hasOwnProperty(attr) ) {
								actualRecord.set( "__ember_meta__.cache."+attr , "hello");
							}
						}
*/
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

			findItems: function() { // tzek
				//___________________________________________________________________________
				function getPromise(type, query , widgetDataStore) {
					//debugger;

			        var typeObject = widgetDataStore.modelFor(type);

			        var adapter = widgetDataStore.adapterFor(typeObject);
			        var recordArray = widgetDataStore.recordArrayManager.createAdapterPopulatedRecordArray(typeObject, query);
			        var promise = getQuery(adapter, widgetDataStore, typeObject, query, recordArray, type);
			        var arrayPromise =  DS.PromiseArray.create({ promise: Ember.RSVP.Promise.cast(promise)});
			        return arrayPromise ;
			      }

			    function getQuery(adapter, store, type, query, recordArray, oldType) {
			      	var promise = adapter.findQuery(store, type, query, recordArray);
			   		var serializer = store.serializerFor( oldType );

			      	return Ember.RSVP.Promise.cast(promise).then(function(adapterPayload) {
				        var payload = serializer.extract(store, type, adapterPayload, null, 'findQuery');

				        //debugger;
				       	var Arraystore = get(recordArray, 'store');
				       	var typeObject = get(recordArray, 'type');
			        	var meta = store.metadataFor(typeObject);

				        fillArray( Arraystore, typeObject, recordArray , payload , meta);

				        return recordArray;
				    });
			    }
			    function fillArray( store , type ,recordArray , payload , meta) {

			        var content = Ember.EnumerableUtils.map(payload, function(row) {
			        	var ctype = row.crecord_type;
			        	var Stringtype = ctype.charAt(0).toUpperCase() + ctype.slice(1);
			       		var typeObject = widgetDataStore.modelFor(Stringtype);

			        	return store.push(typeObject, row);
			        }, store);


			        recordArray.setProperties({
			          content: Ember.A(content),
			          meta: Ember.copy(meta),
			          isLoaded: true
			        });

			        content.forEach(function(record) {
			          recordArray.manager.recordArraysForRecord(record).add(recordArray);
			        }, recordArray);

			        Ember.run.once(recordArray, 'trigger', 'didLoad');
			     }
				//___________________________________________________________________________

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

				console.tags.add('data');
				console.log("find items of type", itemType, "with options", this.get('findOptions'));
				console.tags.remove('data');
				var widgetDataStore = me.get("widgetDataStore");

				getPromise(itemType, this.findOptions , widgetDataStore).then(function(queryResults) {

				//this.get("widgetDataStore").findQuery(itemType, this.findOptions).then(function(queryResults) {
					console.tags.add('data');
					console.log("got results in widgetDataStore", itemType, "with options", me.get('findOptions'));
					console.tags.remove('data');

					//retreive the metas of the records
					var meta = widgetDataStore.metadataFor(me.get("listed_crecord_type"));
					me.set("widgetDataMetas", meta );
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
				if (this.get('sorted_columns') !== undefined && this.get('sorted_columns').length > 0) {

					var attributesKeysDict = this.get('attributesKeysDict');

					var sorted_columns = this.get('sorted_columns');

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

			searchFieldValueChanged: function () {
				console.log('searchFieldValueChanged');
			}.observes('searchFieldValue')
	}, listOptions);
	return widget;
});