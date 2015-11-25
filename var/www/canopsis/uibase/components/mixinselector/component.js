/*
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

Ember.Application.initializer({
    name: 'component-mixinselector',
    after: 'MixinsRegistry',
    initialize: function(container, application) {
        var mixinsRegistry = container.lookupFactory('registry:mixins');

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;


        var component = Ember.Component.extend({

            init: function() {

                this._super.apply(this, arguments);

                if(isNone(get(this, 'content'))) {
                    set(this, 'content', Ember.A());
                }

                set(this, 'selectionPrepared', Ember.A());

                var content = get(this, 'content');
                if(content) {
                    var schemasRegistry = container.lookupFactory('registry:schemas');
                    for (var i = 0, l = content.length; i < l; i++) {
                        if(typeof content[i] === 'string') {
                            content[i] = { name: content[i] };

                        }
                    }
                }
                set(this, 'selectionPrepared', content);
            },


            /*
             * Compute a structure with classified item each time the 'items' property changed
             */
            classifiedItems: function () {
                var schemasRegistry = container.lookupFactory('registry:schemas');

                for (var i = 0; i < mixinsRegistry.all.length; i++) {
                    var currentMixinName = get(mixinsRegistry.all[i], 'name');
                    var schema = schemasRegistry.getByName(currentMixinName);
                    if(schema) {
                        schema = schema.schema;
                        if(schema && get(schema, 'metadata.description')) {
                            mixinsRegistry.all[i].description = get(schema, 'metadata.description');
                        }
                    }
                }
                return mixinsRegistry;
            }.property(),

            selectionUnprepared: Ember.computed.alias('content'),

            recomputeSelection: function() {
                var selection = get(this, 'selectionPrepared');
                console.log('recomputeSelection', selection, get(this, 'selectionPrepared'));

                var content = get(this, 'content');

                var resBuffer = Ember.A();
                if(selection) {
                    for (var i = 0, l = selection.length; i < l; i++) {
                        var currentItem = selection[i];
                        var currentItemName = get(currentItem, 'name');
                        var newResBufferItem;

                        var existingContentItem = content.findBy('name', currentItemName);
                        if(existingContentItem) {
                            newResBufferItem = existingContentItem;
                        } else {
                            newResBufferItem = {
                                name: currentItemName
                            };

                            var model = container.lookupFactory('model:' + Ember.dasherize(currentItemName));
                            if(model) {
                                newResBufferItem.description = get(model.proto(), 'metadata.description');
                            }
                        }
                        resBuffer.pushObject(newResBufferItem);
                    }
                }

                set(this, 'content', resBuffer);
            },

            actions: {
                selectItem: function() {
                    this.recomputeSelection();
                },

                unselectItem: function(){
                    this.recomputeSelection();
                }
            }
        });

        application.register('component:component-mixinselector', component);
    }
});
