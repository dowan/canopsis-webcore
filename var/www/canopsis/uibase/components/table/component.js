/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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
    'ember-data',
    'app/mixins/pagination'
], function(Ember, DS, PaginationMixin) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var component = Ember.Component.extend(PaginationMixin, {
        model: undefined,
        modelfilter: undefined,
        data: undefined,

        columns: [],
        items: [],

        mixinOptions: {
            pagination: {
                itemsPerPage: 5
            }
        },

        onDataChange: function() {
            this.refreshContent();
        }.observes('data.@each'),

        onModelFilterChange: function() {
            set(this, 'currentPage', 1);
            this.refreshContent();
        }.observes('modelfilter'),

        init: function() {
            this._super(arguments);

            if (!isNone(get(this, 'model'))) {
                set(this, 'store', DS.Store.create({
                    container: get(this, 'container')
                }));
            }

            set(this, 'widgetDataMetas', {total: 0});

            if (isNone(get(this, 'items'))) {
                set(this, 'items', []);
            }
        },

        didInsertElement: function() {
            this.refreshContent();
        },

        refreshContent: function() {
            this._super(arguments);

            this.findItems();

            console.log(get(this, 'widgetDataMetas'));
        },

        findItems: function() {
            try {
                var me = this;

                var store = get(this, 'store');
                var model = get(this, 'model');
                var modelfilter = get(this, 'modelfilter');

                var query = {
                    skip: get(this, 'paginationMixinFindOptions.start'),
                    limit: get(this, 'paginationMixinFindOptions.limit')
                };

                if (model !== undefined) {
                    if(modelfilter !== null) {
                        query.filter = modelfilter;
                    }

                    store.findQuery(model, query).then(function(result) {
                        console.log('Received data for table:', result);

                        set(me, 'widgetDataMetas', get(result, 'meta'));
                        set(me, 'items', get(result, 'content'));

                        me.extractItems(result);
                    });
                }
                else {
                    var items = get(this, 'data').slice(
                        query.skip,
                        query.skip + query.limit
                    );

                    set(this, 'widgetDataMetas', {
                        total: get(this, 'data.length')
                    });

                    set(this, 'items', items);

                    me.extractItems({
                        meta: get(this, 'widgetDataMetas'),
                        content: get(this, 'items')
                    });
                }
            } catch(err) {
                console.warn('extractItems not updated:', err);

                this.extractItems({
                    meta: get(this, 'widgetDataMetas'),
                    content: get(this, 'items')
                });
            }
        },

        actions: {
            do: function(action, item) {
                this.targetObject.send(action, item);
            }
        }
    });


    Ember.Application.initializer({
        name:"component-table",
        initialize: function(container, application) {
            application.register('component:component-table', component);
        }
    });

    return component;
});
