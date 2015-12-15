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

var renderers = [
    { name: 'renderer-actionfilter', template: 'canopsis/uibase/src/renderers/actionfilter.html'},
    { name: 'renderer-boolean', template: 'canopsis/uibase/src/renderers/boolean.html'},
    { name: 'renderer-cfilter', template: 'canopsis/uibase/src/renderers/cfilter.html'},
    { name: 'renderer-cfilterwithproperties', template: 'canopsis/uibase/src/renderers/cfilterwithproperties.html'},
    { name: 'renderer-color', template: 'canopsis/uibase/src/renderers/color.html'},
    { name: 'renderer-conf', template: 'canopsis/uibase/src/renderers/conf.html'},
    { name: 'renderer-mail', template: 'canopsis/uibase/src/renderers/mail.html'},
    { name: 'renderer-object', template: 'canopsis/uibase/src/renderers/object.html'},
    { name: 'renderer-percent', template: 'canopsis/uibase/src/renderers/percent.html'},
    { name: 'renderer-richtext', template: 'canopsis/uibase/src/renderers/richtext.html'},
    { name: 'renderer-source', template: 'canopsis/uibase/src/renderers/source.html'},
    { name: 'renderer-subprocess', template: 'canopsis/uibase/src/renderers/subprocess.html'},
    { name: 'renderer-tags', template: 'canopsis/uibase/src/renderers/tags.html'},
    { name: 'renderer-timestamp', template: 'canopsis/uibase/src/renderers/timestamp.html'},
    { name: 'renderer-translator', template: 'canopsis/uibase/src/renderers/translator.html'},
    { name: 'renderer-recordinfopopup', template: 'canopsis/uibase/src/renderers/recordinfopopup.html'},
    { name: 'renderer-labelledlink', template: 'canopsis/uibase/src/renderers/labelledlink.hbs'}
];

loader.loadWithTemplates(renderers);
