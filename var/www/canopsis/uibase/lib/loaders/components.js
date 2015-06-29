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


var components = [
    { name: 'components/component-actionbutton', template: 'canopsis/uibase/components/actionbutton/template.html' },
    { name: 'components/component-actionfilter', template: 'canopsis/uibase/components/actionfilter/template.html' },
    { name: 'components/component-arrayeditor', template: 'canopsis/uibase/components/arrayeditor/template.html' },
    { name: 'components/component-arrayclassifiedcrecordselector', template: 'canopsis/uibase/components/arrayclassifiedcrecordselector/template.html' },
    { name: 'components/component-classifiedcrecordselector', template: 'canopsis/uibase/components/classifiedcrecordselector/template.html' },
    { name: 'components/component-classifieditemselector', template: 'canopsis/uibase/components/classifieditemselector/template.html' },
    { name: 'components/component-dateinterval', template: 'canopsis/uibase/components/dateinterval/template.html' },
    { name: 'components/component-dictclassifiedcrecordselector', template: 'canopsis/uibase/components/dictclassifiedcrecordselector/template.html' },
    { name: 'components/component-eventkey', template: 'canopsis/uibase/components/eventkey/template.html' },
    { name: 'components/component-expandableaddbutton', template: 'canopsis/uibase/components/expandableaddbutton/template.html' },
    { name: 'components/component-filterclause', template: 'canopsis/uibase/components/filterclause/template.html' },
    { name: 'components/component-listtree', template: 'canopsis/uibase/components/listtree/template.html' },
    { name: 'components/component-modelselect', template: 'canopsis/uibase/components/modelselect/template.html' },
    { name: 'components/component-searchbar', template: 'canopsis/uibase/components/searchbar/template.html' },
    { name: 'components/component-simpledicteditor', template: 'canopsis/uibase/components/simpledicteditor/template.html' },
    { name: 'components/component-stringclassifiedcrecordselector', template: 'canopsis/uibase/components/stringclassifiedcrecordselector/template.html' },
    { name: 'components/component-table', template: 'canopsis/uibase/components/table/template.html' },
    { name: 'components/component-templateselector', template: 'canopsis/uibase/components/templateselector/template.html' },
    { name: 'components/component-sessioneditor', template: 'canopsis/uibase/components/sessioneditor/template.html' },
    { name: 'components/component-mixinselector', template: 'canopsis/uibase/components/mixinselector/template.html' },
    { name: 'components/component-textwithsortoption', template: 'canopsis/uibase/components/textwithsortoption/template.html' },
    { name: 'components/component-typedvalue', template: 'canopsis/uibase/components/typedvalue/template.html' },
    { name: 'components/component-draggablebutton', template: 'canopsis/uibase/components/draggablebutton/template.html' },
    { name: 'components/component-rrule', template: 'canopsis/uibase/components/rrule/template.html' },
    { name: 'components/component-password', template: 'canopsis/uibase/components/password/template.html' },
    { name: 'components/component-timestamptooltiped', template: 'canopsis/uibase/components/timestamptooltiped/template.html' },
    { name: 'components/component-formulaeditor', template: 'canopsis/uibase/components/formulaeditor/template.html' },
    { name: 'components/component-propertiestopopup', template: 'canopsis/uibase/components/propertiestopopup/template.html' },
    { name: 'components/component-restobjectcombo', template: 'canopsis/uibase/components/restobjectcombo/template.html' },
    { name: 'components/component-contextselector', template: 'canopsis/uibase/components/contextselector/template.html' },
    { name: 'components/component-colpick', template: 'canopsis/uibase/components/colpick/template.html' },
    { name: 'components/component-slider', template: 'canopsis/uibase/components/slider/template.html' },
    { name: 'components/component-labelledlink', template: 'canopsis/uibase/components/labelledlink/template.hbs' },
    { name: 'components/component-linklist', template: 'canopsis/uibase/components/linklist/template.hbs' },
    { name: 'components/component-miniform', template: 'canopsis/uibase/components/miniform/template.hbs' },
    { name: 'components/component-miniformcontent', template: 'canopsis/uibase/components/miniformcontent/template.hbs' },
    { name: 'components/component-miniformheader', template: 'canopsis/uibase/components/miniformheader/template.hbs' },
    { name: 'components/component-miniformheaderbuttons', template: 'canopsis/uibase/components/miniformheaderbuttons/template.hbs' },
    { name: 'components/component-miniformtitle', template: 'canopsis/uibase/components/miniformtitle/template.hbs' },
    { name: 'components/component-elementidselectorwithoptions', template: 'canopsis/uibase/components/elementidselectorwithoptions/template.hbs' },
    { name: 'components/component-dropdownbutton', template: 'canopsis/uibase/components/dropdownbutton/template.html' },
    { name: 'components/component-dropdownbuttonheader', template: 'canopsis/uibase/components/dropdownbuttonheader/template.html' },
    { name: 'components/component-dropdownbuttoncontent', template: 'canopsis/uibase/components/dropdownbuttoncontent/template.html' },
    { name: 'components/component-dropdownbuttontitle', template: 'canopsis/uibase/components/dropdownbuttontitle/template.html' },
    { name: 'components/component-dropdownbuttonoverview', template: 'canopsis/uibase/components/dropdownbuttonoverview/template.html' }
];

loader.loadWithTemplates(components);
