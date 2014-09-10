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
], function($, Ember, Application, PaginationMixin) {
    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        model: undefined,
        modelfilter: undefined,
        data: undefined,

        items: [],

        selectedValue: undefined,

        classifiedItems : function(){
            console.log(">>> recompute classifiedItems", get(this, 'items'));
            var items = get(this, 'items');

            var res = Ember.Object.create({
                all: Ember.A()
            });

            for (var i = 0, l = items.length; i < l; i++) {
                var currentItem = items[i];
                res.all.pushObject(Ember.Object.create({ name: currentItem.get('crecord_name') }));
            }

            return res;
        }.property('items', 'items.@each'),

        actions: {
            do: function(action, item) {
                this.targetObject.send(action, item);
            }
        },

        selectionChanged: function(){
            var selectionUnprepared = get(this, 'selectionUnprepared');
            var res;

            if(get(this, "multiselect")) {
                res = Ember.A();

                for (var i = 0; i < selectionUnprepared.length; i++) {
                    res.pushObject(get(selectionUnprepared[i], 'name'));
                }
            } else {
                if(Ember.isArray(selectionUnprepared)) {
                    res = get(selectionUnprepared[0], 'name');
                }
            }

            set(this, 'selection', res);
        }.observes('selectionUnprepared', 'selectionUnprepared.@each'),

        onDataChange: function() {
            this.refreshContent();
        }.observes('data.@each'),

        onModelFilterChange: function() {
            this.set('currentPage', 1);
            this.refreshContent();
        }.observes('modelfilter'),

        init: function() {
            this._super(arguments);

            this.set('store_' + get(this, 'elementId'), DS.Store.create({
                container: this.get('container')
            }));

            this.refreshContent();
        },

        didInsertElement: function() {
        },

        refreshContent: function() {
            this._super(arguments);

            this.findItems();

            var me = this;

            console.log(this.get('widgetDataMetas'));
        },

        findItems: function() {
            var me = this;

            var store = this.get('store_' + get(this, 'elementId'));

            var query = {
                start: 0,
                limit: 10000
            };

            if(this.get('modelfilter') !== null) {
                query.filter = this.get('modelfilter');
            }

            store.findQuery(this.get('model'), query).then(function(result) {
                me.set('widgetDataMetas', result.meta);
                var items = result.get('content');
                me.set('items', result.get('content'));

                Ember.run.scheduleOnce('afterRender', {}, function() { me.rerender(); });

                me.extractItems(result);
            });
        }
    });

    Application.ComponentClassifiedcrecordselectorComponent = component.extend(PaginationMixin);

    return component;
});
