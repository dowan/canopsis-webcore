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

var editorsTemplates = [
    /* js = 'cvw' : the editor have a Controller, a View and a Webcomponent
     * js = 'cv' : the editor have a Controller and a View
     * js = 'w' : the editor have a Webcomponent
     */
    { name: 'actionfilter', js: 'w' },
    { name: 'array', js: 'w'},
    { name: 'arrayclassifiedcrecordselector' },
    { name: 'boolean' },
    { name: 'cfilter', js: 'w' },
    { name: 'cfilterwithproperties'},
    { name: 'cmetric', js: 'w' },
    { name: 'color' },
    { name: 'criticity', js: 'w' },
    { name: 'dateinterval', js: 'w' },
    { name: 'defaultpropertyeditor', js: 'v' },
    { name: 'duration', js: 'w' },
    { name: 'sortable', js: 'w' },
    { name: 'eventselector', js: 'w' },
    { name: 'group', js: 'c' },
    { name: 'integer' },
    { name: 'mail' },
    { name: 'mixinchooser', js: 'w'},
    { name: 'richtext', js: 'w' },

    { name: 'templateselector' },
    { name: 'separator' },
    { name: 'serieitem', js: 'w'},
    { name: 'session', js: 'w' },

    { name: 'simplelist', js: 'v' },
    { name: 'source', js: 'v' },
    { name: 'state', js: 'w' },
    { name: 'stringclassifiedcrecordselector' },
    { name: 'stringpair'},
    { name: 'tags' , js: "w" },

    { name: 'textarea' },
    { name: 'timeinterval', js: 'w' },
    { name: 'timestamp', js: 'w' },
    { name: 'modelselect', js: 'w' }
];

var deps = ['ember', 'app/routes/userview'];

var depsTemplates = [];

//generate deps
for (var i = 0; i < editorsTemplates.length; i++) {
    var name = editorsTemplates[i].name;
    var files = editorsTemplates[i].js;

    var tmplPos;

    if (files !== undefined) {
        var url;

        if (files.indexOf('c') >= 0) {
            url = 'app/editors/' + name + '/controller';

            deps.push(url);
        }

        if (files.indexOf('v') >= 0) {
            url = 'app/editors/' + name + '/view';

            deps.push(url);
        }

        if (files.indexOf('w') >= 0) {
            url = 'text!app/editors/' + name + '/component.html';

            tmplPos = deps.push(url);
            depsTemplates.push({name: 'components/component-' + name, pos: tmplPos});

            url = 'app/editors/' + name + '/component';
            deps.push(url);
        }
    }

    tmplPos = deps.push('text!app/editors/' + name + '/template.html');
    depsTemplates.push({name: 'editor-' + name, pos: tmplPos});

}

console.log({"editors dependencies": deps});

define(deps, function(Ember) {
    console.log("load editors", arguments);

    for (var i = 0; i < depsTemplates.length; i++) {
        var tmplInfo = depsTemplates[i];

        var template = arguments[tmplInfo.pos - 1];

        console.log("new editor", tmplInfo.name);

        Ember.TEMPLATES[tmplInfo.name] = Ember.Handlebars.compile(template);
    }
});

