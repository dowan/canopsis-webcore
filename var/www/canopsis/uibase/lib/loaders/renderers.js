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
    { name: 'renderer-actionfilter', template: 'canopsis/uibase/src/renderers/actionfilter.hbs'},
    { name: 'renderer-boolean', template: 'canopsis/uibase/src/renderers/boolean.hbs'},
    { name: 'renderer-cfilter', template: 'canopsis/uibase/src/renderers/cfilter.hbs'},
    { name: 'renderer-cfilterwithproperties', template: 'canopsis/uibase/src/renderers/cfilterwithproperties.hbs'},
    { name: 'renderer-color', template: 'canopsis/uibase/src/renderers/color.hbs'},
    { name: 'renderer-conf', template: 'canopsis/uibase/src/renderers/conf.hbs'},
    { name: 'renderer-mail', template: 'canopsis/uibase/src/renderers/mail.hbs'},
    { name: 'renderer-object', template: 'canopsis/uibase/src/renderers/object.hbs'},
    { name: 'renderer-percent', template: 'canopsis/uibase/src/renderers/percent.hbs'},
    { name: 'renderer-richtext', template: 'canopsis/uibase/src/renderers/richtext.hbs'},
    { name: 'renderer-source', template: 'canopsis/uibase/src/renderers/source.hbs'},
    { name: 'renderer-subprocess', template: 'canopsis/uibase/src/renderers/subprocess.hbs'},
    { name: 'renderer-tags', template: 'canopsis/uibase/src/renderers/tags.hbs'},
    { name: 'renderer-timestamp', template: 'canopsis/uibase/src/renderers/timestamp.hbs'},
    { name: 'renderer-translator', template: 'canopsis/uibase/src/renderers/translator.hbs'},
    { name: 'renderer-recordinfopopup', template: 'canopsis/uibase/src/renderers/recordinfopopup.hbs'},
    { name: 'renderer-labelledlink', template: 'canopsis/uibase/src/renderers/labelledlink.hbs'}
];

loader.loadWithTemplates(renderers);
