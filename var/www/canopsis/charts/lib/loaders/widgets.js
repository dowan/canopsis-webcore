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

var widgets = [
    { name:'timegraph', url:'canopsis/charts/widgets/timegraph/controller', template:'canopsis/charts/widgets/timegraph/template.html'},
    { name:'categorychart', url:'canopsis/charts/widgets/categorychart/controller', template:'canopsis/charts/widgets/categorychart/template.hbs'},
    { name:'timechart', url:'canopsis/charts/widgets/timechart/controller', template:'canopsis/charts/widgets/timechart/template.hbs'}
];

loader.loadWithTemplates(widgets);
