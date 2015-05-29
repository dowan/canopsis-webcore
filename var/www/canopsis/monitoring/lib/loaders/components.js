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
    { name: 'components/component-cfiltereditor', url: 'canopsis/monitoring/components/cfiltereditor/component', template: 'canopsis/monitoring/components/cfiltereditor/template.html' },
    { name: 'components/component-ack', url: 'canopsis/monitoring/components/ack/component', template: 'canopsis/monitoring/components/ack/template.html' },
    { name: 'components/component-stateeditor', url: 'canopsis/monitoring/components/stateeditor/component', template: 'canopsis/monitoring/components/stateeditor/template.html' },
    { name: 'components/component-eventselector', url: 'canopsis/monitoring/components/eventselector/component', template: 'canopsis/monitoring/components/eventselector/template.html' }

];

loader.loadWithTemplates(components);

