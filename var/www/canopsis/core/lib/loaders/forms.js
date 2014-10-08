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

var formsTemplates = [
    'modelform',
    'widgetform',
    'arrayitemform',
    'jobform',
    'taskform',
    'scheduleform',
    'confirmform',
    //'connectorform',
    //"confirmform"
];

var deps = ['ember'];
var jsDeps = [];
var depsSize = deps.length;


//generate deps
for (var i = 0, l = formsTemplates.length; i < l; i++) {
    deps.push('text!app/forms/' + formsTemplates[i] + '/template.html');

    var controllerUrl = 'app/forms/' + formsTemplates[i] + '/controller';
    jsDeps.push(controllerUrl);
}

for (i = 0, l = jsDeps.length; i < l; i++) {
    deps.push(jsDeps[i]);
}

define(deps, function(Ember) {
    console.tags.add('loader');

    console.log("load forms", arguments);
    for (var i = 0, l = formsTemplates.length; i < l; i++) {
        var templateName = formsTemplates[i];
        Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[i + depsSize]);
    }

    console.tags.remove('loader');

});

