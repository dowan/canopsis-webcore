/*
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

var renderers = [
    { name: 'renderer-ack', template: 'canopsis/monitoring/src/renderers/ack.hbs'},
    { name: 'renderer-crecord-type',template: 'canopsis/monitoring/src/renderers/crecord-type.hbs'},
    { name: 'renderer-criticity', template: 'canopsis/monitoring/src/renderers/criticity.hbs'},
    { name: 'renderer-eventselector', template: 'canopsis/monitoring/src/renderers/eventselector.hbs'},
    { name: 'renderer-state', template: 'canopsis/monitoring/src/renderers/state.hbs'},
    { name: 'renderer-stateConnector', template: 'canopsis/monitoring/src/renderers/stateConnector.hbs'},
    { name: 'renderer-status', template: 'canopsis/monitoring/src/renderers/status.hbs'},
    { name: 'renderer-eventtype', template: 'canopsis/monitoring/src/renderers/eventtype.hbs'},
    { name: 'renderer-eventtimestamp', template: 'canopsis/monitoring/src/renderers/eventtimestamp.hbs'}
];

loader.loadWithTemplates(renderers);

