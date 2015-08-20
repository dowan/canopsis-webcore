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
    'app/lib/utils/dates',
], function(dateUtils) {

    Ember.Application.initializer({
        name:"component-timestamptooltiped",
        initialize: function(container, application) {

            var get = Ember.get,
                set = Ember.set,
                __ = Ember.String.loc;


            var component = Ember.Component.extend({
                showMainTimestamp :function () {
                    var maintitle = get(this, 'maintitle');
                    var timestamp = get(this, 'maintimestamp');
                    return __(maintitle) + '<br/><i>' +
                        dateUtils.timestamp2String(timestamp) + '</i>';
                }.property(),

                showOptionalElapsed: function () {
                    var optionaltimestamp = get(this, 'optionaltimestamp');
                    return dateUtils.durationFromNow(optionaltimestamp);
                }.property(),

            });

            application.register('component:component-timestamptooltiped', component);
        }
    });
});
