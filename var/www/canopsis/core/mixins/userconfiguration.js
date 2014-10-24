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
    'app/lib/utils/hash',
    'utils',
    'app/lib/factories/mixin'
], function($, Ember, Application, hashUtils, utils, Mixin) {

    var get = Ember.get,
        set = Ember.set;

    var mixin = Mixin('userconfiguration', {

        needs: ['login'],

        content: {},

        init: function () {
            this._super();
            this.loadUserConfiguration();
            console.debug('user configuration loaded for widget ' + get(this, 'title'));
        },

        saveUserConfiguration: function (callback) {

            var preferences = get(this, 'userParams');
            console.debug('Ready to save user configuration', preferences);

            var preference_id = get(this, 'preference_id');
            if (preference_id === undefined) {
                preference_id = hashUtils.generate_GUID();
            }

            var user = get(this, 'controllers.login.record._id');

            var userConfiguration = {
                widget_preferences: preferences,
                crecord_name: user,
                widget_id: get(this, 'id'),
                widgetXtype: get(this,'xtype'),
                title: get(this,'title'),
                viewId: get(this,'viewId'),
                id: preference_id,
                crecord_type: 'userpreferences'
            };
            $.ajax({
                url: '/rest/userpreferences/userpreferences',
                type: 'POST',
                data: JSON.stringify(userConfiguration),
                success: function(data) {
                    void (data);
                    console.log('User configuration save statement for widget complete');
                    if (!Ember.isNone(callback)) {
                        callback();
                    }
                }
            });

        },

        loadUserConfiguration: function() {
            var userConfiguration = this;

            console.debug('loading configuration');
            //TODO @eric use an adapter
            var user = get(this, 'controllers.login.record._id');

            $.ajax({
                url: '/rest/userpreferences/userpreferences',
                async: false,
                data: {
                    limit: 1,
                    filter: JSON.stringify({
                        crecord_name: user,
                        widget_id: get(this, 'id')
                    })
                },
                success: function(data) {
                    if (data.success && data.data.length && data.data[0].widget_preferences !== undefined) {
                        console.log('User configuration load for widget complete', data);
                        var preferences = data.data[0].widget_preferences;

                        set(userConfiguration, 'preference_id', data.data[0]._id);
                        set(userConfiguration, 'userParams', preferences);

                        for (var key in preferences) {
                            console.debug('User preferences: will set key', key, 'in widget', get(userConfiguration, 'title'));
                            userConfiguration.set(key, preferences[key]);
                        }

                    } else {
                        console.debug('No user preference exists for widget' + get(userConfiguration, 'title'));
                    }
                }
            }).fail(
                function (error) {
                    void (error);
                    console.log('No user s preference found for this widget');
                }
            );
        }

    });


    return mixin;
});
