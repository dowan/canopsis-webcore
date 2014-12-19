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

var helpers = [
    { name:'ack', url:'app/lib/helpers/ack' },
    { name:'color', url:'app/lib/helpers/color' },
    { name:'colorview', url:'app/lib/helpers/colorview' },
    { name:'conf', url:'app/lib/helpers/conf' },
    { name:'criticity', url:'app/lib/helpers/criticity' },
    { name:'date-fromnow', url:'app/lib/helpers/date-fromnow' },
    { name:'duration', url:'app/lib/helpers/duration' },
    { name:'enableview', url:'app/lib/helpers/enableview' },
    { name:'format-date', url:'app/lib/helpers/format-date' },
    { name:'formview', url:'app/lib/helpers/formview' },
    { name:'getfield', url:'app/lib/helpers/getfield' },
    { name:'glyphicon', url:'app/lib/helpers/glyphicon' },
    { name:'group', url:'app/lib/helpers/group' },
    { name:'i18n', url:'app/lib/helpers/i18n' },
    { name:'ifcond', url:'app/lib/helpers/ifcond' },
    { name:'ifusercandisplayview', url:'app/lib/helpers/ifusercandisplayview' },
    { name:'json2html', url:'app/lib/helpers/json2html' },
    { name:'log', url:'app/lib/helpers/log' },
    { name:'logo', url:'app/lib/helpers/logo' },
    { name:'menu', url:'app/lib/helpers/menu' },
    { name:'partialslot', url:'app/lib/helpers/partialslot' },
    { name:'percent', url:'app/lib/helpers/percent' },
    { name:'renderwidget', url:'app/lib/helpers/renderwidget' },
    { name:'rights', url:'app/lib/helpers/rights' },
    { name:'sorticon', url:'app/lib/helpers/sorticon' },
    { name:'stateview', url:'app/lib/helpers/stateview' },
    { name:'statusview', url:'app/lib/helpers/statusview' },
    { name:'subprocess', url:'app/lib/helpers/subprocess' },
    { name:'timeSince', url:'app/lib/helpers/timeSince' },
    { name:'timestamp', url:'app/lib/helpers/timestamp' },
    { name:'validationtextarea', url:'app/lib/helpers/validationtextarea' },
    { name:'validationtextfield', url:'app/lib/helpers/validationtextfield' },
    { name:'widgetslot', url:'app/lib/helpers/widgetslot' },
    { name:'recordcanbeack', url:'app/lib/helpers/recordcanbeack' },
    { name:'interval2html', url:'app/lib/helpers/interval2html' },
    { name:'eventtype', url:'app/lib/helpers/eventtype' },
    { name:'ackremove', url:'app/lib/helpers/ackremove' }
];

loader.loadWithTemplates(helpers);
