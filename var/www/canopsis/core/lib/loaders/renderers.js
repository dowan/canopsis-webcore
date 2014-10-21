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

var renderersTemplates = [
    'ack',
    'actionfilter',
    'boolean',
    'cfilter',
    'cfilterwithproperties',
    'color',
    'conf',
    'crecord-type',
    'criticity',
    'eventselector',
    'mail',
    'object',
    'percent',
    'rights',
    'richtext',
    'source',
    'state',
    'stateConnector',
    'status',
    'subprocess',
    'tags',
    'timestamp',
    'translator',
    'eventtype'
];

var rendererDeps = ['ember', 'app/lib/rendererregistry'];
var rendererDepsSize = rendererDeps.length;

for (var i = 0, l = renderersTemplates.length; i < l; i++) {
    rendererDeps.push('text!app/renderers/' + renderersTemplates[i] + '/template.html');
}

define(rendererDeps, function(Ember, rendererRegistry) {
    for (var i = rendererDepsSize, l = arguments.length; i < l; i++) {
        var templateName = "renderer-" + renderersTemplates[i - rendererDepsSize];

        rendererRegistry.add({template: arguments[i]}, templateName);
        Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[i]);
    }
});
