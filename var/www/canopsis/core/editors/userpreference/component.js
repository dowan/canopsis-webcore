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
    'utils',
    'app/lib/utils/notification',
], function($, Ember, Application, utils, notification) {

    var set = Ember.set,
        get = Ember.get;

    var component = Ember.Component.extend({
        init: function() {
            this._super();
            this.getUserPreferences();
        },

        getUserPreferences: function () {
            var userpreference = this;

            var userId = utils.session.get('id');

            console.debug('loading configuration for user ' + userId);

            var user = get(this, 'controllers.login.record._id');

            $.ajax({
                url: '/rest/userpreferences/userpreferences',
                async: false,
                data: {
                    limit: 100,
                    filter: JSON.stringify({
                        crecord_name: user,
                    })
                },
                success: function(data) {
                    if (data.success) {
                        console.log('User configuration load for widget complete', data);

                        var informations = [];

                        var len = data.data.length;
                        for (var i=0; i<len; i++) {
                            var labels = [];
                            for (var preference_label in data.data[i].widget_preferences) {
                                labels.push(preference_label);
                            }
                            informations.push({
                                labels: labels,
                                widgetId: data.data[i].widget_id,
                                widgetXtype: get(data.data[i], 'widgetXtype'),
                                viewId: get(data.data[i], 'viewId'),
                                title: get(data.data[i], 'title'),
                                preferenceId: get(data.data[i], '_id')
                            });
                        }

                        set(userpreference, 'informations', informations);


                    } else {
                        console.debug('No user preference exists for widget' + get(userpreference, 'title'));
                    }
                }
            }).fail(
                function (error) {
                    void (error);
                    console.log('No user s preference found for this widget');
                }
            );
        },

        actions: {
            removeUserPreference: function (preferenceId){

                var userpreference = this;
                var user = get(this, 'controllers.login.record._id');
                console.debug('will remove user preference with preference id ' + preferenceId + ' for user ' + user);
                $.ajax({
                    url: '/rest/userpreferences/userpreferences/' + preferenceId,
                    type :'DELETE',
                    success: function(data) {
                            userpreference.getUserPreferences();
                            notification.info('successfuly removed user preference');
                    }
                }).fail(
                    function (error) {
                        void (error);
                        console.log('Unable to remove user preference');
                        notification.error('Unable to remove user preference');
                    }
                );

            }
        }

    });

    Application.ComponentUserpreferenceComponent = component;

    return component;
});
