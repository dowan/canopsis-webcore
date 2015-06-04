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

var renderers = [
    { name: 'renderer-actionfilter', template: 'canopsis/uibase/renderers/actionfilter.html'},
    { name: 'renderer-boolean', template: 'canopsis/uibase/renderers/boolean.html'},
    { name: 'renderer-cfilter', template: 'canopsis/uibase/renderers/cfilter.html'},
    { name: 'renderer-cfilterwithproperties', template: 'canopsis/uibase/renderers/cfilterwithproperties.html'},
    { name: 'renderer-color', template: 'canopsis/uibase/renderers/color.html'},
    { name: 'renderer-conf', template: 'canopsis/uibase/renderers/conf.html'},
    { name: 'renderer-mail', template: 'canopsis/uibase/renderers/mail.html'},
    { name: 'renderer-object', template: 'canopsis/uibase/renderers/object.html'},
    { name: 'renderer-percent', template: 'canopsis/uibase/renderers/percent.html'},
    { name: 'renderer-richtext', template: 'canopsis/uibase/renderers/richtext.html'},
    { name: 'renderer-source', template: 'canopsis/uibase/renderers/source.html'},
    { name: 'renderer-subprocess', template: 'canopsis/uibase/renderers/subprocess.html'},
    { name: 'renderer-tags', template: 'canopsis/uibase/renderers/tags.html'},
    { name: 'renderer-timestamp', template: 'canopsis/uibase/renderers/timestamp.html'},
    { name: 'renderer-translator', template: 'canopsis/uibase/renderers/translator.html'},
    { name: 'renderer-recordinfopopup', template: 'canopsis/uibase/renderers/recordinfopopup.html'},
    { name: 'renderer-labelledlink', template: 'canopsis/uibase/renderers/labelledlink.hbs'}
];

loader.loadWithTemplates(renderers);
