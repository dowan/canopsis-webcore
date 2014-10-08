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
    'ember-data',
    'app/application',
    'utils',
    'app/lib/utils/data',
    'app/lib/utils/forms',
    'app/lib/utils/notification'
], function(Ember, DS, Application, utils, dataUtils, formsUtils, notificationUtils) {

    /**
      Implements Custom filter management for list
      A filter is a combination of a cfilter and a title.
      Custom cfilter allow perform selelection on a list with custom filter information.
    */

    var get = Ember.get,
        set = Ember.set;

    var mixin = Ember.Mixin.create({
        partials: {
            subHeader: ['customfilters']
        },

        actions: {
            setFilter: function (filter) {
                set(this, 'findParams_cfilterFilterPart', filter);

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
                    widgetController.get('custom_filters').pushObject(record);
                    console.log('Custom filter created', record, form);
                    notificationUtils.info(__('Custom filter created'));
                    widgetController.set('userParams.custom_filters', widgetController.get('custom_filters'));
                    widgetController.get('userConfiguration').saveUserConfiguration();

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
                    widgetController.get('custom_filters').pushObject(record);
                    console.log('Custom filter created', record, form);
                    notificationUtils.info(__('Custom filter created'));
                    widgetController.set('userParams.custom_filters', widgetController.get('custom_filters'));
                    widgetController.get('userConfiguration').saveUserConfiguration();

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
                    controller.get('userConfiguration').saveUserConfiguration();
                });
            }
        },

        default_filterChanged: function(){
            console.log("default_filterChanged observer");
            set(this, 'findParams_cfilterFilterPart', get(this, 'default_filter'));
            this.refreshContent();
        }.observes('default_filter'),

    });

    Application.CustomfilterMixin = mixin;

    return mixin;
});
