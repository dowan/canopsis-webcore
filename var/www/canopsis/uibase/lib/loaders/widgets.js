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
    { name:'text', url:'canopsis/uibase/widgets/text/controller', template:'canopsis/uibase/widgets/text/template.html' },
    { name:'list', url:'canopsis/uibase/widgets/list/controller', template:'canopsis/uibase/widgets/list/template.html' },
    //USELESS ATM { name:'canvas', url:'canopsis/uibase/widgets/canvas/controller', template:'canopsis/uibase/widgets/canvas/template.html' },
    { name:'widgetcontainer', url:'canopsis/uibase/widgets/widgetcontainer/controller', template:'canopsis/uibase/widgets/widgetcontainer/template.html' },
    { name:'uiactionbutton', url:'canopsis/uibase/widgets/uiactionbutton/controller', template:'canopsis/uibase/widgets/uiactionbutton/template.html' },
    { name:'uimaintabcollection', url:'canopsis/uibase/widgets/uimaintabcollection/controller', template:'canopsis/uibase/widgets/uimaintabcollection/template.html' },
    //USELESS ATM : { name:'uimaindropdown', url:'canopsis/uibase/widgets/uimaindropdown/controller', template:'canopsis/uibase/widgets/uimaindropdown/template.html' },
    //{ name:'multicrecordlist', url:'canopsis/uibase/widgets/multicrecordlist/controller', template:'canopsis/uibase/widgets/multicrecordlist/template.html' , TEMPLATE:'list'},
    { name:'jobmanager', url:'canopsis/uibase/widgets/jobmanager/controller', template:'canopsis/uibase/widgets/list/template.html', TEMPLATE: 'list' },
    { name:'euewi', url:'canopsis/uibase/widgets/euewi/controller', template:'canopsis/uibase/widgets/list/template.html', TEMPLATE: 'list' },
    { name:'timegraph', url:'canopsis/uibase/widgets/timegraph/controller', template:'canopsis/uibase/widgets/timegraph/template.html'},
    //{ name:'progressbar', url:'canopsis/uibase/widgets/progressbar/controller', template:'canopsis/uibase/widgets/progressbar/template.html'},
    //{ name:'wgraph', url:'canopsis/uibase/widgets/graph/controller', template:'canopsis/uibase/widgets/graph/template.html' },
    { name:'topology', url:'canopsis/uibase/widgets/topology/controller', template:'canopsis/uibase/widgets/topology/template.html' }
    //{ name:'gauge', url:'canopsis/uibase/widgets/gauge'}
];

loader.loadWithTemplates(widgets);
