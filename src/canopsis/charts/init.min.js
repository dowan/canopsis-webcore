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
        'categorychart': 'canopsis/charts/dist/templates/categorychart',
        'components/component-c3categorychart': 'canopsis/charts/dist/templates/components/component-c3categorychart',
        'components/component-c3js': 'canopsis/charts/dist/templates/components/component-c3js',
        'components/component-flotchart': 'canopsis/charts/dist/templates/components/component-flotchart',
        'components/component-metricitemeditor': 'canopsis/charts/dist/templates/components/component-metricitemeditor',
        'components/component-metricselector': 'canopsis/charts/dist/templates/components/component-metricselector',
        'components/component-metricselector2': 'canopsis/charts/dist/templates/components/component-metricselector2',
        'components/component-selectedmetricheader': 'canopsis/charts/dist/templates/components/component-selectedmetricheader',
        'components/component-serieitemeditor': 'canopsis/charts/dist/templates/components/component-serieitemeditor',
        'editor-metricitem': 'canopsis/charts/dist/templates/editor-metricitem',
        'editor-metricselector2': 'canopsis/charts/dist/templates/editor-metricselector2',
        'editor-serieitem': 'canopsis/charts/dist/templates/editor-serieitem',
        'timegraph': 'canopsis/charts/dist/templates/timegraph',
        'titlebarbutton-resetzoom': 'canopsis/charts/dist/templates/titlebarbutton-resetzoom',

    }
});

 define([
    'link!canopsis/charts/dist/brick.min.css',
    'ehbs!categorychart',
    'ehbs!components/component-c3categorychart',
    'ehbs!components/component-c3js',
    'ehbs!components/component-flotchart',
    'ehbs!components/component-metricitemeditor',
    'ehbs!components/component-metricselector',
    'ehbs!components/component-metricselector2',
    'ehbs!components/component-selectedmetricheader',
    'ehbs!components/component-serieitemeditor',
    'ehbs!editor-metricitem',
    'ehbs!editor-metricselector2',
    'ehbs!editor-serieitem',
    'ehbs!timegraph',
    'ehbs!titlebarbutton-resetzoom',
    'canopsis/charts/requirejs-modules/externals.conf',
    'canopsis/charts/dist/brick.min'
], function () {});
