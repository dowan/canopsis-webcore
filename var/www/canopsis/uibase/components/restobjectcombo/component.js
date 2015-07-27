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

define([], function() {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({

        isLoading: true,

        init: function() {
            this._super();

            set(this, 'store', DS.Store.create({
                container: this.get('container')
            }));
        },

        destroy: function() {
            get(this, 'store').destroy();
        },

        /**
         * transforms the list of fetched elements into a categorized structure of elements, with a label and a value properties
         */
        categorizeElements: function(elements) {
            var categorizedElements = {},
                component = this;

            function appendTo(name, element) {
                if(categorizedElements[name] === undefined) {
                    categorizedElements[name] = Ember.A();
                }

                if(element.get(get(component, 'valueField')) === get(component, 'selectedValue')) {
                    categorizedElements[name].pushObject({
                        label: get(element, get(component, 'labelField')),
                        value: get(element, get(component, 'valueField')),
                        selected: true
                    });
                } else {
                    categorizedElements[name].pushObject({
                        label: get(element, get(component, 'labelField')),
                        value: get(element, get(component, 'valueField'))
                    });
                }
            }

            for (var i = 0, li = elements.length; i < li; i++) {
                var tags = get(elements[i], 'tags');
                if(tags && tags.length) {
                    for (var j = 0, lj = tags.length; j < lj; j++) {
                        appendTo(tags[j], elements[i]);
                    }
                } else {
                    appendTo("untagged", elements[i]);
                }
            }

            //transform dict into array
            var keys = Ember.keys(categorizedElements);
            var res = Ember.A();
            for (i = 0; i < keys.length; i++) {
                res.pushObject({ name: keys[i], content: categorizedElements[keys[i]]});
            }
            console.log('res', res);
            return res;
        },

        filteredElements: function() {
            var component = this;

            if(!get(this, 'searchCriterion')) {
                return this.categorizeElements(get(this, 'content'));
            } else {
                var searchCriterion = get(this, 'searchCriterion');
                var filteredContent = get(this, 'content').filter(function(item){
                    console.log('item', item);
                    var doesItStartsWithSearchFilter = item.get(get(component, 'labelField')).slice(0, searchCriterion.length) == searchCriterion;

                    var tags = item.get('tags');
                    if(tags) {
                        for (var i = 0, l = tags.length; i < l; i++) {
                            var doesTagsStartsWithSearchFilter = tags[i].slice(0, searchCriterion.length) == searchCriterion;
                            if(doesTagsStartsWithSearchFilter) {
                                return true;
                            }
                        }
                    }
                    return doesItStartsWithSearchFilter;
                });
                return this.categorizeElements(filteredContent);
            }
        }.property('content', 'searchCriterion'),

        didInsertElement: function() {
            var component = this;

            get(this, 'store').findQuery(get(this, 'schemaType'), {
                limit: 10000
            }).then(function(result) {
                set(component, 'isLoading', false);
                set(component, 'content', result.get('content'));

                //insert the hook to manage selection change
                Ember.run.schedule('afterRender', function bindEvents(){
                    this.$('select').on('change', function manageSelectChange() {
                        console.log('select value', this.value);
                        set(component, 'attr.value', this.value);
                    });
                });

            });

        },

        willDestroyElement: function() {
            this.$('select').off('change');
        }
    });


    Ember.Application.initializer({
        name:"component-restobjectcombo",
        initialize: function(container, application) {
            application.register('component:component-restobjectcombo', component);
        }
    });

    return component;
});
