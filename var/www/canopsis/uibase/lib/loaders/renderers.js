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

var renderers = [
    { name: 'renderer-ack', template: 'canopsis/uibase/renderers/ack/template.html'},
    { name: 'renderer-actionfilter', template: 'canopsis/uibase/renderers/actionfilter/template.html'},
    { name: 'renderer-boolean', template: 'canopsis/uibase/renderers/boolean/template.html'},
    { name: 'renderer-cfilter', template: 'canopsis/uibase/renderers/cfilter/template.html'},
    { name: 'renderer-cfilterwithproperties', template: 'canopsis/uibase/renderers/cfilterwithproperties/template.html'},
    { name: 'renderer-color', template: 'canopsis/uibase/renderers/color/template.html'},
    { name: 'renderer-conf', template: 'canopsis/uibase/renderers/conf/template.html'},
    { name: 'renderer-crecord-type',template: 'canopsis/uibase/renderers/crecord-type/template.html'},
    { name: 'renderer-criticity', template: 'canopsis/uibase/renderers/criticity/template.html'},
    { name: 'renderer-eventselector', template: 'canopsis/uibase/renderers/eventselector/template.html'},
    { name: 'renderer-mail', template: 'canopsis/uibase/renderers/mail/template.html'},
    { name: 'renderer-object', template: 'canopsis/uibase/renderers/object/template.html'},
    { name: 'renderer-percent', template: 'canopsis/uibase/renderers/percent/template.html'},
    { name: 'renderer-rights', template: 'canopsis/uibase/renderers/rights/template.html'},
    { name: 'renderer-richtext', template: 'canopsis/uibase/renderers/richtext/template.html'},
    { name: 'renderer-source', template: 'canopsis/uibase/renderers/source/template.html'},
    { name: 'renderer-state', template: 'canopsis/uibase/renderers/state/template.html'},
    { name: 'renderer-stateConnector', template: 'canopsis/uibase/renderers/stateConnector/template.html'},
    { name: 'renderer-status', template: 'canopsis/uibase/renderers/status/template.html'},
    { name: 'renderer-subprocess', template: 'canopsis/uibase/renderers/subprocess/template.html'},
    { name: 'renderer-tags', template: 'canopsis/uibase/renderers/tags/template.html'},
    { name: 'renderer-timestamp', template: 'canopsis/uibase/renderers/timestamp/template.html'},
    { name: 'renderer-translator', template: 'canopsis/uibase/renderers/translator/template.html'},
    { name: 'renderer-eventtype', template: 'canopsis/uibase/renderers/eventtype/template.html'}
];

loader.loadWithTemplates(renderers);
