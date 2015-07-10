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
    'app/lib/factories/wrapper',
    'app/lib/utils/i18n',
    'canopsis/canopsisConfiguration',
    'app/lib/externals/min/ember',
    'app/lib/externals/ember-template-compiler',
    'app/lib/externals/jquery-resize/jquery.ba-resize'
], function(Wrapper, i18n, canopsisConfiguration) {

    var get = Ember.get;

    Ember.Object.reopen({
        toJson: function() {
            return JSON.parse(JSON.stringify(this));
        }
    });

    var controllerDict = {
        init: function() {
            if(get(this, 'isGenerated')) {
                console.error('Ember is Instantiating a generated controller. This practice is not encouraged, as it might also be an underlying requireJS problem.', this);
            }
            this._super.apply(this, arguments);
        }
    };

    Ember.Controller.reopen(controllerDict);
    Ember.ArrayController.reopen(controllerDict);
    Ember.ObjectController.reopen(controllerDict);
    canopsisConfiguration.EmberIsLoaded = true;

    return Wrapper('ember', Ember, arguments, Ember.VERSION);
});
