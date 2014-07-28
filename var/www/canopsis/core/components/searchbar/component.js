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
	 * Search bar component
	 *
	 * Includes 3 tabs :
	 *  - All : allow selection of every field
	 *  - Indexed : only for indexed fields
	 *  - filter : cfilter embedding
	 *
	 * This component is a WIP, it only supports basic search at the moment
	 */
	Application.ComponentSearchbarComponent = Ember.Component.extend({
		showSearchOptions: false,
		tagName: 'span',

		actions: {
			searchInputAction: function(searchPhrase) {
				console.log('searchItems', this, this.controller, searchPhrase);
				
				console.log("search", searchPhrase, this.get("searchableAttributes"));
				var searchableAttributes = get(this, 'searchableAttributes');

				//TODO these checks should be asserts
				if (searchableAttributes === undefined) {
					console.warn("searchableAttributes not defined in controller, but searchItems still called. Trying to recompute searchableAttributes.", this);

					this.controller.target.searchableAttributesUpdate();

					searchableAttributes = get(this, 'searchableAttributes');

					console.log('new searchableAttributes', searchableAttributes);
					if(searchableAttributes === undefined) {
						console.warn("searchableAttributes not defined in controller, but searchItems still called. Doing nothing.", this);
						return;
					}

				}
				if (typeof searchableAttributes !== "object") {
					console.warn("searchableAttributes should be an array.", this);
					return;
				}
				if (searchableAttributes.length === 0) {
					console.warn("Asking for a search on records with no searchableAttributes. Doing nothing.", this);
					return;
				}

				var findOptions = {};

				var filter_orArray = [];
				for (var i = 0; i < searchableAttributes.length; i++) {
					var filter_orArrayItem = {};
					filter_orArrayItem[searchableAttributes[i]] = {"$regex": searchPhrase, "$options": "i"};
					filter_orArray.push(filter_orArrayItem);
				}

				findOptions.filter = JSON.stringify({"$and":[{"$or": filter_orArray }]});

				this.controller.target.send('searchItems', findOptions);
			}
		},

		didInsertElement: function() {
			console.log('didInsertElement');
			this.$('.dropdown-menu a, .dropdown-menu div').click(function(e) {
				e.stopPropagation();
			});

			this.$('.nav-tabs a').click(function (e) {
				e.preventDefault();
				$(this).tab('show');
			});
		},

		tabAllId: function() {
			console.log('tabAllId');

			return get(this, 'elementId') + 'TabAll';
		}.property('elementId'),
		tabIndexedId: function() {
			return get(this, 'elementId') + 'TabIndexed';
		}.property('elementId'),
		tabFilterId: function() {
			return get(this, 'elementId') + 'TabFilter';
		}.property('elementId'),
		tabAllHref: function() {
			return "#" + get(this, 'elementId') + 'TabAll';
		}.property('elementId'),
		tabIndexedHref: function() {
			return "#" + get(this, 'elementId') + 'TabIndexed';
		}.property('elementId'),
		tabFilterHref: function() {
			return "#" + get(this, 'elementId') + 'TabFilter';
		}.property('elementId')
    });

	return Application.ComponentEditorComponent;
});