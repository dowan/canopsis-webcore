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
    name:'CustomfilterlistMixin',
    after: ['MixinFactory', 'DataUtils', 'FormsUtils', 'NotificationUtils'],
    initialize: function(container, application) {
        var Mixin = container.lookupFactory('factory:mixin');
        var dataUtils = container.lookupFactory('utility:data');
        var formsUtils = container.lookupFactory('utility:forms');
        var notificationUtils = container.lookupFactory('utility:notification');

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;


        /**
          * Implements Custom filter management for list
          * A filter is a combination of a cfilter and a title.
          * Custom cfilter allow perform selelection on a list with custom filter information.
        */
        var mixin = Mixin('customfilterlist', {
            partials: {
                actionToolbarButtons: ['customfilters']
            },

            init: function() {
                this._super();

                if(!get(this, 'model.user_filters')) {
                    set(this, 'model.user_filters', Ember.A());
                }
            },

            isSelectedFilter: function (filterList) {
                if(!filterList || !filterList.length) {
                    return false;
                }

                var filterLen = filterList.length;
                var currentTitle = get(this, 'model.selected_filter.title');
                for (var i = 0; i < filterLen; i++) {

                    var compareTitle = get(filterList[i], 'title');

                    console.log('compare filters',currentTitle, compareTitle);

                    if (currentTitle === compareTitle) {
                        set(filterList[i], 'isActive', true);
                    } else {
                        set(filterList[i], 'isActive', false);
                    }
                }

                return filterList;
            },

            filters_list: function () {
                return this.isSelectedFilter(get(this, 'mixinOptions.customfilterlist.filters'));
            }.property('mixinOptions.customfilterlist.filters', 'model.selected_filter'),

            user_filters: function () {
                return this.isSelectedFilter(get(this, 'model.user_filters'));
            }.property('model.user_filters', 'model.selected_filter'),

            computeFilterFragmentsList: function() {
                var list = this._super(),
                    mixinOptions = get(this, 'model.mixins').findBy('name', 'customfilterlist'),
                    userFilter;

                if(get(this, 'model.selected_filter.filter') !== null && get(this, 'model.selected_filter.filter') !== undefined) {
                    userFilter = get(this, 'model.selected_filter.filter');
                } else if(get(this, 'model.selected_filter') && !get(this, 'model.selected_filter.filter')) {
                    userFilter = {};
                } else if(mixinOptions && mixinOptions.default_filter) {
                    userFilter = mixinOptions.default_filter;
                    userFilter = JSON.parse(userFilter);
                } else {
                    userFilter = {};
                }

                list.pushObject(userFilter);

                return list;
            },

            actions: {
                setFilter: function (filter) {

                    var query = get(filter, 'filter');

                    set(filter, 'isActive', true);
                    //current user filter set for list management
                    set(this, 'model.selected_filter', filter);
                    //user filter for list be able to reload properly
                    set(this, 'model.userFilter', query);
                    //push userparams to db
                    this.saveUserConfiguration();

                    //changing pagination information
                    if (!isNone(get(this, 'currentPage'))) {
                        set(this, 'currentPage', 1);
                    }

                    this.refreshContent();
                },

                addUserFilter: function () {
                    var widgetController = this;

                    var record = dataUtils.getStore().createRecord('customfilter', {
                        crecord_type: 'customfilter'
                    });

                    var recordWizard = formsUtils.showNew('modelform', record, {
                        title: __('Create a custom filter for current list')
                    });

                    recordWizard.submit.then(function(form) {
                        record = form.get('formContext');

                        get(widgetController, 'model.user_filters').pushObject(record);

                        widgetController.notifyPropertyChange('model.user_filters');


                        console.log('Custom filter created', record, form);
                        notificationUtils.info(__('Custom filter created'));

                        // get(widgetController, 'viewController').get('content').save();

                        widgetController.saveUserConfiguration();
                    });
                },

                editFilter: function (filter) {

                    var widgetController = this;

                    //rebuild a crecord as data may be simple js object saved to userpreferences
                    var record = dataUtils.getStore().createRecord('customfilter', {
                        crecord_type: 'customfilter',
                        filter: get(filter, 'filter'),
                        title: get(filter, 'title'),
                    });

                    var recordWizard = formsUtils.showNew('modelform', record, {
                        title: __('Edit filter for current list')
                    });

                    recordWizard.submit.then(function(form) {
                        widgetController.get('model.user_filters').removeObject(filter);
                        record = form.get('formContext');
                        widgetController.get('model.user_filters').pushObject(record);
                        console.log('Custom filter created', record, form);
                        notificationUtils.info(__('Custom filter created'));

                        widgetController.saveUserConfiguration();
                    });
                },

                removeFilter: function (filter) {

                    var title = get(filter, 'title');

                    var recordWizard = formsUtils.showNew('confirmform', {}, {
                        title: __('Are you sure to delete filter') + ' ' + title + '?'
                    });

                    var widgetController = this;

                    recordWizard.submit.then(function(form) {
                        widgetController.get('model.user_filters').removeObject(filter);
                        notificationUtils.info(__('Custom filter removed'));

                        // get(widgetController, 'viewController').get('content').save();

                        widgetController.saveUserConfiguration();
                    });
                }
            }
        });

        application.register('mixin:customfilterlist', mixin);
    }
});
