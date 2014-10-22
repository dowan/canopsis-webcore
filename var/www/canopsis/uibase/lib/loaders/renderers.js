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
    { name: 'ack', url: 'canopsis/uibase/renderers/ack'},
    { name: 'actionfilter', url: 'canopsis/uibase/renderers/actionfilter'},
    { name: 'boolean', url: 'canopsis/uibase/renderers/boolean'},
    { name: 'cfilter', url: 'canopsis/uibase/renderers/cfilter'},
    { name: 'cfilterwithproperties', url: 'canopsis/uibase/renderers/cfilterwithproperties'},
    { name: 'color', url: 'canopsis/uibase/renderers/color'},
    { name: 'conf', url: 'canopsis/uibase/renderers/conf'},
    { name: 'crecord-type', url: 'canopsis/uibase/renderers/crecord-type'},
    { name: 'criticity', url: 'canopsis/uibase/renderers/criticity'},
    { name: 'eventselector', url: 'canopsis/uibase/renderers/eventselector'},
    { name: 'mail', url: 'canopsis/uibase/renderers/mail'},
    { name: 'object', url: 'canopsis/uibase/renderers/object'},
    { name: 'percent', url: 'canopsis/uibase/renderers/percent'},
    { name: 'rights', url: 'canopsis/uibase/renderers/rights'},
    { name: 'richtext', url: 'canopsis/uibase/renderers/richtext'},
    { name: 'source', url: 'canopsis/uibase/renderers/source'},
    { name: 'state', url: 'canopsis/uibase/renderers/state'},
    { name: 'stateConnector', url: 'canopsis/uibase/renderers/stateConnector'},
    { name: 'status', url: 'canopsis/uibase/renderers/status'},
    { name: 'subprocess', url: 'canopsis/uibase/renderers/subprocess'},
    { name: 'tags', url: 'canopsis/uibase/renderers/tags'},
    { name: 'timestamp', url: 'canopsis/uibase/renderers/timestamp'},
    { name: 'translator', url: 'canopsis/uibase/renderers/translator'},
    { name: 'eventtype', url: 'canopsis/uibase/renderers/eventtype'}
];

loader.loadRenderers(renderers);
