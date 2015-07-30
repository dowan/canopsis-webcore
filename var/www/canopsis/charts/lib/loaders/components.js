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


var components = [
    { name: 'components/component-metricselector', url: 'canopsis/charts/components/metricselector/component', template: 'canopsis/charts/components/metricselector/template.html' },
    { name: 'components/component-flotchart', url: 'canopsis/charts/components/flotchart/component', template: 'canopsis/charts/components/flotchart/template.html' },
    { name: 'components/component-serieitemeditor', url: 'canopsis/charts/components/serieitemeditor/component', template: 'canopsis/charts/components/serieitemeditor/template.html' },
    { name: 'components/component-metricitemeditor', url: 'canopsis/charts/components/metricitemeditor/component', template: 'canopsis/charts/components/metricitemeditor/template.html' },
    { name: 'components/component-metricselector', url: 'canopsis/charts/components/metricselector/component', template: 'canopsis/charts/components/metricselector/template.html' },
    { name: 'components/component-metricselector2', url: 'canopsis/charts/components/metricselector2/component', template: 'canopsis/charts/components/metricselector2/template.hbs' },
    { name: 'components/component-selectedmetricheader', url: 'canopsis/charts/components/selectedmetricheader/component', template: 'canopsis/charts/components/selectedmetricheader/template.hbs' },
    { name: 'components/component-c3categorychart', url: 'canopsis/charts/components/c3categorychart/component', template: 'canopsis/charts/components/c3categorychart/template.hbs' }
];

loader.loadWithTemplates(components);

