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
	'app/lib/factories/form',
	'utils',
	'app/mixins/validation',
	'app/lib/loaders/schema-manager',
], function(Ember, Application, FormFactory, utils , ValidationMixin) {
	var formOptions = {
		mixins: [ValidationMixin]
	};
	FormFactory('confirmform', {
		validationFields: Ember.computed(function() {return Ember.A();}),
		testi: Ember.computed(function() {return this.get("testou");}),
		testou:"start",
		title: "confirmform",

		init: function(){
			this._super();
		//	this.set("testi", "start");
		},
		attrs: function() {
			breakPoint( "confirmform.makeObject");
			//debugger;
			if( this.get("testi") === "start"){
				var attrs = utils.filterObject.getFieldsByPrefix( "_opt_" , this.formContext , function( attr , result , record , model , _self ){
					var newRecord = _self.newRecord;

					var fieldName = attr.slice(5);
					var field = model[attr];
					var modelMeta = field._meta;
					var NEWvalue = newRecord[attr];

					var value = record.get(attr);
					var attr = Ember.Object.create({ value : value , fieldName : fieldName  , model: modelMeta , field: attr , NEWvalue : NEWvalue });
					result.pushObject( attr );
				} , null , this );

				this.set("attrs" , attrs);
			}
			return attrs || "";

		}.property('testi'),

		actions: {
			show: function() {
				this._super();
			},

			submit: function() {
				var testi =  $.Deferred();
				breakPoint( "confirmForm.submit");
				if (this.validation !== undefined && !this.validation()) {
					return;
				}
				var	newRecord = {};

				var	categories = this.get("attrs");
				var fc = this.get("formContext");
				for (var i = 0; i < categories.length; i++) {
					var attr = categories[i];
					var field = attr.field;
					Ember.set( fc ,  "_data.__ember_meta__.source."+ field, attr.NEWvalue);
					Ember.set( fc ,  field, attr.NEWvalue);
				}
				breakPoint( "confirmForm.submit");
				//fc.MYsubmit.resolve( this.newRecord );
				//debugger;
				this.set("testou" , "");
				this.set("testi" , "");
				this._super(this.get('formContext'));
			}
		},

		parentContainerWidget: Ember.required(),
		parentUserview: Ember.required()
	}, formOptions);

	return Application.WidgetformController;
});