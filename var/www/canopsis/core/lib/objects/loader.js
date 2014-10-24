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

define([], function() {

    var makeDeps = function(deps, requirementList) {
        var jsDeps = [];
        //generate deps
        for (var i = 0, l = requirementList.length; i < l; i++) {

            var requirementTemplate = requirementList[i].template;
            if(requirementTemplate) {
                deps.push('text!' + requirementList[i].template);
            }

            var requirementUrl = requirementList[i].url;
            if(requirementUrl) {
                jsDeps.push(requirementUrl);
            }
        }

        for (i = 0; i < jsDeps.length; i++) {
            deps.push(jsDeps[i]);
        }

        return deps;
    };


    var loader = {
        loadWithTemplates: function(items) {
            var deps = ['ember'];
            var depsSize = deps.length;

            deps = makeDeps(deps, items);

            define(deps, function(Ember) {
                for (var i = depsSize, l = items.length, j = depsSize; i < l; i++, j++) {

                    if(items[i - depsSize].template !== undefined) {
                        var templateName = items[i - depsSize].name;

                        Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[j]);
                    } else {
                        j--;
                    }
                }
            });
        }
    };

    window.loader = loader;

    return loader;
});
