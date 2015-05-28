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

define([], function () {

    /*
    * Here is the canopsis UI main configuration file.
    * It is possible to add properies and values that are reachable
    * from the whole application through the namespace Canopsis.conf.PROPERTY
    */
    var canopsisConfiguration = {
        DEBUG: true,
        VERBOSE: 1,
        showPartialslots: false,
        DISPLAY_SCHEMA_MANAGER: true,
        REFRESH_ALL_WIDGETS: true,
        TRANSLATE: true,
        SHOW_TRANSLATIONS: false,
        TITLE: 'Canopsis Sakura',
    };

    return canopsisConfiguration;
});
