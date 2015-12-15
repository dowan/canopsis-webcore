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

var widgets = [
    { name:'text', url:'canopsis/uibase/src/widgets/text/controller', template:'canopsis/uibase/src/widgets/text/template.hbs' },
    { name:'list', url:'canopsis/uibase/src/widgets/list/controller', template:'canopsis/uibase/src/widgets/list/template.hbs' },
    { name:'widgetcontainer', url:'canopsis/uibase/src/widgets/widgetcontainer/controller', template:'canopsis/uibase/src/widgets/widgetcontainer/template.hbs' },
    { name:'uiactionbutton', url:'canopsis/uibase/src/widgets/uiactionbutton/controller', template:'canopsis/uibase/src/widgets/uiactionbutton/template.hbs' },
    { name:'uimaintabcollection', url:'canopsis/uibase/src/widgets/uimaintabcollection/controller', template:'canopsis/uibase/src/widgets/uimaintabcollection/template.hbs' },
    { name:'topology', url:'canopsis/uibase/src/widgets/topology/controller', template:'canopsis/uibase/src/widgets/topology/template.hbs' }
];

loader.loadWithTemplates(widgets);
