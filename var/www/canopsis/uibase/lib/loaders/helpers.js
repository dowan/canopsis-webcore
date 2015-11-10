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

var helpers = [
    { name:'eventtype', url:'canopsis/uibase/helpers/eventtype' },
    { name:'sorticon', url:'canopsis/uibase/helpers/sorticon' },
    { name:'percent', url:'canopsis/uibase/helpers/percent' },
    { name:'timestamp', url:'canopsis/uibase/helpers/timestamp' },
    { name:'timeSince', url:'canopsis/uibase/helpers/timeSince' },
    { name:'logo', url:'canopsis/uibase/helpers/logo' },
    { name:'glyphicon', url:'canopsis/uibase/helpers/glyphicon' },
    { name:'color', url:'canopsis/uibase/helpers/color' },
    { name:'humanreadable', url:'canopsis/uibase/helpers/humanreadable' },
    { name:'eachkey', url:'canopsis/uibase/helpers/eachkey' },
    { name:'rights', url:'canopsis/uibase/helpers/rights' },
    { name:'json2html', url:'canopsis/uibase/helpers/json2html' },
    { name:'interval2html', url:'canopsis/uibase/helpers/interval2html' }
];

loader.loadWithTemplates(helpers);
