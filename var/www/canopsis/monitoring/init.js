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

loader.loadWithTemplates([
    { name:'weather', url:'canopsis/monitoring/widgets/weather/controller', template:'canopsis/monitoring/widgets/weather/template.html' },
    { name:'criticity', url:'canopsis/monitoring/helpers/criticity' },
    { name:'stateview', url:'canopsis/monitoring/helpers/stateview' },
    { name:'statusview', url:'canopsis/monitoring/helpers/statusview' },
    { name:'recordcanbeack', url:'canopsis/monitoring/helpers/recordcanbeack' },
    { name: 'sendevent', url: 'canopsis/monitoring/mixins/sendevent', classes: ['widget']},
    { name: 'recordinfopopup', url: 'canopsis/monitoring/mixins/recordinfopopup', classes: ['widget', 'events']},
    { name: 'history', url: 'canopsis/monitoring/mixins/history', classes: ['widget']},
    { name: 'eventnavigation', url: 'canopsis/monitoring/mixins/eventnavigation', classes: ['widget', 'events']},
    { name: 'eventhistory', url: 'canopsis/monitoring/mixins/eventhistory', classes: ['widget', 'events']},
    { name: 'infobutton', url: 'canopsis/monitoring/mixins/infobutton', classes: ["list"]}
]);
