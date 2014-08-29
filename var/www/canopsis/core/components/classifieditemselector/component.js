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
	var set = Ember.set,
	    get = Ember.get;

	var component = Ember.Component.extend({

		actions: {
			selectItem: function(item){
				console.log('selectItem', arguments);
				if(get(this, 'target')) {
					get(this, 'target').send('selectItem', item.name);
				}
			},

			collapse: function(theClass){
				if(theClass === "all") {
					if(get(this, 'allCollapsed') === true)
						set(this, 'allCollapsed', false);
					else
						set(this, 'allCollapsed', true);
				} else {
					var originClass = get(this, 'classes').findBy('key', theClass.key);

					console.log("collapse", theClass, theClass.key, originClass);

					if(originClass.isCollapsed === true){
						set(originClass, 'isCollapsed', false);
						set(theClass, 'isCollapsed', false);
					}
					else {
						set(originClass, 'isCollapsed', true);
						set(theClass, 'isCollapsed', true);
					}
				}
			}
		},

		searchFilter: "",

		allCollapsed: true,

		classAllPanelId: function(){
			return get(this, "elementId") + "_" + "all";
		}.property(),

		classAllPanelHref: function(){
			return "#" + get(this, "classAllPanelId");
		}.property(),

		allClasses: function(){
			var searchFilter = get(this, 'searchFilter');
			if(searchFilter === "") {
				return get(this, 'content.all');
			} else {
				return get(this, 'content.all').filter(function(item, index, enumerable){
					var doesItStartsWithSearchFilter = item.name.slice(0, searchFilter.length) == searchFilter;
					return doesItStartsWithSearchFilter;
				});
			}
		}.property('searchFilter'),

		collapsedPanelCssClass: 'list-group collapse',
		expandedPanelCssClass: 'list-group',

		classList: function(){
			return $.map(contentByClass, function(value, key) {
				if (contentByClass.hasOwnProperty(key)) {
					return key;
				}
			});
		}.property('content'),

		classesFiltered: function(){
			var classes = get(this, 'classes');
			var searchFilter = get(this, 'searchFilter');

			var res = Ember.A();

			for (var i = 0; i < classes.length; i++) {
				var currentClass = Ember.Object.create({
					key: classes[i].key,
					items: classes[i].items,
					id: classes[i].id,
					titleHref: classes[i].titleHref,
					isCollapsed: classes[i].isCollapsed
				});

				var classItems = currentClass.items;
				console.log("classItems", classItems);
				if(searchFilter !== "") {
					console.log('filter', classItems);
					classItems = classItems.filter(function(item, index, enumerable){
						var doesItStartsWithSearchFilter = item.name.slice(0, searchFilter.length) == searchFilter;
						return doesItStartsWithSearchFilter;
					});

					currentClass.items = classItems;

					console.log('filterEnd', classItems);
				}
				res.push(currentClass);
			}
			console.log('classesFiltered CP end');
			return res;

		}.property('classes', 'searchFilter'),

		classes: function(){
			var component = this;
			var contentByClass = get(this, 'content.byClass');

			console.log('classes CP', arguments, this, contentByClass);

			if(contentByClass !== undefined) {
				return $.map(contentByClass, function(value, key) {
					if (contentByClass.hasOwnProperty(key)) {
						var newObject = Ember.Object.create({
							key: key,
							items: value,
							id: component.get('elementId') + "_" + key,
							titleHref: "#" + component.get('elementId') + "_" + key
						});
						var res = [newObject];

						if(contentByClass[key] === undefined || contentByClass[key].isCollapsed === undefined) {
							res.isCollapsed = false;
						} else {
							res.isCollapsed = contentByClass[key].isCollapsed;
						}
						return res;
					}
				});
			} else {
				set(component, 'allCollapsed', false);
				return [];
			}
		}.property('content')
	});

	Application.ComponentClassifieditemselectorComponent = component;

	return component;
});