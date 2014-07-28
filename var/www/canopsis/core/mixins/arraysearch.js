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
	'app/application'
], function(Ember, Application) {
	var get = Ember.get,
		set = Ember.set;
	/**
	 * Implements search in arraycontrollers
	 *
	 * You should define on the ArrayController:
	 *	  - the `findOptions` property
	 *	  - the `refreshContent()` method
	 *	  - the searchableAttributes property
	 *
	 * @mixin
	 */
	Application.ArraySearchMixin = Ember.Mixin.create({
		actions: {
			searchItems: function(findOptions) {

				set(this, 'findOptions', findOptions);

				if (this.currentPage !== undefined) {
					this.set("currentPage", 1);
				}

				this.refreshContent();
			}
		},

		searchableAttributesUpdate: function(){
			console.log('shown_columnsChanged');
			var shown_columns = get(this, 'shown_columns');
			var searchableAttributes = Ember.A();

			for (var i = 0, shown_columns_length = shown_columns.length; i < shown_columns_length; i++) {
				// if(shown_columns[i].searchable === true) {
					searchableAttributes.push(shown_columns[i].field);
				// }
			}

			set(this, 'searchableAttributes', searchableAttributes);
			console.log('new searchableAttributes', searchableAttributes);

		}.observes('shown_columns')
	});

	return Application.ArraySearchMixin;
});
