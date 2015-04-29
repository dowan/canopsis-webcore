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
    { name: 'components/component-rightsselector', url: 'canopsis/canopsis-rights/components/rightsselector/component', template: 'canopsis/canopsis-rights/components/rightsselector/template.hbs' },
    { name: 'components/component-rights-action', url: 'canopsis/canopsis-rights/components/rights-action/component', template: 'canopsis/canopsis-rights/components/rights-action/template.hbs' },
    { name: 'components/component-rightsrenderer', url: 'canopsis/canopsis-rights/components/rightsrenderer/component', template: 'canopsis/canopsis-rights/components/rightsrenderer/template.hbs' }
];

loader.loadWithTemplates(components);
