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
    { name: 'editor-error', template: 'canopsis/uibase/src/editors/error.hbs' },
    { name: 'editor-actionfilter', template: 'canopsis/uibase/src/editors/actionfilter.hbs' },
    { name: 'editor-array', template: 'canopsis/uibase/src/editors/array.hbs' },
    { name: 'editor-arrayclassifiedcrecordselector', template: 'canopsis/uibase/src/editors/arrayclassifiedcrecordselector.hbs' },
    { name: 'editor-boolean', template: 'canopsis/uibase/src/editors/boolean.hbs' },
    { name: 'editor-cfilter', template: 'canopsis/uibase/src/editors/cfilter.hbs' },
    { name: 'editor-cfilterwithproperties', template: 'canopsis/uibase/src/editors/cfilterwithproperties.hbs' },
    { name: 'editor-cmetric', template: 'canopsis/uibase/src/editors/cmetric.hbs' },
    { name: 'editor-color', template: 'canopsis/uibase/src/editors/color.hbs' },
    { name: 'editor-dateinterval', template: 'canopsis/uibase/src/editors/dateinterval.hbs' },
    { name: 'editor-defaultpropertyeditor', template: 'canopsis/uibase/src/editors/defaultpropertyeditor.hbs' },
    { name: 'editor-dictclassifiedcrecordselector', template: 'canopsis/uibase/src/editors/dictclassifiedcrecordselector.hbs' },
    { name: 'editor-duration', template: 'canopsis/uibase/src/editors/duration.hbs' },
    { name: 'editor-durationWithUnits', template: 'canopsis/uibase/src/editors/durationWithUnits.hbs' },
    { name: 'editor-eventselector', template: 'canopsis/uibase/src/editors/eventselector.hbs' },
    { name: 'editor-integer', template: 'canopsis/uibase/src/editors/integer.hbs' },
    { name: 'editor-mail', template: 'canopsis/uibase/src/editors/mail.hbs' },
    { name: 'editor-mixins', template: 'canopsis/uibase/src/editors/mixins.hbs' },
    { name: 'editor-modelselect', template: 'canopsis/uibase/src/editors/modelselect.hbs' },
    { name: 'editor-richtext', template: 'canopsis/uibase/src/editors/richtext.hbs' },
    { name: 'editor-separator', template: 'canopsis/uibase/src/editors/separator.hbs' },
    { name: 'editor-session', template: 'canopsis/uibase/src/editors/session.hbs' },
    { name: 'editor-simpledict', template: 'canopsis/uibase/src/editors/simpledict.hbs' },
    { name: 'editor-simplelist', template: 'canopsis/uibase/src/editors/simplelist.hbs' },
    { name: 'editor-sortable', template: 'canopsis/uibase/src/editors/sortable.hbs' },
    { name: 'editor-source', template: 'canopsis/uibase/src/editors/source.hbs' },
    { name: 'editor-state', template: 'canopsis/uibase/src/editors/state.hbs' },
    { name: 'editor-stringclassifiedcrecordselector', template: 'canopsis/uibase/src/editors/stringclassifiedcrecordselector.hbs' },
    { name: 'editor-stringpair', template: 'canopsis/uibase/src/editors/stringpair.hbs' },
    { name: 'editor-tags', template: 'canopsis/uibase/src/editors/tags.hbs' },
    { name: 'editor-templateselector', template: 'canopsis/uibase/src/editors/templateselector.hbs' },
    { name: 'editor-textarea', template: 'canopsis/uibase/src/editors/textarea.hbs' },
    { name: 'editor-timestamp', template: 'canopsis/uibase/src/editors/timestamp.hbs' },
    { name: 'editor-userpreference', template: 'canopsis/uibase/src/editors/userpreference.hbs' },
    { name: 'editor-json', template: 'canopsis/uibase/src/editors/json.hbs' },
    { name: 'editor-typedvalue', template: 'canopsis/uibase/src/editors/typedvalue.hbs' },
    { name: 'editor-rrule', template: 'canopsis/uibase/src/editors/rrule.hbs' },
    { name: 'editor-password', template: 'canopsis/uibase/src/editors/password.hbs' },
    { name: 'editor-passwordmd5', template: 'canopsis/uibase/src/editors/passwordmd5.hbs' },
    { name: 'editor-passwordsha1', template: 'canopsis/uibase/src/editors/passwordsha1.hbs' },
    { name: 'editor-eventkey', template: 'canopsis/uibase/src/editors/eventkey.hbs' },
    { name: 'editor-serieformula', template: 'canopsis/uibase/src/editors/serieformula.hbs' },
    { name: 'editor-widgetstree', template: 'canopsis/uibase/src/editors/widgetstree.hbs' },
    { name: 'editor-restobject', template: 'canopsis/uibase/src/editors/restobject.hbs' },
    { name: 'editor-contextselector', template: 'canopsis/uibase/src/editors/contextselector.hbs' },
    { name: 'editor-slider', template: 'canopsis/uibase/src/editors/slider.hbs' },
    { name: 'editor-labelledlink', template: 'canopsis/uibase/src/editors/labelledlink.hbs' },
    { name: 'editor-elementidselectorwithoptions', template: 'canopsis/uibase/src/editors/elementidselectorwithoptions.hbs' },
    { name: 'editor-labelandviewid', template: 'canopsis/uibase/src/editors/labelandviewid.hbs' }
];

loader.loadWithTemplates(editors);
