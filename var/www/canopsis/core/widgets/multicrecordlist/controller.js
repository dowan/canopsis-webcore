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
], function(Ember, Application, DS, WidgetFactory, PaginationMixin, InspectableArrayMixin,
		ArraySearchMixin, SortableArrayMixin, HistoryMixin, SendEventMixin, utils  ) {

	var get = Ember.get,
		set = Ember.set;

	var listOptions = {
		subclass: Application.ListController,
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
			ajaxAction: "",

			init: function() {
				this._super();
			},

			itemsPerPagePropositions : [5, 10, 20, 50],
			userDefinedItemsPerPageChanged : function() {
				this.set('itemsPerPage', this.get('userDefinedItemsPerPage'));
				this.refreshContent();
			}.observes('userDefinedItemsPerPage'),

			ajaxSuccess: function(response , textStatus, deffered){
				var args = deffered.args;
				var action = args[0];
				var record = args[1];

				var callbackName = "";
				var tesData;
			//	debugger;
				switch( action ) {
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
				case "getConf":
					callbackName = "setReceivedConf";
					tesData = { port:"333",host:"rabbitmq-vip", name:"name" };

					break;

				default:
					tesData = { ts:1406881698 , connector:"1", subprocess:[{ nagios:"1"} , { shinken:"1" }] };
					callbackName = "getState"
				}

				var obj = JSON.parse(response);
				var test = obj[ record.get("hostname") ];
				tesData = JSON.parse(test);
				this.send( callbackName , response , record , tesData );
			},

			ajaxError: function(response){
				var callbackName = "";
				var tesData;
				$( "#toremove" ).remove();
				var responseText = response.responseText;
  				var html = $.parseHTML( responseText );
  				var errorNode = html[9];
  				var errorMessage = errorNode.innerText;
				$(".modal-body").append( errorNode );
			},

			cleanModal:function(){
				$(".modal-title").children().not(function(){
					this.nextSibling.data = "";
					var item = $( this );
					var keep = item.is("script");
					return keep;
				}).remove();

				$(".modal-body").children().not(function(){
					var item = $( this );
					var keep = item.is("script");
					return keep;
				}).remove();

				$(".modal-footer").children().not(function(){
					var item = $( this );
					var keep = item.is("script");
					return keep;
				}).remove();
			},

			addCloseModalHook:function(){
				$("#formwrapper").on('hidden.bs.modal', function () {
					debugger;
					//this.cleanModal();
					$(".modal-body").children().not(function(){
						var item = $( this );
						var keep = item.is("script");
						return keep;
					}).remove();
					$("#formwrapper").off('hidden.bs.modal');
				})
			},
			showModal:function( HTML_content ){
				this.cleanModal();
				$( ".modal-body" ).append( HTML_content );
			//	var close = '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
			//	$(".modal-header").append (close);
				$("#formwrapper").modal({
					keyboard: false,
					backdrop:"static"
				});
			},
			actions: {
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
					var recordWizard = utils.forms.showNew('connectorform', this , {listController : listController } );// { title: "test " + recordType });

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


				ajaxCall :function(action , record  , params){
					// action must be take in count here
					params = params || "";
					//debugger;
					breakPoint("ajaxCall");
					//cat/connectors/:ctype/:action/:id
					var ctype = record.get("connector_type");
					var id = record.get("id");

					//this.showModal( '<p id="toremove">Waiting for server his answer</p>');
					//this.addCloseModalHook();
					this.ajaxAction = action;
					var url = "/cat/connectors/" + ctype + "/" + action + "/" + id;// + "?" +params;
					var ajaxDeffered = $.ajax({ url: url,
							 context: this,
							 success: this.ajaxSuccess,
							 error: this.ajaxError
					})
					ajaxDeffered.args = arguments;
				},

				setReceivedConf: function( reponse , record  , tesData){
					var id = record._data._id;
					var name = record.get("_opt_name");
					var test = record.store.getById("Nagios" , id);

					breakPoint("setReceivedConf");
					var listController = this;
					var newRecord = {};
					for ( var conf in tesData ){
						if ( tesData.hasOwnProperty( conf )){
							var nameVar = "_opt_"+conf;
							var current = tesData[ conf ];
							newRecord[nameVar] =  current;
							//record.set( nameVar , current );
						}
					}
					var recordWizard = ctools.forms.showNew('confirmform', record , { title : " confirmation "  , newRecord : newRecord , OLD : "BDD" , NEW : "Connector"});
					recordWizard.submit.then(function(conf) {
						breakPoint("setReceivedConf");

						record.save();
						listController.trigger('refresh');
					});
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
					breakPoint("getState");

					record.save();
					$("#formwrapper").modal('hide');
					this.trigger('refresh');

					console.log("failed");
				},

				setConf: function( record ){
					var conf ="";
					// Could be unnecessary
					conf = utils.filterObject.getFieldsByPrefix( "_opt_" , record , function( attr , result ){
						result+= "&" + attr + "=" + record.get(attr);
						return result;
					}, conf);
					conf = conf.slice(0);
					this.send("ajaxCall", "setConf" , record , conf);

				},

				edit: function (record) {
					var listController = this;
					var recordWizard = utils.forms.showNew('modelform', record, { title: "Edit " + record.get('crecord_type') });
					var actualRecord = record;

					recordWizard.submit.then(function(form) {
						console.log('record going to be saved', record, form);

						record = form.get('formContext');
						record.save();
						listController.trigger('refresh');
					});
				},
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
	}, listOptions);
	return widget;
});