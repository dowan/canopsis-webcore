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
    'utils',
], function(Ember, utils) {

    var set = Ember.set;

    Ember.Handlebars.helper('recordCanBeAck', function(crecord) {

        console.debug('in recordCanBeAck. record status is', crecord.get('status'));
        recordCanBeAck = crecord.get('status') !== 0 && crecord.get('status') !== 2;
        set(crecord, 'recordCanBeAck', recordCanBeAck);

        return "";
    });

});
