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
	'app/application',
	'app/lib/utils/forms',
	'app/controller/form',
	'app/lib/loaders/schema-manager',
], function($, Ember, Application, formUtils) {
	var eventedController = Ember.Controller.extend(Ember.Evented);
	/*
		Default is to display all fields of a given model if they are referenced into category list (in model)
		options: is an object that can hold a set dictionnary of values to override
			- filters: is a list of keys to filter the fields that can be displayed
			- override_labels is an object that helps translate fields to display in form
			- callback, witch is called once form sent
			- plain ajax contains information that will be used insted of ember data mechanism
	*/
	Application.FormController = eventedController.extend({
		init: function() {
			var formParent = this.get('formParent');
			this.set('previousForm', formParent);

			this._super.apply(this, arguments);
		},

		submit: $.Deferred(),
		actions: {
			previousForm: function() {
				var previousForm = this.get('previousForm');

				console.log('previousForm', previousForm, this);
				formUtils.showInstance(previousForm);
			},

			show: function() {
				//reset submit defered
				this.submit = $.Deferred();
			},

			submit: function() {
				console.log("onsubmit", this.formParent);

				if (this.formParent !== undefined) {
					this.formParent.send('submit', arguments);
				}
				else {
					console.log("resolve modelform submit");
					if ( this.confirmation ){
						breakPoint("form.submit");

						var record = this.formContext;
						ctools.forms.showNew('confirmform', record , { title : " confirmation "  , newRecord : arguments[0]});
					} else {
						this.submit.resolve(this, arguments);
						this.get('formwrapper').trigger("hide");
					}
				}
			},

			abort: function() {
				if (this.formParent !== undefined) {
					this.formParent.send('abort', arguments);
				} else {
					console.log("reject form submit");
					this.submit.reject();
				}
			}
		},

		partials: {
			buttons: ["formbutton-cancel", "formbutton-submit"]
		},

		title: function() {
			console.warn("Property \"title\" must be defined on the concrete class.");

			return "<Untitled form>";
		}.property()
	});

	return Application.FormController;
});
