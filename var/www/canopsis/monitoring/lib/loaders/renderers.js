/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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
    { name: 'renderer-snmpoid', template: 'canopsis/monitoring/renderers/snmpoid.hbs'},
    { name: 'renderer-ack', template: 'canopsis/monitoring/renderers/ack.html'},
    { name: 'renderer-crecord-type',template: 'canopsis/monitoring/renderers/crecord-type.html'},
    { name: 'renderer-criticity', template: 'canopsis/monitoring/renderers/criticity.html'},
    { name: 'renderer-eventselector', template: 'canopsis/monitoring/renderers/eventselector.html'},
    { name: 'renderer-state', template: 'canopsis/monitoring/renderers/state.html'},
    { name: 'renderer-stateConnector', template: 'canopsis/monitoring/renderers/stateConnector.html'},
    { name: 'renderer-status', template: 'canopsis/monitoring/renderers/status.html'},
    { name: 'renderer-eventtype', template: 'canopsis/monitoring/renderers/eventtype.html'},
    { name: 'renderer-eventtimestamp', template: 'canopsis/monitoring/renderers/eventtimestamp.html'},
    { name: 'renderer-snmpvars', template: 'canopsis/monitoring/renderers/snmpvars.hbs'}
];

loader.loadWithTemplates(renderers);

