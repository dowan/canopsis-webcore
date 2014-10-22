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

var widgets = [
    { name:'list', url:'app/widgets/list' },
    { name:'canvas', url:'app/widgets/canvas' },
    { name:'verticalbox', url:'app/widgets/verticalbox' },
    { name:'horizontalbox', url:'app/widgets/horizontalbox' },
    { name:'lighthbox', url:'app/widgets/lighthbox' },
    { name:'tabmanager', url:'app/widgets/tabmanager' },
    { name:'uiactionbutton', url:'app/widgets/uiactionbutton' },
    { name:'uimaintabcollection', url:'app/widgets/uimaintabcollection' },
    { name:'uimaindropdown', url:'app/widgets/uimaindropdown' },
//    { name:'multicrecordlist', url:'app/widgets/multicrecordlist' , TEMPLATE:'list'},
    { name:'jobmanager', url:'app/widgets/jobmanager', TEMPLATE: 'list' },
    { name:'euewi', url:'app/widgets/euewi', TEMPLATE: 'list' },
    { name:'timegraph', url:'app/widgets/timegraph'},
    { name:'progressbar', url:'app/widgets/progressbar'},
    { name:'graph', url:'app/widgets/graph'},
  //  { name:'gauge', url:'app/widgets/gauge'}
];

loader.loadWidgets(widgets);
