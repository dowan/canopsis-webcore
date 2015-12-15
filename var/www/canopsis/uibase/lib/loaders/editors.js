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
    { name: 'editor-error', template: 'canopsis/uibase/src/editors/error.html' },
    { name: 'editor-actionfilter', template: 'canopsis/uibase/src/editors/actionfilter.html' },
    { name: 'editor-array', template: 'canopsis/uibase/src/editors/array.html' },
    { name: 'editor-arrayclassifiedcrecordselector', template: 'canopsis/uibase/src/editors/arrayclassifiedcrecordselector.html' },
    { name: 'editor-boolean', template: 'canopsis/uibase/src/editors/boolean.html' },
    { name: 'editor-cfilter', template: 'canopsis/uibase/src/editors/cfilter.html' },
    { name: 'editor-cfilterwithproperties', template: 'canopsis/uibase/src/editors/cfilterwithproperties.html' },
    { name: 'editor-cmetric', template: 'canopsis/uibase/src/editors/cmetric.html' },
    { name: 'editor-color', template: 'canopsis/uibase/src/editors/color.html' },
    { name: 'editor-dateinterval', template: 'canopsis/uibase/src/editors/dateinterval.html' },
    { name: 'editor-defaultpropertyeditor', template: 'canopsis/uibase/src/editors/defaultpropertyeditor.html' },
    { name: 'editor-dictclassifiedcrecordselector', template: 'canopsis/uibase/src/editors/dictclassifiedcrecordselector.html' },
    { name: 'editor-duration', template: 'canopsis/uibase/src/editors/duration.html' },
    { name: 'editor-durationWithUnits', template: 'canopsis/uibase/src/editors/durationWithUnits.html' },
    { name: 'editor-eventselector', template: 'canopsis/uibase/src/editors/eventselector.html' },
    { name: 'editor-integer', template: 'canopsis/uibase/src/editors/integer.html' },
    { name: 'editor-mail', template: 'canopsis/uibase/src/editors/mail.html' },
    { name: 'editor-mixins', template: 'canopsis/uibase/src/editors/mixins.html' },
    { name: 'editor-modelselect', template: 'canopsis/uibase/src/editors/modelselect.html' },
    { name: 'editor-richtext', template: 'canopsis/uibase/src/editors/richtext.html' },
    { name: 'editor-separator', template: 'canopsis/uibase/src/editors/separator.html' },
    { name: 'editor-session', template: 'canopsis/uibase/src/editors/session.html' },
    { name: 'editor-simpledict', template: 'canopsis/uibase/src/editors/simpledict.html' },
    { name: 'editor-simplelist', template: 'canopsis/uibase/src/editors/simplelist.html' },
    { name: 'editor-sortable', template: 'canopsis/uibase/src/editors/sortable.html' },
    { name: 'editor-source', template: 'canopsis/uibase/src/editors/source.html' },
    { name: 'editor-state', template: 'canopsis/uibase/src/editors/state.html' },
    { name: 'editor-stringclassifiedcrecordselector', template: 'canopsis/uibase/src/editors/stringclassifiedcrecordselector.html' },
    { name: 'editor-stringpair', template: 'canopsis/uibase/src/editors/stringpair.html' },
    { name: 'editor-tags', template: 'canopsis/uibase/src/editors/tags.html' },
    { name: 'editor-templateselector', template: 'canopsis/uibase/src/editors/templateselector.html' },
    { name: 'editor-textarea', template: 'canopsis/uibase/src/editors/textarea.html' },
    { name: 'editor-timestamp', template: 'canopsis/uibase/src/editors/timestamp.html' },
    { name: 'editor-userpreference', template: 'canopsis/uibase/src/editors/userpreference.html' },
    { name: 'editor-json', template: 'canopsis/uibase/src/editors/json.html' },
    { name: 'editor-typedvalue', template: 'canopsis/uibase/src/editors/typedvalue.html' },
    { name: 'editor-rrule', template: 'canopsis/uibase/src/editors/rrule.html' },
    { name: 'editor-password', template: 'canopsis/uibase/src/editors/password.html' },
    { name: 'editor-passwordmd5', template: 'canopsis/uibase/src/editors/passwordmd5.html' },
    { name: 'editor-passwordsha1', template: 'canopsis/uibase/src/editors/passwordsha1.html' },
    { name: 'editor-eventkey', template: 'canopsis/uibase/src/editors/eventkey.html' },
    { name: 'editor-serieformula', template: 'canopsis/uibase/src/editors/serieformula.html' },
    { name: 'editor-widgetstree', template: 'canopsis/uibase/src/editors/widgetstree.html' },
    { name: 'editor-restobject', template: 'canopsis/uibase/src/editors/restobject.html' },
    { name: 'editor-contextselector', template: 'canopsis/uibase/src/editors/contextselector.html' },
    { name: 'editor-slider', template: 'canopsis/uibase/src/editors/slider.html' },
    { name: 'editor-labelledlink', template: 'canopsis/uibase/src/editors/labelledlink.hbs' },
    { name: 'editor-elementidselectorwithoptions', template: 'canopsis/uibase/src/editors/elementidselectorwithoptions.hbs' },
    { name: 'editor-labelandviewid', template: 'canopsis/uibase/src/editors/labelandviewid.hbs' }
];

loader.loadWithTemplates(editors);
