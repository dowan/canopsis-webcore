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

var mixinsArray = [
    { name: 'validation', classes: ["action"]},
    { name: 'modelDict', classes: ["action"]},
    { name: 'mixinArray', classes: ["test"]},
    { name: 'pagination', classes: ["test"]},
    { name: 'tags_optionFilter', classes: ["test"]},
];

var deps = ['app/lib/mixinsregistry'];
var depsSize = deps.length;

for (var i = 0; i < mixinsArray.length; i++) {
    var mixinUrl = 'app/mixins/' + mixinsArray[i].name;
    deps.push(mixinUrl);
}

define(deps, function(mixinsregistry) {

    console.log("Begin load mixins", arguments);
    for (var i = depsSize; i < arguments.length; i++) {
        var currentMixin = mixinsArray[i - depsSize];

        if (currentMixin.classes !== undefined) {
            for (var j = 0; j < currentMixin.classes.length; j++) {
                var currentClass = currentMixin.classes[j];

                if (mixinsregistry.byClass[currentClass] === undefined) {
                    mixinsregistry.byClass[currentClass] = [];
                }

                mixinsregistry.byClass[currentClass].push(currentMixin.name);
            }
        }
        mixinsregistry.all[currentMixin.name] = arguments[i];

    }

    return mixinsregistry;
});
