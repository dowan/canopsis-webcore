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

var components = [
    { name: 'components/component-metricselector', url: 'canopsis/charts/src/components/metricselector/component', template: 'canopsis/charts/src/components/metricselector/template.html' },
    { name: 'components/component-flotchart', url: 'canopsis/charts/src/components/flotchart/component', template: 'canopsis/charts/src/components/flotchart/template.html' },
    { name: 'components/component-serieitemeditor', url: 'canopsis/charts/src/components/serieitemeditor/component', template: 'canopsis/charts/src/components/serieitemeditor/template.html' },
    { name: 'components/component-metricitemeditor', url: 'canopsis/charts/src/components/metricitemeditor/component', template: 'canopsis/charts/src/components/metricitemeditor/template.html' },
    { name: 'components/component-metricselector', url: 'canopsis/charts/src/components/metricselector/component', template: 'canopsis/charts/src/components/metricselector/template.html' },
    { name: 'components/component-metricselector2', url: 'canopsis/charts/src/components/metricselector2/component', template: 'canopsis/charts/src/components/metricselector2/template.hbs' },
    { name: 'components/component-selectedmetricheader', url: 'canopsis/charts/src/components/selectedmetricheader/component', template: 'canopsis/charts/src/components/selectedmetricheader/template.hbs' },
    { name: 'components/component-c3categorychart', url: 'canopsis/charts/src/components/c3categorychart/component', template: 'canopsis/charts/src/components/c3categorychart/template.hbs' },
    { name: 'components/component-c3js', url: 'canopsis/charts/src/components/c3js/component', template: 'canopsis/charts/src/components/c3js/template.hbs' }
];

loader.loadWithTemplates(components);

