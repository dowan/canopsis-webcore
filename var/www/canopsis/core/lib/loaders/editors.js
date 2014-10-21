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
    { name: 'actionfilter' },
    { name: 'array' },
    { name: 'arrayclassifiedcrecordselector' },
    { name: 'attributepreset' },
    { name: 'boolean' },
    { name: 'cfilter' },
    { name: 'cfilter2', js: 'w' },
    { name: 'cfilter3', js: 'w' },
    { name: 'cfilterwithproperties'},
    { name: 'cmetric'},
    { name: 'color' },
    { name: 'criticity' },
    { name: 'dateinterval' },
    { name: 'defaultpropertyeditor' },
    { name: 'dictclassifiedcrecordselector' },
    { name: 'duration' },
    { name: 'eventselector' },
    { name: 'integer' },
    { name: 'mail' },
    { name: 'mixinchooser' },
    { name: 'modelselect' },
    { name: 'richtext' },
    { name: 'rights' },
    { name: 'separator' },
    { name: 'serieitem'},
    { name: 'session' },
    { name: 'simpledict' },
    { name: 'simplelist' },
    { name: 'sortable' },
    { name: 'source' },
    { name: 'state' },
    { name: 'stringclassifiedcrecordselector' },
    { name: 'stringpair' },
    { name: 'tags' },
    { name: 'templateselector' },
    { name: 'textarea' },
    { name: 'timeinterval' },
    { name: 'timestamp' },
    { name: 'userpreference' }
];

var editorsDeps = ['ember', 'app/lib/editorregistry'];

var editorDepsTemplates = [];

//generate deps
for (var i = 0, l = editorsTemplates.length; i < l; i++) {
    var name = editorsTemplates[i].name;
    var files = editorsTemplates[i].js;

    var tmplPos;

    if (files !== undefined) {
        var url;

        if (files.indexOf('c') >= 0) {
            url = 'app/editors/' + name + '/controller';

            editorsDeps.push(url);
        }

        if (files.indexOf('v') >= 0) {
            url = 'app/editors/' + name + '/view';

            editorsDeps.push(url);
        }

        if (files.indexOf('w') >= 0) {
            url = 'text!app/editors/' + name + '/component.html';

            tmplPos = editorsDeps.push(url);
            editorDepsTemplates.push({name: 'components/component-' + name, pos: tmplPos});

            url = 'app/editors/' + name + '/component';
            editorsDeps.push(url);
        }
    }

    tmplPos = editorsDeps.push('text!app/editors/' + name + '/template.html');
    editorDepsTemplates.push({name: 'editor-' + name, pos: tmplPos});
}

console.log({"editors dependencies": editorsDeps});

define(editorsDeps, function(Ember, editorRegistry) {
    console.tags.add('loader');

    for (var i = 0; i < editorDepsTemplates.length; i++) {
        var tmplInfo = editorDepsTemplates[i];

        var template = arguments[tmplInfo.pos - 1];

        console.log("new editor", tmplInfo.name);

        editorRegistry.add({template: template}, tmplInfo.name);

        Ember.TEMPLATES[tmplInfo.name] = Ember.Handlebars.compile(template);
    }

    console.groupEnd();

    console.tags.remove('loader');
});

