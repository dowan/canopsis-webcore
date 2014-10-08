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
    'app/application',
    'app/components/dictclassifiedcrecordselector/component'
], function(Ember, Application, DictclassifiedcrecordselectorComponent) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var component = DictclassifiedcrecordselectorComponent.extend({
        actions: {
            toggleRightChecksum: function(checksumFlag, item) {
                console.info('toggleRightChecksum action', arguments);

                //create item.data.checksum if not present in item dict
                if(!get(item, 'data')) {
                    set(item, 'data', Ember.Object.create());
                }

                if(!get(item, 'data.checksum')) {
                    set(item, 'data.checksum', Ember.Object.create());
                }

                var checksumFlagValue = get(item, 'data.checksum.' + checksumFlag);

                if(checksumFlagValue) {
                    set(item, 'data.checksum.' + checksumFlag, false);
                } else {
                    set(item, 'data.checksum.' + checksumFlag, true);
                }
            }
        }
    });

    Application.ComponentRightsComponent = component;

    return component;
});
