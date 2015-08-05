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
    'canopsis/enabled',
	'canopsis/canopsisConfiguration',
	'canopsis/core/lib/externals/ember-qunit-builds/ember-qunit.amd',
    'link!canopsis/core/lib/externals/qunit/qunit/qunit.css'
], function(enabledBricksUtil, canopsisConfiguration) {
    if (!canopsisConfiguration.DEBUG) {
        console.tags = {
            add:function() {},
            remove:function() {}
        };

        console.log = function(){};
        console.info = function(){};
        console.error = function(){};
        console.group = function(){};
        console.groupEnd = function(){};
        console.warn = function(){};
    }

    window.startCanopsisTests = function (application) {

        application.setupForTesting();
        application.injectTestHelpers();

        console.log('Starting automated tests');
        enabledBricksUtil.getEnabledModules(function(enabledBricks) {
            var bricksTestMainList = [];
            for (var i = 0, l = enabledBricks.length; i < l; i++) {
                if(enabledBricks[i] !== 'core') {
                    bricksTestMainList.pushObject('canopsis/' + enabledBricks[i] + '/init.test');
                }
            }
            require(bricksTestMainList);
        });
    };
});

