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
    { name: 'validation', classes: ["action"]},
    { name: 'modelDict', classes: ["action"]},
    { name: 'mixinArray', classes: ["test"]},
    { name: 'pagination', classes: ["widget"]},
    { name: 'tagsoptionfilter', classes: ["widget"]},
    { name: 'arraysearch', classes: ['widget']},
    { name: 'history', classes: ['widget']},
    { name: 'sendevent', classes: ['widget']},
    { name: 'crud', classes: ['widget']},
    { name: 'showviewbutton', classes: ['widget', 'userviews']}
];

loader.loadMixins(mixins);
