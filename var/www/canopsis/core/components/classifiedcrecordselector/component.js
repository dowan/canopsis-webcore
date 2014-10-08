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
        selectionUnprepared:  [],

        init: function() {
            this._super(arguments);

            this.set('store_' + get(this, 'elementId'), DS.Store.create({
                container: this.get('container')
            }));

            var initialContent = get(this, 'content');
            console.log('init', initialContent);

            this.setInitialContent(initialContent);

            this.refreshContent();
        },

        actions: {
            do: function(action, item) {
                this.targetObject.send(action, item);
            }
        },

        setInitialContent: function(initialContent) {
            var valueKey = get(this, 'valueKey');

            console.log('setInitialContent', valueKey);
            if(initialContent) {
                if(valueKey) {
                    set(this, 'loadingInitialContent', "true");
                }

                //for the "if(valueKey)" case, check extractItems method
                if(!valueKey) {
                    if( typeof initialContent === "string") {
                        //we assume here that there is only one value
                        set(this, 'selectionUnprepared', [{ 'name': initialContent}]);
                    } else {
                        if( typeof initialContent === "object" && initialContent !== null) {
                            var buffer = [];

                            for (var key in initialContent) {
                                if (initialContent.hasOwnProperty(key)) {
                                    var data = this.deserializeAdditionnalData(get(initialContent, key));
                                    buffer.pushObject({'name': key, 'data': additionnalData});
                                }
                            }

                            set(this, 'selectionUnprepared', buffer);
                        } else {
                            set(this, 'selectionUnprepared', []);
                        }

                    }
                }
            }
        },

        /*
         * Compute a structure with classified item each time the 'items' property changed
         */
        classifiedItems : function(){
            var items = get(this, 'items');
            var valueKey = get(this, 'valueKey');
            console.log("recompute classifiedItems", get(this, 'items'), valueKey);

            var res = Ember.Object.create({
                all: Ember.A()
            });

            for (var i = 0, l = items.length; i < l; i++) {
                var currentItem = items[i];
                var objDict = { name: currentItem.get('crecord_name') };
                if(valueKey) {
                    console.log('add valueKey', currentItem.get(valueKey));
                    objDict.value = currentItem.get(valueKey);
                    console.log('objDict value', currentItem, currentItem.get(valueKey));
                }

                this.serializeAdditionnalData(currentItem, objDict);

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
                console.log("Push", selectionUnprepared[0]);

                if(valueKey) {
                    for (var i = 0; i < selectionUnprepared.length; i++) {
                        res.pushObject(selectionUnprepared[i]);
                    }
                } else {
                    for (var j = 0; j < selectionUnprepared.length; j++) {
                        res.pushObject(selectionUnprepared[j]);
                    }
                }
            } else {
                if(Ember.isArray(selectionUnprepared)) {
                    if(valueKey) {
                        res = selectionUnprepared[0];
                    } else {
                        res = selectionUnprepared[0];
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
                me.set('items', items);

                Ember.run.scheduleOnce('afterRender', {}, function() { me.rerender(); });
                me.extractItems(items);
            });
        },

        extractItems: function(items) {
            var valueKey = get(this, 'valueKey');
            var initialContent = get(this, 'content');

            console.log('extractItems', initialContent);
            if(valueKey) {
                //Fetch values with ajax request content
                var correspondingExtractedItem;

                if(typeof initialContent === "string") {
                    console.log('extractItems with valueKey', arguments, Ember.inspect(initialContent));

                    correspondingExtractedItem = items.findBy('id', initialContent);

                    console.log('correspondingExtractedItem', correspondingExtractedItem);
                    if(correspondingExtractedItem !== undefined) {
                        selectionUnprepared = [{ name: get(correspondingExtractedItem, 'crecord_name'), value: get(correspondingExtractedItem, 'id')}];
                        set(this, 'selectionUnprepared', selectionUnprepared);
                    }
                } else if( typeof initialContent === "object" && initialContent !== null) {
                    var buffer = [];

                    for (var key in initialContent) {
                        if (initialContent.hasOwnProperty(key)) {

                            correspondingExtractedItem = items.findBy('id', key);
                            var data = this.deserializeAdditionnalData(get(correspondingExtractedItem, key));

                            var selectionObject = {
                                name: get(correspondingExtractedItem, 'crecord_name'),
                                value: get(correspondingExtractedItem, 'id')
                            };

                            buffer.pushObject(selectionObject);
                        }
                    }

                    set(this, 'selectionUnprepared', buffer);
                }

                set(this, 'loadingInitialContent', false);
            }
        },

        deserializeAdditionnalData: function(additionnalData) {
            console.log('deserializeAdditionnalData', arguments);
        },

        serializeAdditionnalData: function(additionnalData) {
            console.log('serializeAdditionnalData', arguments);
        }
    });

    Application.ComponentClassifiedcrecordselectorComponent = component;

    return component;
});
