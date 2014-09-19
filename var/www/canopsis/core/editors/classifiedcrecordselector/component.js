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
    'app/mixins/pagination',
    'app/adapters/crecord'
], function($, Ember, Application, PaginationMixin) {
    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        model: undefined,
        modelfilter: undefined,
        data: undefined,

        items: [],

        selectedValue: undefined,

        init: function() {
            this._super(arguments);

            this.set('store_' + get(this, 'elementId'), DS.Store.create({
                container: this.get('container')
            }));

            var initialContent = get(this, 'content');
            console.log('init', initialContent);

            if(initialContent) {
                if( typeof initialContent === "string") {
                    set(this, 'selectionUnprepared', [{ 'name': initialContent}]);
                } else {
                    console.log("initialContent", initialContent);
                    throw "not implemented";
                }
            }

            this.refreshContent();
        },

        actions: {
            do: function(action, item) {
                this.targetObject.send(action, item);
            }
        },

        /*
         * Compute a structure with classified item each time the 'items' property changed
         */
        classifiedItems : function(){
            console.log("recompute classifiedItems", get(this, 'items'));
            var items = get(this, 'items');
            var valueKey = get(this, 'valueKey');

            var res = Ember.Object.create({
                all: Ember.A()
            });

            for (var i = 0, l = items.length; i < l; i++) {
                var currentItem = items[i];
                var objDict = { name: currentItem.get('crecord_name') };
                if(valueKey) {
                    objDict.value = currentItem.get(valueKey);
                    console.log('objDict value', currentItem, currentItem.get(valueKey));
                }
                res.all.pushObject(Ember.Object.create(objDict));
            }

            return res;
        }.property('items', 'items.@each'),

        selectionChanged: function(){
            var selectionUnprepared = get(this, 'selectionUnprepared');
            var res;

            var valueKey = get(this, 'valueKey');

            if(get(this, "multiselect")) {
                res = Ember.A();

                if(valueKey) {
                    for (var i = 0; i < selectionUnprepared.length; i++) {
                        res.pushObject(get(selectionUnprepared[i], 'value'));
                    }
                } else {
                    for (var j = 0; j < selectionUnprepared.length; j++) {
                        res.pushObject(get(selectionUnprepared[j], 'name'));
                    }
                }
            } else {
                if(Ember.isArray(selectionUnprepared)) {

                    if(valueKey) {
                        res = get(selectionUnprepared[0], 'value');
                    } else {
                        res = get(selectionUnprepared[0], 'name');
                    }
                }
            }

            set(this, 'selection', res);
        }.observes('selectionUnprepared', 'selectionUnprepared.@each'),

        onDataChange: function() {
            console.error('refreshContent');
            this.refreshContent();
        }.observes('data.@each'),

        onModelFilterChange: function() {
            this.set('currentPage', 1);
            this.refreshContent();
        }.observes('modelfilter'),

        refreshContent: function() {
            this._super(arguments);

            this.findItems();

            var me = this;

            console.log(this.get('widgetDataMetas'));
        },

        /*
         * Fetch items as crecords, for performance reasons (userviews slowed down the component a lot because of embedded records for instance)
         */
        findItems: function() {
            console.log('>>> findItems');
            var me = this;

            var store = this.get('store_' + get(this, 'elementId'));

            var query = {
                start: 0,
                limit: 10000
            };

            query.filter = JSON.stringify({'crecord_type': this.get('crecordtype')});
            console.log('findItems', this.get('crecordtype'), query);

            store.findQuery('crecord', query).then(function(result) {
                me.set('widgetDataMetas', result.meta);
                var items = result.get('content');
                me.set('items', result.get('content'));

                Ember.run.scheduleOnce('afterRender', {}, function() { me.rerender(); });

                me.extractItems(result);
            });
        },

        extractItems: function(queryResult) {
            console.log("extractItems", queryResult);
        }
    });

    Application.ComponentClassifiedcrecordselectorComponent = component.extend();

    return component;
});
