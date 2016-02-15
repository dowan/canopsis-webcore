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

 require.config({
    paths: {
        'actionbutton-editurlfield': 'canopsis/monitoring/dist/templates/actionbutton-editurlfield',
        'components/component-ack': 'canopsis/monitoring/dist/templates/components/component-ack',
        'components/component-cfiltereditor': 'canopsis/monitoring/dist/templates/components/component-cfiltereditor',
        'components/component-eventselector': 'canopsis/monitoring/dist/templates/components/component-eventselector',
        'components/component-stateeditor': 'canopsis/monitoring/dist/templates/components/component-stateeditor',
        'components/component-statemapping': 'canopsis/monitoring/dist/templates/components/component-statemapping',
        'editor-metricselector': 'canopsis/monitoring/dist/templates/editor-metricselector',
        'renderer-ack': 'canopsis/monitoring/dist/templates/renderer-ack',
        'renderer-crecord-type': 'canopsis/monitoring/dist/templates/renderer-crecord-type',
        'renderer-criticity': 'canopsis/monitoring/dist/templates/renderer-criticity',
        'renderer-eventselector': 'canopsis/monitoring/dist/templates/renderer-eventselector',
        'renderer-eventtimestamp': 'canopsis/monitoring/dist/templates/renderer-eventtimestamp',
        'renderer-eventtype': 'canopsis/monitoring/dist/templates/renderer-eventtype',
        'renderer-state': 'canopsis/monitoring/dist/templates/renderer-state',
        'renderer-stateConnector': 'canopsis/monitoring/dist/templates/renderer-stateConnector',
        'renderer-status': 'canopsis/monitoring/dist/templates/renderer-status',
        'weather': 'canopsis/monitoring/dist/templates/weather',

    }
});

 define([
    'link!canopsis/monitoring/dist/brick.min.css',
    'ehbs!actionbutton-editurlfield',
    'ehbs!components/component-ack',
    'ehbs!components/component-cfiltereditor',
    'ehbs!components/component-eventselector',
    'ehbs!components/component-stateeditor',
    'ehbs!components/component-statemapping',
    'ehbs!editor-metricselector',
    'ehbs!renderer-ack',
    'ehbs!renderer-crecord-type',
    'ehbs!renderer-criticity',
    'ehbs!renderer-eventselector',
    'ehbs!renderer-eventtimestamp',
    'ehbs!renderer-eventtype',
    'ehbs!renderer-state',
    'ehbs!renderer-stateConnector',
    'ehbs!renderer-status',
    'ehbs!weather',
    'canopsis/monitoring/dist/brick.min'
], function () {});
