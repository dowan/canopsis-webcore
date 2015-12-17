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

/** @module canopsis.frontend.charts */

require.config({
    paths: {
        'components/component-flotchart': 'canopsis/charts/src/components/flotchart/template',
        'components/component-serieitemeditor': 'canopsis/charts/src/components/serieitemeditor/template',
        'components/component-metricitemeditor': 'canopsis/charts/src/components/metricitemeditor/template',
        'components/component-metricselector': 'canopsis/charts/src/components/metricselector/template',
        'components/component-metricselector2': 'canopsis/charts/src/components/metricselector2/template',
        'components/component-selectedmetricheader': 'canopsis/charts/src/components/selectedmetricheader/template',
        'components/component-c3categorychart': 'canopsis/charts/src/components/c3categorychart/template',
        'components/component-c3js': 'canopsis/charts/src/components/c3js/template',
        'editor-metricitem': 'canopsis/charts/src/editors/editor-metricitem',
        'editor-serieitem': 'canopsis/charts/src/editors/editor-serieitem',
        'titlebarbutton-resetzoom': 'canopsis/charts/src/templates/titlebarbutton-resetzoom',
        'timegraph': 'canopsis/charts/src/widgets/timegraph/timegraph',
        'categorychart': 'canopsis/charts/src/widgets/categorychart/categorychart'
    }
});

define([
    'canopsis/charts/src/libwrappers/flotchart',
    'canopsis/charts/src/components/metricselector/component',
    'canopsis/charts/src/components/flotchart/component',
    'canopsis/charts/src/components/serieitemeditor/component',
    'canopsis/charts/src/components/metricitemeditor/component',
    'canopsis/charts/src/components/metricselector2/component',
    'canopsis/charts/src/components/selectedmetricheader/component',
    'canopsis/charts/src/components/c3categorychart/component',
    'canopsis/charts/src/components/c3js/component',
    'canopsis/charts/src/components/metricselector/component',
    'canopsis/charts/src/components/flotchart/component',
    'canopsis/charts/src/components/serieitemeditor/component',
    'canopsis/charts/src/components/metricitemeditor/component',
    'canopsis/charts/src/components/metricselector/component',
    'canopsis/charts/src/components/metricselector2/component',
    'canopsis/charts/src/components/selectedmetricheader/component',
    'canopsis/charts/src/components/c3categorychart/component',
    'canopsis/charts/src/components/c3js/component',
    'ehbs!editor-metricitem',
    'ehbs!editor-serieitem',
    'ehbs!titlebarbutton-resetzoom',
    'ehbs!timegraph',
    'ehbs!categorychart',
    'canopsis/charts/src/widgets/timegraph/controller',
    'canopsis/charts/src/widgets/categorychart/controller',
    'canopsis/charts/src/externals.conf'
], function () {});
