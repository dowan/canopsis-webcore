/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
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

var mixins = [
    { name: 'validation', url: 'app/mixins/validation', classes: ["action"]},
    { name: 'customfilterlist', url: 'app/mixins/customfilterlist', classes: ["list"]},
    { name: 'sortablearray', url: 'app/mixins/sortablearray', classes: ["list"]},
    { name: 'arraysearch', url: 'app/mixins/arraysearch', classes: ["list"]},
    { name: 'infobutton', url: 'app/mixins/infobutton', classes: ["list"]},
    { name: 'modelDict', url: 'app/mixins/modelDict', classes: ["action"]},
    { name: 'mixinArray', url: 'app/mixins/mixinArray', classes: ["test"]},
    { name: 'pagination', url: 'app/mixins/pagination', classes: ["widget"]},
    { name: 'tagsoptionfilter', url: 'app/mixins/tagsoptionfilter', classes: ["widget"]},
    { name: 'arraysearch', url: 'app/mixins/arraysearch', classes: ['widget']},
    { name: 'history', url: 'app/mixins/history', classes: ['widget']},
    { name: 'sendevent', url: 'app/mixins/sendevent', classes: ['widget']},
    { name: 'crud', url: 'app/mixins/crud', classes: ['widget']},
    { name: 'showviewbutton', url: 'app/mixins/showviewbutton', classes: ['widget', 'userviews']},
    { name: 'eventnavigation', url: 'app/mixins/eventnavigation', classes: ['widget', 'events']},
    { name: 'eventhistory', url: 'app/mixins/eventhistory', classes: ['widget', 'events']},
    { name: 'responsivelist', url: 'app/mixins/responsivelist', classes: ['widget', 'events']},
    { name: 'periodicrefresh', url: 'app/mixins/periodicrefresh', classes: ['widget', 'events']},
    { name: 'verticallayout', url: 'app/mixins/verticallayout', classes: ['widget', 'events']},
    { name: 'lightlayout', url: 'app/mixins/lightlayout', classes: ['widget', 'events']}
];

loader.loadWithTemplates(mixins);
