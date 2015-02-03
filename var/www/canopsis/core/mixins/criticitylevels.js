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
    'app/lib/factories/mixin'
], function(Ember, Mixin) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    /**
      Implements pagination in ArrayControllers

      You should define on the ArrayController:
          - the `findOptions` property
          - the `findItems()` method

    */
    var mixin = Mixin('criticitylevels', {

        init:function () {

            this.warn_value = get(this, 'config.warn_value');
            this.crit_value = get(this, 'config.crit_value');
            this.unit_or_percent = get(this, 'config.unit_or_percent');
            this.background_color = get(this, 'config.background_color');
            this.warn_color = get(this, 'config.warn_color');
            this.critic_color = get(this, 'config.critic_color');

            this._super.apply(this, arguments);

            if(isNone(get(this, 'background_color'))){
                set(this, 'background_color', '#3c8dbc');
            }
            if(isNone(get(this, 'warn_color'))){
                set(this, 'warn_color', '#f39c12');
            }
            if(isNone(get(this, 'critic_color'))){
                set(this, 'critic_color', '#f56954');
            }
            
            //set(this, 'warn_value', '35');

        }
    });

    return mixin;
});
