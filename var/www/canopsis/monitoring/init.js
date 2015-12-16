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

/** @module canopsis.frontend.monitoring */

require.config({
    paths: {
        'components/component-cfiltereditor': 'canopsis/monitoring/src/components/cfiltereditor/template',
        'components/component-ack': 'canopsis/monitoring/src/components/ack/template',
        'components/component-stateeditor': 'canopsis/monitoring/src/components/stateeditor/template',
        'components/component-eventselector': 'canopsis/monitoring/src/components/eventselector/template',
        'components/component-statemapping': 'canopsis/monitoring/src/components/statemapping/template',
        'editor-metricselector': 'canopsis/monitoring/src/editors/metricselector',
        'renderer-ack': 'canopsis/monitoring/src/renderers/ack',
        'renderer-crecord-type': 'canopsis/monitoring/src/renderers/crecord-type',
        'renderer-criticity': 'canopsis/monitoring/src/renderers/criticity',
        'renderer-eventselector': 'canopsis/monitoring/src/renderers/eventselector',
        'renderer-state': 'canopsis/monitoring/src/renderers/state',
        'renderer-stateConnector': 'canopsis/monitoring/src/renderers/stateConnector',
        'renderer-status': 'canopsis/monitoring/src/renderers/status',
        'renderer-eventtype': 'canopsis/monitoring/src/renderers/eventtype',
        'renderer-eventtimestamp': 'canopsis/monitoring/src/renderers/eventtimestamp',
        'actionbutton-editurlfield': 'canopsis/monitoring/src/templates/actionbutton-editurlfield',
        'weather': 'canopsis/monitoring/src/widgets/weather/template'
    }
});

define([
    'ehbs!components/component-cfiltereditor',
    'ehbs!components/component-ack',
    'ehbs!components/component-stateeditor',
    'ehbs!components/component-eventselector',
    'ehbs!components/component-statemapping',
    'ehbs!editor-metricselector',
    'ehbs!renderer-ack',
    'ehbs!renderer-crecord-type',
    'ehbs!renderer-criticity',
    'ehbs!renderer-eventselector',
    'ehbs!renderer-state',
    'ehbs!renderer-stateConnector',
    'ehbs!renderer-status',
    'ehbs!renderer-eventtype',
    'ehbs!renderer-eventtimestamp',
    'ehbs!actionbutton-editurlfield',
    'ehbs!weather',
    'canopsis/monitoring/src/widgets/weather/controller',
    'canopsis/monitoring/src/helpers/criticity',
    'canopsis/monitoring/src/helpers/stateview',
    'canopsis/monitoring/src/helpers/statusview',
    'canopsis/monitoring/src/helpers/recordcanbeack',
    'canopsis/monitoring/src/mixins/sendevent',
    'canopsis/monitoring/src/mixins/recordinfopopup',
    'canopsis/monitoring/src/mixins/history',
    'canopsis/monitoring/src/mixins/eventnavigation',
    'canopsis/monitoring/src/mixins/eventhistory',
    'canopsis/monitoring/src/mixins/infobutton',
    'canopsis/monitoring/src/mixins/editurlfield',
    'canopsis/monitoring/src/components/cfiltereditor/component',
    'canopsis/monitoring/src/components/ack/component',
    'canopsis/monitoring/src/components/stateeditor/component',
    'canopsis/monitoring/src/components/eventselector/component',
    'canopsis/monitoring/src/components/statemapping/component'
], function () {

});
