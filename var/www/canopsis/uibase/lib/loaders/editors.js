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

var editors = [
    { name: 'editor-actionfilter', template: 'canopsis/uibase/editors/actionfilter/template.html' },
    { name: 'editor-array', template: 'canopsis/uibase/editors/array/template.html' },
    { name: 'editor-arrayclassifiedcrecordselector', template: 'canopsis/uibase/editors/arrayclassifiedcrecordselector/template.html' },
    { name: 'editor-attributepreset', template: 'canopsis/uibase/editors/attributepreset/template.html' },
    { name: 'editor-boolean', template: 'canopsis/uibase/editors/boolean/template.html' },
    { name: 'editor-cfilter', template: 'canopsis/uibase/editors/cfilter/template.html' },
    { name: 'editor-cfilter2', template: 'canopsis/uibase/editors/cfilter2/template.html' },
    { name: 'editor-cfilter3', template: 'canopsis/uibase/editors/cfilter3/template.html' },
    { name: 'editor-cfilterwithproperties', template: 'canopsis/uibase/editors/cfilterwithproperties/template.html' },
    { name: 'editor-cmetric', template: 'canopsis/uibase/editors/cmetric/template.html' },
    { name: 'editor-color', template: 'canopsis/uibase/editors/color/template.html' },
    { name: 'editor-criticity', template: 'canopsis/uibase/editors/criticity/template.html' },
    { name: 'editor-dateinterval', template: 'canopsis/uibase/editors/dateinterval/template.html' },
    { name: 'editor-defaultpropertyeditor', template: 'canopsis/uibase/editors/defaultpropertyeditor/template.html' },
    { name: 'editor-dictclassifiedcrecordselector', template: 'canopsis/uibase/editors/dictclassifiedcrecordselector/template.html' },
    { name: 'editor-duration', template: 'canopsis/uibase/editors/duration/template.html' },
    { name: 'editor-eventselector', template: 'canopsis/uibase/editors/eventselector/template.html' },
    { name: 'editor-integer', template: 'canopsis/uibase/editors/integer/template.html' },
    { name: 'editor-mail', template: 'canopsis/uibase/editors/mail/template.html' },
    { name: 'editor-mixinchooser', template: 'canopsis/uibase/editors/mixinchooser/template.html' },
    { name: 'editor-modelselect', template: 'canopsis/uibase/editors/modelselect/template.html' },
    { name: 'editor-richtext', template: 'canopsis/uibase/editors/richtext/template.html' },
    { name: 'editor-rights', template: 'canopsis/uibase/editors/rights/template.html' },
    { name: 'editor-separator', template: 'canopsis/uibase/editors/separator/template.html' },
    { name: 'editor-serieitem', template: 'canopsis/uibase/editors/serieitem/template.html' },
    { name: 'editor-session', template: 'canopsis/uibase/editors/session/template.html' },
    { name: 'editor-simpledict', template: 'canopsis/uibase/editors/simpledict/template.html' },
    { name: 'editor-simplelist', template: 'canopsis/uibase/editors/simplelist/template.html' },
    { name: 'editor-sortable', template: 'canopsis/uibase/editors/sortable/template.html' },
    { name: 'editor-source', template: 'canopsis/uibase/editors/source/template.html' },
    { name: 'editor-state', template: 'canopsis/uibase/editors/state/template.html' },
    { name: 'editor-stringclassifiedcrecordselector', template: 'canopsis/uibase/editors/stringclassifiedcrecordselector/template.html' },
    { name: 'editor-stringpair', template: 'canopsis/uibase/editors/stringpair/template.html' },
    { name: 'editor-tags', template: 'canopsis/uibase/editors/tags/template.html' },
    { name: 'editor-templateselector', template: 'canopsis/uibase/editors/templateselector/template.html' },
    { name: 'editor-textarea', template: 'canopsis/uibase/editors/textarea/template.html' },
    { name: 'editor-timeinterval', template: 'canopsis/uibase/editors/timeinterval/template.html' },
    { name: 'editor-timestamp', template: 'canopsis/uibase/editors/timestamp/template.html' },
    { name: 'editor-userpreference', template: 'canopsis/uibase/editors/userpreference/template.html' },
    { name: 'editor-typedvalue', template: 'canopsis/uibase/editors/typedvalue/template.html' },
    { name: 'editor-rrule', template: 'canopsis/uibase/editors/rrule/template.html' }
];

loader.loadWithTemplates(editors);
