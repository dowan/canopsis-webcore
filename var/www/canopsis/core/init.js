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
        'components/component-editor': 'canopsis/core/dist/templates/components/component-editor',
        'components/component-renderer': 'canopsis/core/dist/templates/components/component-renderer',
        'components/component-wrapper': 'canopsis/core/dist/templates/components/component-wrapper',
        'confirmform': 'canopsis/core/dist/templates/confirmform',
        'modelform': 'canopsis/core/dist/templates/modelform',
        'viewtreeform': 'canopsis/core/dist/templates/viewtreeform',
        'widgetform': 'canopsis/core/dist/templates/widgetform',

    }
});

 define([
    'link!canopsis/core/dist/brick.min.css',
    'ehbs!components/component-editor',
    'ehbs!components/component-renderer',
    'ehbs!components/component-wrapper',
    'ehbs!confirmform',
    'ehbs!modelform',
    'ehbs!viewtreeform',
    'ehbs!widgetform',
    'canopsis/core/requirejs-modules/externals.conf',
    'canopsis/core/dist/brick.min'
], function () {});
