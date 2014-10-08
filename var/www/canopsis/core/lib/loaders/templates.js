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

var templates = [
    { name: 'application' },
    { name: 'index' },
    { name: 'containerwidget' },
    { name: 'formwrapper' },
    { name: 'recorddisplayer' },
    { name: 'widgettitlebar' },
    { name: 'userview' },
    { name: 'widget' },
    { name: 'listline' },
    { name: 'widgetslot-default' },
    { name: 'widgetslot-grey' },
    { name: 'partialslot' },
    { name: 'pagination' },
    { name: 'itemsperpage' },
    { name: 'search' },
    { name: 'customfilters' },

    { name: 'timeintervalselection' },
    { name: 'userstatusmenu' },
    { name: 'schemamanagerstatusmenu' },
    { name: 'notificationsstatusmenu' },
    { name: 'consolemanagerstatusmenu' },
    { name: 'promisemanagerstatusmenu' },
    { name: 'presettoolbar' },
    { name: 'rightschecksumbuttons' },

    { name: 'actionbutton-edit', classes: ["action"], icon : "pencil", label : "Edit"},
    { name: 'actionbutton-ack', classes: ["action", "toolbar"], icon : "ok", label : "Ack"},
    { name: 'actionbutton-cancel', classes: ["action", "toolbar"], icon : "ban-circle", label : "Cancel"},
    { name: 'actionbutton-changestate', classes: ["action", "toolbar"],icon : "retweet", label : "Change criticity" },
    { name: 'actionbutton-show', classes: ["action"], icon : "eye-open",label : "Show" },
    { name: 'actionbutton-info', classes: ["action"], icon : "info-sign",label : "Info" },
    { name: 'actionbutton-create', classes: ["action", "toolbar"], icon : "plus-sign", label : "Create" },
    { name: 'actionbutton-removeselection', classes: ["action", "toolbar"], icon : "trash", label : "Remove selection" },
    { name: 'actionbutton-incident', classes: ["action", "toolbar"],icon : "ticket", label : "Incident" },
    { name: 'actionbutton-ticketnumber', classes: ["action", "toolbar"],icon : "ticket", label : "Ticket nummber" },

    { name: 'actionbutton-history', classes: ["action", "toolbar"],icon : "time", label : "History" },
    { name: 'actionbutton-eventnavigation', classes: ["action", "toolbar"],icon : "time", label : "Event navigation" },

    { name: 'formbutton-submit', classes: ["formbutton"] },
    { name: 'formbutton-cancel', classes: ["formbutton"] },
    { name: 'formbutton-ack', classes: ["formbutton"] },
    { name: 'formbutton-ackandproblem', classes: ["formbutton"] },
    { name: 'formbutton-incident', classes: ["formbutton"] },
    { name: 'formbutton-delete', classes: ["formbutton"] },
    { name: 'formbutton-previous', classes: ["formbutton"] },
    { name: 'formbutton-next', classes: ["formbutton"] },
    { name: 'formbutton-inspectform', classes: ["formbutton"] },

    { name: 'titlebarbutton-moveup', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-movedown', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-moveleft', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-moveright', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-minimize', classes: ["titlebarbutton"] },

    { name: 'actionbutton-foldable' ,  classes: ["foldable"]},
    { name: 'column-unfold' ,  classes: ["foldable"]},
];

var deps = ['ember'];
var depsSize = deps.length;

for (var i = 0; i < templates.length; i++) {
    deps.push('text!app/templates/' + templates[i].name + '.html');
}

define(deps, function(Ember) {
    templatesLoaded = Ember.Object.create();
    templatesLoaded.all = [];
    templatesLoaded.byClass = Ember.Object.create();

    for (var i = depsSize, li = arguments.length; i < li; i++) {
        var currentTemplate = templates[i - depsSize];
        Ember.TEMPLATES[currentTemplate.name] = Ember.Handlebars.compile(arguments[i]);

        currentTemplate.fileContent = arguments[i];

        if (currentTemplate.classes !== undefined) {
            for (var j = 0, lj = currentTemplate.classes.length; j < lj; j++) {
                var currentClass = currentTemplate.classes[j];

                if (templatesLoaded.byClass[currentClass] === undefined) {
                    templatesLoaded.byClass[currentClass] = [];
                }

                templatesLoaded.byClass[currentClass].push(currentTemplate);
            }
        }

        templatesLoaded.all.push(currentTemplate);
    }

    return templatesLoaded;
});
