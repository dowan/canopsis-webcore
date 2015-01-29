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
    'app/lib/utils/dates',
], function(Ember, dateUtils) {

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

        specialDisplay: function () {
            console.log('special display', get(this, 'eventstate'), get(this, 'optionaltimestamp'))
            return get(this, 'eventstate') && get(this, 'optionaltimestamp');
        }.property()


    });

    Ember.Application.initializer({
        name:"component-timestamptooltiped",
        initialize: function(container, application) {
            application.register('component:component-timestamptooltiped', component);
        }
    });

    return component;
});
