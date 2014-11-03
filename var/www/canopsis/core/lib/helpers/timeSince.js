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
    'app/lib/utils/dates'
], function(Ember, datesUtils) {

    var __ = Ember.String.loc;

    Ember.Handlebars.helper('timeSince', function(timestamp , record) {

        if(timestamp || record.timeStampState) {

            var current = new Date().getTime();
            timestamp = record.timeStampState || timestamp;
            var a = new Date(timestamp * 1000);
            var time = datesUtils.diffDate(a, current, "d") - 1;

            var newObject = Ember.Object.create({value : time , field : "time" });

            var icon = '<span class=glyphicon glyphicon-time ></span>';
            if(time !== 0) {
                return new Ember.Handlebars.SafeString(time + ' ' + __('days ago'));
            }

            return new Ember.Handlebars.SafeString(__('Today'));
        } else {
            return "";
        }
    });
});
