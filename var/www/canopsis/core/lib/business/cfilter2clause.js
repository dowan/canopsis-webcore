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
    'ember'
], function(Ember) {

    var get = Ember.get,
        set = Ember.set;


    var Clause = Ember.Object.extend({

        isLeave: true,

        display: function (){
            var clause = this;
            var jsonclause =  {
                'property': get(clause, 'property'),
                'operation': get(clause, 'operation.label') + ' (' + get(clause, 'operation.symbol') + ')',
                'value': get(clause, 'value'),
            };
            console.log('build json clause', jsonclause);
            return jsonclause;
        }.property(),

    });

    return Clause;
});
