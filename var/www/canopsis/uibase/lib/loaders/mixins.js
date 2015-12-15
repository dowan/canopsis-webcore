/*
 * Copyright (c) 2015 'Capensis' [http://www.capensis.com]
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

var mixins = [
    { name: 'background', url: 'canopsis/uibase/src/mixins/background', classes: ['widget']},
    { name: 'eventconsumer', url: 'canopsis/uibase/src/mixins/eventconsumer', classes: ['widget']},
    { name: 'metricconsumer', url: 'canopsis/uibase/src/mixins/metricconsumer', classes: ['widget']},
    { name: 'metricfilterable', url: 'canopsis/uibase/src/mixins/metricfilterable', classes: ['widget']},
    { name: 'verticallayout', url: 'canopsis/uibase/src/mixins/verticallayout', classes: ['widget', 'events']},
    { name: 'horizontallayout', url: 'canopsis/uibase/src/mixins/horizontallayout', classes: ['widget', 'events']},
    { name: 'gridlayout', url: 'canopsis/uibase/src/mixins/gridlayout', classes: ['widget', 'events']},
    { name: 'lightlayout', url: 'canopsis/uibase/src/mixins/lightlayout', classes: ['widget', 'events']},
    { name: 'tablayout', url: 'canopsis/uibase/src/mixins/tablayout', classes: ['widget', 'events']},
    { name: 'pagination', url: 'canopsis/uibase/src/mixins/pagination', classes: ['widget']},
    { name: 'draggablecolumns', url: 'canopsis/uibase/src/mixins/draggablecolumns', classes: ['widget']},
    { name: 'minimizebutton', url: 'canopsis/uibase/src/mixins/minimizebutton', classes: ['widget']},
    { name: 'sortablearray', url: 'canopsis/uibase/src/mixins/sortablearray', classes: ['list']},
    { name: 'showviewbutton', url: 'canopsis/uibase/src/mixins/showviewbutton', classes: ['widget', 'userviews']},
    { name: 'responsivelist', url: 'canopsis/uibase/src/mixins/responsivelist', classes: ['widget', 'events']},
    { name: 'periodicrefresh', url: 'canopsis/uibase/src/mixins/periodicrefresh', classes: ['widget', 'events']},
    { name: 'customfilterlist', url: 'canopsis/uibase/src/mixins/customfilterlist', classes: ['list']},
    { name: 'arraysearch', url: 'canopsis/uibase/src/mixins/arraysearch', classes: ['list']},
    { name: 'crud', url: 'canopsis/uibase/src/mixins/crud', classes: ['widget']},
    { name: 'listlinedetail', url: 'canopsis/uibase/src/mixins/listlinedetail', classes: ['list']}
];

loader.loadWithTemplates(mixins);
