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
	'app/lib/loaders/schemas',
	'app/controller/journal'
], function(Ember, Application, FormFactory, utils) {

	FormFactory('enumchooserform', {
		needs: ['journal'],

		title: Ember.required(),

		classifiedItemList: Ember.required(),

		baseItemLabel: Ember.required(),

		parentContainerWidget: Ember.required(),
		parentUserview: Ember.required(),

		actions: {
			show: function() {
				this._super();
			},

			submit: function(newWidgets) {

				this.get('controllers.journal').send('publish', 'create', 'widget');

				this._super.apply(this, arguments);
			},

			selectItem: function(elementName) {
				this.onSelectItem.apply(this, arguments);
			}
		},

		onSelectItem: function(elementName) {
			//TODO manage with utils.problems.overrideNeeded()
			console.warn("An override of onSelectItem was not provided to the form", this);
		},

		partials: {
			buttons: []
		}
	});

	return Application.WidgetformController;
});
