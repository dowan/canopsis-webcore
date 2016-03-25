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
        'application': 'canopsis/canopsis-ui/dist/templates/application',
        'components/component-rrule': 'canopsis/canopsis-ui/dist/templates/components/component-rrule',
        'components/component-rruleeditor': 'canopsis/canopsis-ui/dist/templates/components/component-rruleeditor',
        'editor-rrule': 'canopsis/canopsis-ui/dist/templates/editor-rrule',
        'editor-rruleeditor': 'canopsis/canopsis-ui/dist/templates/editor-rruleeditor',
        'jobform': 'canopsis/canopsis-ui/dist/templates/jobform',
        'renderer-rrule': 'canopsis/canopsis-ui/dist/templates/renderer-rrule',

    }
});

 define([
    'link!canopsis/canopsis-ui/dist/brick.min.css',
    'ehbs!application',
    'ehbs!components/component-rrule',
    'ehbs!components/component-rruleeditor',
    'ehbs!editor-rrule',
    'ehbs!editor-rruleeditor',
    'ehbs!jobform',
    'ehbs!renderer-rrule',
    'canopsis/canopsis-ui/requirejs-modules/externals.conf',
    'canopsis/canopsis-ui/dist/brick.min'
], function () {});
