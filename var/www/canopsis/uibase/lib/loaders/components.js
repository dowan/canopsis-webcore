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
    { name: 'components/component-actionbutton', url: 'canopsis/uibase/src/components/actionbutton/component', template: 'canopsis/uibase/src/components/actionbutton/template.hbs' },
    { name: 'components/component-actionfilter', url: 'canopsis/uibase/src/components/actionfilter/component', template: 'canopsis/uibase/src/components/actionfilter/template.hbs' },
    { name: 'components/component-arrayeditor', url: 'canopsis/uibase/src/components/arrayeditor/component', template: 'canopsis/uibase/src/components/arrayeditor/template.hbs' },
    { name: 'components/component-arrayclassifiedcrecordselector', url: 'canopsis/uibase/src/components/arrayclassifiedcrecordselector/component', template: 'canopsis/uibase/src/components/arrayclassifiedcrecordselector/template.hbs' },
    { name: 'components/component-classifiedcrecordselector', url: 'canopsis/uibase/src/components/classifiedcrecordselector/component', template: 'canopsis/uibase/src/components/classifiedcrecordselector/template.hbs' },
    { name: 'components/component-classifieditemselector', url: 'canopsis/uibase/src/components/classifieditemselector/component', template: 'canopsis/uibase/src/components/classifieditemselector/template.hbs' },
    { name: 'components/component-dateinterval', url: 'canopsis/uibase/src/components/dateinterval/component', template: 'canopsis/uibase/src/components/dateinterval/template.hbs' },
    { name: 'components/component-dictclassifiedcrecordselector', url: 'canopsis/uibase/src/components/dictclassifiedcrecordselector/component', template: 'canopsis/uibase/src/components/dictclassifiedcrecordselector/template.hbs' },
    { name: 'components/component-eventkey', url: 'canopsis/uibase/src/components/eventkey/component', template: 'canopsis/uibase/src/components/eventkey/template.hbs' },
    { name: 'components/component-expandableaddbutton', url: 'canopsis/uibase/src/components/expandableaddbutton/component', template: 'canopsis/uibase/src/components/expandableaddbutton/template.hbs' },
    { name: 'components/component-filefield', url: 'canopsis/uibase/src/components/filefield/component', template: 'canopsis/uibase/src/components/filefield/template.hbs' },
    { name: 'components/component-filterclause', url: 'canopsis/uibase/src/components/filterclause/component', template: 'canopsis/uibase/src/components/filterclause/template.hbs' },
    { name: 'components/component-listtree', url: 'canopsis/uibase/src/components/listtree/component', template: 'canopsis/uibase/src/components/listtree/template.hbs' },
    { name: 'components/component-modelselect', url: 'canopsis/uibase/src/components/modelselect/component', template: 'canopsis/uibase/src/components/modelselect/template.hbs' },
    { name: 'components/component-searchbar', url: 'canopsis/uibase/src/components/searchbar/component', template: 'canopsis/uibase/src/components/searchbar/template.hbs' },
    { name: 'components/component-simpledicteditor', url: 'canopsis/uibase/src/components/simpledicteditor/component', template: 'canopsis/uibase/src/components/simpledicteditor/template.hbs' },
    { name: 'components/component-stringclassifiedcrecordselector', url: 'canopsis/uibase/src/components/stringclassifiedcrecordselector/component', template: 'canopsis/uibase/src/components/stringclassifiedcrecordselector/template.hbs' },
    { name: 'components/component-table', url: 'canopsis/uibase/src/components/table/component', template: 'canopsis/uibase/src/components/table/template.hbs' },
    { name: 'components/component-templateselector', url: 'canopsis/uibase/src/components/templateselector/component', template: 'canopsis/uibase/src/components/templateselector/template.hbs' },
    { name: 'components/component-sessioneditor', url: 'canopsis/uibase/src/components/sessioneditor/component', template: 'canopsis/uibase/src/components/sessioneditor/template.hbs' },
    { name: 'components/component-mixinselector', url: 'canopsis/uibase/src/components/mixinselector/component', template: 'canopsis/uibase/src/components/mixinselector/template.hbs' },
    { name: 'components/component-textwithsortoption', url: 'canopsis/uibase/src/components/textwithsortoption/component', template: 'canopsis/uibase/src/components/textwithsortoption/template.hbs' },
    { name: 'components/component-typedvalue', url: 'canopsis/uibase/src/components/typedvalue/component', template: 'canopsis/uibase/src/components/typedvalue/template.hbs' },
    { name: 'components/component-draggablebutton', url: 'canopsis/uibase/src/components/draggablebutton/component', template: 'canopsis/uibase/src/components/draggablebutton/template.hbs' },
    { name: 'components/component-rrule', url: 'canopsis/uibase/src/components/rrule/component', template: 'canopsis/uibase/src/components/rrule/template.hbs' },
    { name: 'components/component-password', url: 'canopsis/uibase/src/components/password/component', template: 'canopsis/uibase/src/components/password/template.hbs' },
    { name: 'components/component-timestamptooltiped', url: 'canopsis/uibase/src/components/timestamptooltiped/component', template: 'canopsis/uibase/src/components/timestamptooltiped/template.hbs' },
    { name: 'components/component-formulaeditor', url: 'canopsis/uibase/src/components/formulaeditor/component', template: 'canopsis/uibase/src/components/formulaeditor/template.hbs' },
    { name: 'components/component-propertiestopopup', url: 'canopsis/uibase/src/components/propertiestopopup/component', template: 'canopsis/uibase/src/components/propertiestopopup/template.hbs' },
    { name: 'components/component-restobjectcombo', url: 'canopsis/uibase/src/components/restobjectcombo/component', template: 'canopsis/uibase/src/components/restobjectcombo/template.hbs' },
    { name: 'components/component-contextselector', url: 'canopsis/uibase/src/components/contextselector/component', template: 'canopsis/uibase/src/components/contextselector/template.hbs' },
    { name: 'components/component-colpick', url: 'canopsis/uibase/src/components/colpick/component', template: 'canopsis/uibase/src/components/colpick/template.hbs' },
    { name: 'components/component-slider', url: 'canopsis/uibase/src/components/slider/component', template: 'canopsis/uibase/src/components/slider/template.hbs' },
    { name: 'components/component-labelledlink', url: 'canopsis/uibase/src/components/labelledlink/component', template: 'canopsis/uibase/src/components/labelledlink/template.hbs' },
    { name: 'components/component-linklist', url: 'canopsis/uibase/src/components/linklist/component', template: 'canopsis/uibase/src/components/linklist/template.hbs' },
    { name: 'components/component-miniform', url: 'canopsis/uibase/src/components/miniform/component', template: 'canopsis/uibase/src/components/miniform/template.hbs' },
    { name: 'components/component-miniformcontent', url: 'canopsis/uibase/src/components/miniformcontent/component', template: 'canopsis/uibase/src/components/miniformcontent/template.hbs' },
    { name: 'components/component-miniformheader', url: 'canopsis/uibase/src/components/miniformheader/component', template: 'canopsis/uibase/src/components/miniformheader/template.hbs' },
    { name: 'components/component-miniformheaderbuttons', url: 'canopsis/uibase/src/components/miniformheaderbuttons/component', template: 'canopsis/uibase/src/components/miniformheaderbuttons/template.hbs' },
    { name: 'components/component-miniformtitle', url: 'canopsis/uibase/src/components/miniformtitle/component', template: 'canopsis/uibase/src/components/miniformtitle/template.hbs' },
    { name: 'components/component-elementidselectorwithoptions', url: 'canopsis/uibase/src/components/elementidselectorwithoptions/component', template: 'canopsis/uibase/src/components/elementidselectorwithoptions/template.hbs' },
    { name: 'components/component-dropdownbutton', url: 'canopsis/uibase/src/components/dropdownbutton/component', template: 'canopsis/uibase/src/components/dropdownbutton/template.hbs' },
    { name: 'components/component-dropdownbuttonheader', url: 'canopsis/uibase/src/components/dropdownbuttonheader/component', template: 'canopsis/uibase/src/components/dropdownbuttonheader/template.hbs' },
    { name: 'components/component-dropdownbuttoncontent', url: 'canopsis/uibase/src/components/dropdownbuttoncontent/component', template: 'canopsis/uibase/src/components/dropdownbuttoncontent/template.hbs' },
    { name: 'components/component-dropdownbuttontitle', url: 'canopsis/uibase/src/components/dropdownbuttontitle/component', template: 'canopsis/uibase/src/components/dropdownbuttontitle/template.hbs' },
    { name: 'components/component-dropdownbuttonoverview', url: 'canopsis/uibase/src/components/dropdownbuttonoverview/component', template: 'canopsis/uibase/src/components/dropdownbuttonoverview/template.hbs' },
    { name: 'components/component-colorchooser', url: 'canopsis/uibase/src/components/colorchooser/component', template: 'canopsis/uibase/src/components/colorchooser/template.hbs' }
];

loader.loadWithTemplates(components);
