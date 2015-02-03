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
    'utils',
    'app/lib/utils/data',
    'app/lib/utils/forms',
    'app/lib/utils/notification',
    'app/lib/factories/mixin'
], function(Ember, DS, utils, dataUtils, formsUtils, notificationUtils, Mixin) {



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
            subHeader: ['customfilters']
        },

        init: function() {
            var mixinsOptions = get(this, 'content.mixins');

            if(mixinsOptions) {
                var customfilterlistOptions = get(this, 'content.mixins').findBy('name', 'customfilterlist');
                this.mixinOptions.customfilterlist = customfilterlistOptions;
            }

            var filter;
            var selectedCustomFilter = get(this, 'userParams.findParams_cfilterFilterPart');
            if (isNone(selectedCustomFilter)) {
                //retrieve custom default filter.
                var mixins = get(this, 'model.mixins');
                for (var key in mixins) {
                    if (get(mixins, key + '.name') === 'Customfilterlist') {
                        filter = get(mixins, key + '.default_filter');
                    }
                }
            } else {
                filter = selectedCustomFilter;
            }


            set(this, 'findParams_cfilterFilterPart', filter);

            this._super();

            if(!get(this, 'userParams.custom_filters')) {
                set(this, 'userParams.custom_filters', Ember.A());
            }
        },

        isSelectedFilter: function (filterList) {
            if(!filterList || !filterList.length) {
                return false;
            }

            var filterLen = filterList.length;
            var currentTitle = get(this, 'currentFilter.title');
            for (var i=0; i<filterLen; i++) {

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
            this.isSelectedFilter(get(this, 'userParams.custom_filters'));
            return this.isSelectedFilter(get(this, 'mixinOptions.customfilterlist.filters'));
        }.property('mixinOptions.customfilterlist.filters', 'currentFilter'),

        custom_filters_list: function () {
            this.isSelectedFilter(get(this, 'mixinOptions.customfilterlist.filters'));
            return this.isSelectedFilter(get(this, 'userParams.custom_filters'));
        }.property('userParams.custom_filters'),


        actions: {
            setFilter: function (filter) {
                var query = get(filter, 'filter');
                set(this, 'findParams_cfilterFilterPart', query);
                set(this, 'currentFilter', filter);
                console.log('currentFilter', get(this, 'currentFilter'));

                set(this, 'userParams.findParams_cfilterFilterPart', query);
                set(this, 'userParams.currentFilter', filter);
                this.saveUserConfiguration();


                if (get(this, 'currentPage') !== undefined) {
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


                    get(widgetController, 'userParams.custom_filters').pushObject(record);

                    widgetController.notifyPropertyChange('userParams.custom_filters');

                    console.log('Custom filter created', record, form);
                    notificationUtils.info(__('Custom filter created'));
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
                    widgetController.get('custom_filters').removeObject(filter);
                    record = form.get('formContext');
                    widgetController.get('userParams.custom_filters').pushObject(record);
                    console.log('Custom filter created', record, form);
                    notificationUtils.info(__('Custom filter created'));
                    widgetController.saveUserConfiguration();

                });
            },

            removeFilter: function (filter) {

                var title;
                try {
                    title = filter.get('title');
                } catch (err) {
                    title = filter.title;
                }

                var recordWizard = formsUtils.showNew('confirmform', {}, {
                    title: __('Are you sure to delete filter') + ' ' + title + '?'
                });

                var controller = this;

                recordWizard.submit.then(function(form) {
                    controller.get('custom_filters').removeObject(filter);
                    notificationUtils.info(__('Custom filter removed'));
                    controller.set('userParams.custom_filters', controller.get('custom_filters'));
                    controller.saveUserConfiguration();
                });
            }
        },

    });

    return mixin;
});
