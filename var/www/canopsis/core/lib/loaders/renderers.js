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
    { name: 'ack', url: 'app/renderers/ack'},
    { name: 'actionfilter', url: 'app/renderers/actionfilter'},
    { name: 'boolean', url: 'app/renderers/boolean'},
    { name: 'cfilter', url: 'app/renderers/cfilter'},
    { name: 'cfilterwithproperties', url: 'app/renderers/cfilterwithproperties'},
    { name: 'color', url: 'app/renderers/color'},
    { name: 'conf', url: 'app/renderers/conf'},
    { name: 'crecord-type', url: 'app/renderers/crecord-type'},
    { name: 'criticity', url: 'app/renderers/criticity'},
    { name: 'eventselector', url: 'app/renderers/eventselector'},
    { name: 'mail', url: 'app/renderers/mail'},
    { name: 'object', url: 'app/renderers/object'},
    { name: 'percent', url: 'app/renderers/percent'},
    { name: 'rights', url: 'app/renderers/rights'},
    { name: 'richtext', url: 'app/renderers/richtext'},
    { name: 'source', url: 'app/renderers/source'},
    { name: 'state', url: 'app/renderers/state'},
    { name: 'stateConnector', url: 'app/renderers/stateConnector'},
    { name: 'status', url: 'app/renderers/status'},
    { name: 'subprocess', url: 'app/renderers/subprocess'},
    { name: 'tags', url: 'app/renderers/tags'},
    { name: 'timestamp', url: 'app/renderers/timestamp'},
    { name: 'translator', url: 'app/renderers/translator'},
    { name: 'eventtype', url: 'app/renderers/eventtype'}
];


loader.loadRenderers(renderers);
