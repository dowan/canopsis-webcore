/*
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

/** @module canopsis.frontend.tests */


define([
    'canopsis/enabled',
    'canopsis/tests/testhelpers/ajax-stub'
], function (enabledBricksUtil) {

    window.startCanopsisTests = function (application) {
        application.setupForTesting();

        Ember.Test.registerAsyncHelper('waitForElement', function(app, element) {
            return Ember.Test.promise(function(resolve) {
                Ember.Test.adapter.asyncStart();
                var interval = setInterval(function(){
                    if($(element).length>0){
                        clearInterval(interval);
                        Ember.Test.adapter.asyncEnd();
                        Ember.run(null, resolve, true);
                    }
                }, 100);
            });
        });

        application.injectTestHelpers();

        window.App = application;

        console.log('Starting automated tests');
        enabledBricksUtil.getEnabledModules(function(enabledBricks) {
            var bricksTestMainList = [];
            for (var i = 0, l = enabledBricks.length; i < l; i++) {
                bricksTestMainList.pushObject('canopsis/' + enabledBricks[i] + '/init.test');
            }

            require(bricksTestMainList);
        });
    };
});
