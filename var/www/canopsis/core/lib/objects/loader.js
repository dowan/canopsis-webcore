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

    var makeDeps = function(requirementList) {

        var jsDeps = [];
        var htmlDeps = [];
        var htmlNames = [];
        //ember is requied here and works with arguments + 1 in loadwithtemplates function
        var deps = ['ember'];

        //building html and js dependencies

        for (var i = 0, l = requirementList.length; i < l; i++) {

            if(requirementList[i].template) {
                htmlDeps.push('text!' + requirementList[i].template);
                htmlNames.push(requirementList[i].name);
            }

            if(requirementList[i].url) {
                jsDeps.push(requirementList[i].url);
            }
        }


        deps = deps.concat(htmlDeps);
        deps = deps.concat(jsDeps);

        //computed data information
        return {
            deps: deps,
            htmlDeps: htmlDeps,
            htmlNames: htmlNames,
        };
    };


    var loader = {
        loadWithTemplates: function(items) {

            var info = makeDeps(items);

            define(info.deps, function(Ember) {

                var len = info.htmlNames.length;

                for (var i=0; i<len; i++) {
                    Ember.TEMPLATES[info.htmlNames[i]] = Ember.Handlebars.compile(arguments[i + 1]);
                }

            });
        }
    };

    window.loader = loader;

    return loader;
});
