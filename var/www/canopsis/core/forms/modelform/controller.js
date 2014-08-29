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
	'app/mixins/inspectableitem',
	'app/mixins/validation',
	'app/lib/utils/slug',
	'app/lib/loaders/schema-manager'
], function(Ember, Application, FormFactory, InspectableitemMixin, ValidationMixin, slugify) {
	var set = Ember.set,
		get = Ember.get;

	var formOptions = {
		mixins: [
			InspectableitemMixin,
			ValidationMixin
		]
	};

	FormFactory('modelform', {

		validationFields: Ember.computed(function() {return Ember.A();}),
		ArrayFields: Ember.A(),

		filterUserPreferenceCategory: function (category, keyFilters) {

			var keys = category.get('keys');
			category.set('keys', []);

			for (var i=0; i<keys.length; i++) {
				console.log('key', keys[i]);
				if (this.get('userPreferencesOnly')) {
					//isUserPreference is set to true in the key schema field.
					if (keys[i].model && keys[i].model.options && keys[i].model.options.isUserPreference) {
						category.get('keys').push(keys[i]);
					}
				} else {
					//Filter from form parameter
					if ($.inArray(keys[i].field, keyFilters) !== -1) {
						category.get('keys').push(keys[i]);
					}
				}
			}
			return category
		},

		categories: function(){
			var res = get(this, 'categorized_attributes');
			var category_selection = [];
			if(res instanceof Array) {
				for(var i = 0; i < res.length; i++) {
					var category = res[i];

					category.slug = slugify(category.title);
					console.log(category);
					if (this.get('filterFieldByKey') || this.get('userPreferencesOnly')) {
						//filter on user preferences fields only
						//if (category)
						category = this.filterUserPreferenceCategory(category, this.get('filterFieldByKey'))
						if (category.keys.length) {
							category_selection.push(res[i]);
						}

						console.log('category');
						console.log(category);
					} else {
						//select all
						category_selection.push(res[i]);
					}
				}
				if (category_selection.length) {
					set(category_selection[0], 'isDefault', true);
				}
				return category_selection;
			}
			else {
				return [];
			}
		}.property('categorized_attributes'),

		onePageDisplay: function () {
			//TODO search this value into schema
			return false;
		}.property(),

		inspectedDataItem: function() {
			return this.get('formContext');
		}.property('formContext'),

		inspectedItemType: function() {
			console.log('recompute inspectedItemType', this.get('formContext'));

			if (this.get('formContext.xtype')) {
				return this.get('formContext.xtype');
			} else {
				return this.get('formContext.crecord_type') || this.get('formContext.connector_type')  ;
			}

		}.property('formContext'),

		actions: {
			submit: function() {
				if (this.validation !== undefined && !this.validation()) {
					return;
				}

				console.log("submit action");

				var override_inverse = {};

				if( this.isOnCreate && this.modelname){
					var Stringtype = this.modelname.charAt(0).toUpperCase() + this.modelname.slice(1);
					var model = Canopsis.Application.allModels[Stringtype];
					if(model){
						for ( var fieldName in model){
							if ( model.hasOwnProperty(fieldName)){
								var field = model[fieldName];
								if(  field._meta &&  field._meta.options ){
									var options = field._meta.options;
									if( "setOnCreate" in  options){
										var value = options["setOnCreate"];
										this.set('formContext.' + fieldName, value);
									}
								}
							}
						}
					}
				}
				//will execute callback from options if any given
				var options = this.get('options');

				if (options && options.override_labels) {
					for (var key in options.override_labels) {
						override_inverse[options.override_labels[key]] = key;
					}
				}

				var	categories = this.get("categorized_attributes");

				console.log("setting fields");
				for (var i = 0; i < categories.length; i++) {
					var category = categories[i];
					for (var j = 0; j < category.keys.length; j++) {
						var attr = category.keys[j];
						var field = attr.field;
						//set back overried value to original field
						if (override_inverse[attr.field]) {
							field = override_inverse[attr.field];
						}
						this.set('formContext.' + field, attr.value);
					}
				}
				//Update value of array
				var ArrayFields = this.get("ArrayFields");
				if (ArrayFields !== undefined) {
					for (var w = 0; w < this.ArrayFields.length; w++) {
						console.log("ArrayFields  : ", this.ArrayFields[w]);
						this.ArrayFields[w].onUpdate();
					}
				}

				console.log("this is a widget", this.get('formContext'));
				this._super(this.get('formContext'));
			}
		}
	},
	formOptions);

	return Application.ModelformController;
});
