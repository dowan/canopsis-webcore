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

loader.loadWidgets([
    { name:'text', url:'canopsis/uibase/widgets/text' },
    { name:'list', url:'canopsis/uibase/widgets/list' },
    { name:'canvas', url:'canopsis/uibase/widgets/canvas' },
    { name:'verticalbox', url:'canopsis/uibase/widgets/verticalbox' },
    { name:'horizontalbox', url:'canopsis/uibase/widgets/horizontalbox' },
    { name:'lighthbox', url:'canopsis/uibase/widgets/lighthbox' },
    { name:'tabmanager', url:'canopsis/uibase/widgets/tabmanager' },
    { name:'uiactionbutton', url:'canopsis/uibase/widgets/uiactionbutton' },
    { name:'uimaintabcollection', url:'canopsis/uibase/widgets/uimaintabcollection' },
    { name:'uimaindropdown', url:'canopsis/uibase/widgets/uimaindropdown' },
    //{ name:'multicrecordlist', url:'canopsis/uibase/widgets/multicrecordlist' , TEMPLATE:'list'},
    { name:'jobmanager', url:'canopsis/uibase/widgets/jobmanager', TEMPLATE: 'list' },
    { name:'euewi', url:'canopsis/uibase/widgets/euewi', TEMPLATE: 'list' },
    { name:'timegraph', url:'canopsis/uibase/widgets/timegraph'},
    { name:'progressbar', url:'canopsis/uibase/widgets/progressbar'},
    { name:'graph', url:'canopsis/uibase/widgets/graph'}
    //{ name:'gauge', url:'canopsis/uibase/widgets/gauge'}
]);
