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

var editors = [
    { name: 'editor-error', template: 'canopsis/uibase/editors/error.html' },
    { name: 'editor-actionfilter', template: 'canopsis/uibase/editors/actionfilter.html' },
    { name: 'editor-array', template: 'canopsis/uibase/editors/array.html' },
    { name: 'editor-arrayclassifiedcrecordselector', template: 'canopsis/uibase/editors/arrayclassifiedcrecordselector.html' },
    { name: 'editor-boolean', template: 'canopsis/uibase/editors/boolean.html' },
    { name: 'editor-cfilter', template: 'canopsis/uibase/editors/cfilter.html' },
    { name: 'editor-cfilterwithproperties', template: 'canopsis/uibase/editors/cfilterwithproperties.html' },
    { name: 'editor-cmetric', template: 'canopsis/uibase/editors/cmetric.html' },
    { name: 'editor-color', template: 'canopsis/uibase/editors/color.html' },
    { name: 'editor-dateinterval', template: 'canopsis/uibase/editors/dateinterval.html' },
    { name: 'editor-defaultpropertyeditor', template: 'canopsis/uibase/editors/defaultpropertyeditor.html' },
    { name: 'editor-dictclassifiedcrecordselector', template: 'canopsis/uibase/editors/dictclassifiedcrecordselector.html' },
    { name: 'editor-duration', template: 'canopsis/uibase/editors/duration.html' },
    { name: 'editor-durationWithUnits', template: 'canopsis/uibase/editors/durationWithUnits.html' },
    { name: 'editor-eventselector', template: 'canopsis/uibase/editors/eventselector.html' },
    { name: 'editor-integer', template: 'canopsis/uibase/editors/integer.html' },
    { name: 'editor-mail', template: 'canopsis/uibase/editors/mail.html' },
    { name: 'editor-mixins', template: 'canopsis/uibase/editors/mixins.html' },
    { name: 'editor-modelselect', template: 'canopsis/uibase/editors/modelselect.html' },
    { name: 'editor-richtext', template: 'canopsis/uibase/editors/richtext.html' },
    { name: 'editor-separator', template: 'canopsis/uibase/editors/separator.html' },
    { name: 'editor-session', template: 'canopsis/uibase/editors/session.html' },
    { name: 'editor-simpledict', template: 'canopsis/uibase/editors/simpledict.html' },
    { name: 'editor-simplelist', template: 'canopsis/uibase/editors/simplelist.html' },
    { name: 'editor-sortable', template: 'canopsis/uibase/editors/sortable.html' },
    { name: 'editor-source', template: 'canopsis/uibase/editors/source.html' },
    { name: 'editor-state', template: 'canopsis/uibase/editors/state.html' },
    { name: 'editor-stringclassifiedcrecordselector', template: 'canopsis/uibase/editors/stringclassifiedcrecordselector.html' },
    { name: 'editor-stringpair', template: 'canopsis/uibase/editors/stringpair.html' },
    { name: 'editor-tags', template: 'canopsis/uibase/editors/tags.html' },
    { name: 'editor-templateselector', template: 'canopsis/uibase/editors/templateselector.html' },
    { name: 'editor-textarea', template: 'canopsis/uibase/editors/textarea.html' },
    { name: 'editor-timestamp', template: 'canopsis/uibase/editors/timestamp.html' },
    { name: 'editor-userpreference', template: 'canopsis/uibase/editors/userpreference.html' },
    { name: 'editor-json', template: 'canopsis/uibase/editors/json.html' },
    { name: 'editor-typedvalue', template: 'canopsis/uibase/editors/typedvalue.html' },
    { name: 'editor-rrule', template: 'canopsis/uibase/editors/rrule.html' },
    { name: 'editor-password', template: 'canopsis/uibase/editors/password.html' },
    { name: 'editor-passwordmd5', template: 'canopsis/uibase/editors/passwordmd5.html' },
    { name: 'editor-passwordsha1', template: 'canopsis/uibase/editors/passwordsha1.html' },
    { name: 'editor-eventkey', template: 'canopsis/uibase/editors/eventkey.html' },
    { name: 'editor-serieformula', template: 'canopsis/uibase/editors/serieformula.html' },
    { name: 'editor-widgetstree', template: 'canopsis/uibase/editors/widgetstree.html' },
    { name: 'editor-restobject', template: 'canopsis/uibase/editors/restobject.html' },
    { name: 'editor-contextselector', template: 'canopsis/uibase/editors/contextselector.html' },
    { name: 'editor-slider', template: 'canopsis/uibase/editors/slider.html' },
    { name: 'editor-labelledlink', template: 'canopsis/uibase/editors/labelledlink.hbs' },
    { name: 'editor-elementidselectorwithoptions', template: 'canopsis/uibase/editors/elementidselectorwithoptions.hbs' }
];

loader.loadWithTemplates(editors);
