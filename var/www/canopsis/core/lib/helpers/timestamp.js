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

    var get = Ember.get,
        isNone = Ember.isNone;


    Ember.Handlebars.helper('timestamp', function(value, attr, record) {

        if (!isNone(record)) {
            value = get(record, 'timeStampState') || value;
        }

        var current = new Date().getTime();
        var timestamp = new Date(value * 1000);

        var timeSince = datesUtils.diffDate(timestamp, current, 'd') - 1;

        var time ='';
        var format;

        if(value && !isNone(attr)) {
            format = get(attr, 'options.format');
        }

        if (timeSince === 0) {
            format = 'timeOnly';
        }
        time = datesUtils.timestamp2String(value, format, true);

        return new Ember.Handlebars.SafeString(time);
    });

});
