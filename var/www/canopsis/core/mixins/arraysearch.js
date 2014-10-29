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
    'app/lib/factories/mixin'
], function(Ember, Mixin) {

    var get = Ember.get,
        set = Ember.set;

    /**
     * Implements search in arraycontrollers
     *
     * You should define on the ArrayController:
     *    - the `findOptions` property
     *    - the `refreshContent()` method
     *    - the searchableAttributes property
     *
     * @mixin
     */
    var mixin = Mixin('arraysearch', {
        partials: {
            header: ['search']
        },

        actions: {
            searchItems: function(findOptions) {

                console.log('searchItems', findOptions);

                set(this, 'findOptions', findOptions);

                if (get(this, currentPage) !== undefined) {
                    set(this, 'currentPage', 1);
                }

                this.refreshContent();
            }
        },

        searchCriterionChanged: function () {
            console.log('searchFieldValueChanged: criterion', get(this, 'searchCriterion'), 'field value', get(this, 'searchFieldValue'));

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

        computeFilterPartForCriterion: function(searchPhrase) {
            console.log("search", get(this, "searchableAttributes"));
            var searchableAttributes = get(this, 'searchableAttributes');

            //TODO these checks should be asserts
            if (searchableAttributes === undefined) {
                console.warn("searchableAttributes not defined in controller, but searchItems still called. Trying to recompute searchableAttributes.", this);

                this.searchableAttributesUpdate();

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

            var filter_orArray = [];
            for (var i = 0, l = searchableAttributes.length; i < l; i++) {
                var filter_orArrayItem = {};
                filter_orArrayItem[searchableAttributes[i]] = {"$regex": searchPhrase, "$options": "i"};
                filter_orArray.pushObject(filter_orArrayItem);
            }

            return JSON.stringify({"$or": filter_orArray });
        },

        searchableAttributesUpdate: function(){
            console.log('shown_columnsChanged');

            var searchableColumns = get(this, 'searchable_columns');

            var searchableAttributes;
            if (Ember.isNone(searchableColumns)) {
                //legacy search on all shown fields.
                var shown_columns = get(this, 'shown_columns');
                searchableAttributes = Ember.A();

                for (var i = 0, l = shown_columns.length; i < l; i++) {
                    searchableAttributes.push(shown_columns[i].field);
                }

                set(this, 'searchableAttributes', searchableAttributes);
                console.log('new searchableAttributes', searchableAttributes);
            } else {
                //User or default configuration made searchable ordered fields that greatly should match database indexed fields.
                searchableAttributes = Ember.A();

                for (var i = 0, l = searchableColumns.length; i < l; i++) {
                    searchableAttributes.push(searchableColumns[i]);
                }

                set(this, 'searchableAttributes', searchableAttributes);
                console.log('new searchableAttributes computed from widget parameters', searchableAttributes);
            }
        }.observes('shown_columns')
    });

    return mixin;
});
