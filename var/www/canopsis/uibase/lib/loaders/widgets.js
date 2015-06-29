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
    { name:'text', template:'canopsis/uibase/widgets/text/template.html' },
    { name:'list', template:'canopsis/uibase/widgets/list/template.html' },
    { name:'widgetcontainer', template:'canopsis/uibase/widgets/widgetcontainer/template.html' },
    { name:'uiactionbutton', template:'canopsis/uibase/widgets/uiactionbutton/template.html' },
    { name:'uimaintabcollection', template:'canopsis/uibase/widgets/uimaintabcollection/template.html' },
    { name:'euewi', template:'canopsis/uibase/widgets/list/template.html', TEMPLATE: 'list' },
    { name:'topology', template:'canopsis/uibase/widgets/topology/template.html' }
    //USELESS ATM : { name:'uimaindropdown', url:'canopsis/uibase/widgets/uimaindropdown/controller', template:'canopsis/uibase/widgets/uimaindropdown/template.html' },
    //{ name:'multicrecordlist', url:'canopsis/uibase/widgets/multicrecordlist/controller', template:'canopsis/uibase/widgets/multicrecordlist/template.html' , TEMPLATE:'list'},
    //{ name:'wgraph', url:'canopsis/uibase/widgets/graph/controller', template:'canopsis/uibase/widgets/graph/template.html' },
];

loader.loadWithTemplates(widgets);
