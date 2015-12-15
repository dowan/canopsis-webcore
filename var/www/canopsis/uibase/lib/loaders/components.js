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
    { name: 'components/component-actionbutton', url: 'canopsis/uibase/src/components/actionbutton/component', template: 'canopsis/uibase/src/components/actionbutton/template.html' },
    { name: 'components/component-actionfilter', url: 'canopsis/uibase/src/components/actionfilter/component', template: 'canopsis/uibase/src/components/actionfilter/template.html' },
    { name: 'components/component-arrayeditor', url: 'canopsis/uibase/src/components/arrayeditor/component', template: 'canopsis/uibase/src/components/arrayeditor/template.html' },
    { name: 'components/component-arrayclassifiedcrecordselector', url: 'canopsis/uibase/src/components/arrayclassifiedcrecordselector/component', template: 'canopsis/uibase/src/components/arrayclassifiedcrecordselector/template.html' },
    { name: 'components/component-classifiedcrecordselector', url: 'canopsis/uibase/src/components/classifiedcrecordselector/component', template: 'canopsis/uibase/src/components/classifiedcrecordselector/template.html' },
    { name: 'components/component-classifieditemselector', url: 'canopsis/uibase/src/components/classifieditemselector/component', template: 'canopsis/uibase/src/components/classifieditemselector/template.html' },
    { name: 'components/component-dateinterval', url: 'canopsis/uibase/src/components/dateinterval/component', template: 'canopsis/uibase/src/components/dateinterval/template.html' },
    { name: 'components/component-dictclassifiedcrecordselector', url: 'canopsis/uibase/src/components/dictclassifiedcrecordselector/component', template: 'canopsis/uibase/src/components/dictclassifiedcrecordselector/template.html' },
    { name: 'components/component-eventkey', url: 'canopsis/uibase/src/components/eventkey/component', template: 'canopsis/uibase/src/components/eventkey/template.html' },
    { name: 'components/component-expandableaddbutton', url: 'canopsis/uibase/src/components/expandableaddbutton/component', template: 'canopsis/uibase/src/components/expandableaddbutton/template.html' },
    { name: 'components/component-filefield', url: 'canopsis/uibase/src/components/filefield/component', template: 'canopsis/uibase/src/components/filefield/template.hbs' },
    { name: 'components/component-filterclause', url: 'canopsis/uibase/src/components/filterclause/component', template: 'canopsis/uibase/src/components/filterclause/template.html' },
    { name: 'components/component-listtree', url: 'canopsis/uibase/src/components/listtree/component', template: 'canopsis/uibase/src/components/listtree/template.html' },
    { name: 'components/component-modelselect', url: 'canopsis/uibase/src/components/modelselect/component', template: 'canopsis/uibase/src/components/modelselect/template.html' },
    { name: 'components/component-searchbar', url: 'canopsis/uibase/src/components/searchbar/component', template: 'canopsis/uibase/src/components/searchbar/template.html' },
    { name: 'components/component-simpledicteditor', url: 'canopsis/uibase/src/components/simpledicteditor/component', template: 'canopsis/uibase/src/components/simpledicteditor/template.html' },
    { name: 'components/component-stringclassifiedcrecordselector', url: 'canopsis/uibase/src/components/stringclassifiedcrecordselector/component', template: 'canopsis/uibase/src/components/stringclassifiedcrecordselector/template.html' },
    { name: 'components/component-table', url: 'canopsis/uibase/src/components/table/component', template: 'canopsis/uibase/src/components/table/template.html' },
    { name: 'components/component-templateselector', url: 'canopsis/uibase/src/components/templateselector/component', template: 'canopsis/uibase/src/components/templateselector/template.html' },
    { name: 'components/component-sessioneditor', url: 'canopsis/uibase/src/components/sessioneditor/component', template: 'canopsis/uibase/src/components/sessioneditor/template.html' },
    { name: 'components/component-mixinselector', url: 'canopsis/uibase/src/components/mixinselector/component', template: 'canopsis/uibase/src/components/mixinselector/template.html' },
    { name: 'components/component-textwithsortoption', url: 'canopsis/uibase/src/components/textwithsortoption/component', template: 'canopsis/uibase/src/components/textwithsortoption/template.html' },
    { name: 'components/component-typedvalue', url: 'canopsis/uibase/src/components/typedvalue/component', template: 'canopsis/uibase/src/components/typedvalue/template.html' },
    { name: 'components/component-draggablebutton', url: 'canopsis/uibase/src/components/draggablebutton/component', template: 'canopsis/uibase/src/components/draggablebutton/template.html' },
    { name: 'components/component-rrule', url: 'canopsis/uibase/src/components/rrule/component', template: 'canopsis/uibase/src/components/rrule/template.html' },
    { name: 'components/component-password', url: 'canopsis/uibase/src/components/password/component', template: 'canopsis/uibase/src/components/password/template.html' },
    { name: 'components/component-timestamptooltiped', url: 'canopsis/uibase/src/components/timestamptooltiped/component', template: 'canopsis/uibase/src/components/timestamptooltiped/template.html' },
    { name: 'components/component-formulaeditor', url: 'canopsis/uibase/src/components/formulaeditor/component', template: 'canopsis/uibase/src/components/formulaeditor/template.html' },
    { name: 'components/component-propertiestopopup', url: 'canopsis/uibase/src/components/propertiestopopup/component', template: 'canopsis/uibase/src/components/propertiestopopup/template.html' },
    { name: 'components/component-restobjectcombo', url: 'canopsis/uibase/src/components/restobjectcombo/component', template: 'canopsis/uibase/src/components/restobjectcombo/template.html' },
    { name: 'components/component-contextselector', url: 'canopsis/uibase/src/components/contextselector/component', template: 'canopsis/uibase/src/components/contextselector/template.html' },
    { name: 'components/component-colpick', url: 'canopsis/uibase/src/components/colpick/component', template: 'canopsis/uibase/src/components/colpick/template.html' },
    { name: 'components/component-slider', url: 'canopsis/uibase/src/components/slider/component', template: 'canopsis/uibase/src/components/slider/template.html' },
    { name: 'components/component-labelledlink', url: 'canopsis/uibase/src/components/labelledlink/component', template: 'canopsis/uibase/src/components/labelledlink/template.hbs' },
    { name: 'components/component-linklist', url: 'canopsis/uibase/src/components/linklist/component', template: 'canopsis/uibase/src/components/linklist/template.hbs' },
    { name: 'components/component-miniform', url: 'canopsis/uibase/src/components/miniform/component', template: 'canopsis/uibase/src/components/miniform/template.hbs' },
    { name: 'components/component-miniformcontent', url: 'canopsis/uibase/src/components/miniformcontent/component', template: 'canopsis/uibase/src/components/miniformcontent/template.hbs' },
    { name: 'components/component-miniformheader', url: 'canopsis/uibase/src/components/miniformheader/component', template: 'canopsis/uibase/src/components/miniformheader/template.hbs' },
    { name: 'components/component-miniformheaderbuttons', url: 'canopsis/uibase/src/components/miniformheaderbuttons/component', template: 'canopsis/uibase/src/components/miniformheaderbuttons/template.hbs' },
    { name: 'components/component-miniformtitle', url: 'canopsis/uibase/src/components/miniformtitle/component', template: 'canopsis/uibase/src/components/miniformtitle/template.hbs' },
    { name: 'components/component-elementidselectorwithoptions', url: 'canopsis/uibase/src/components/elementidselectorwithoptions/component', template: 'canopsis/uibase/src/components/elementidselectorwithoptions/template.hbs' },
    { name: 'components/component-dropdownbutton', url: 'canopsis/uibase/src/components/dropdownbutton/component', template: 'canopsis/uibase/src/components/dropdownbutton/template.html' },
    { name: 'components/component-dropdownbuttonheader', url: 'canopsis/uibase/src/components/dropdownbuttonheader/component', template: 'canopsis/uibase/src/components/dropdownbuttonheader/template.html' },
    { name: 'components/component-dropdownbuttoncontent', url: 'canopsis/uibase/src/components/dropdownbuttoncontent/component', template: 'canopsis/uibase/src/components/dropdownbuttoncontent/template.html' },
    { name: 'components/component-dropdownbuttontitle', url: 'canopsis/uibase/src/components/dropdownbuttontitle/component', template: 'canopsis/uibase/src/components/dropdownbuttontitle/template.html' },
    { name: 'components/component-dropdownbuttonoverview', url: 'canopsis/uibase/src/components/dropdownbuttonoverview/component', template: 'canopsis/uibase/src/components/dropdownbuttonoverview/template.html' },
    { name: 'components/component-colorchooser', url: 'canopsis/uibase/src/components/colorchooser/component', template: 'canopsis/uibase/src/components/colorchooser/template.hbs' }
];

loader.loadWithTemplates(components);
