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
    { name: 'components/component-actionbutton', url: 'canopsis/uibase/components/actionbutton/component', template: 'canopsis/uibase/components/actionbutton/template.html' },
    { name: 'components/component-actionfilter', url: 'canopsis/uibase/components/actionfilter/component', template: 'canopsis/uibase/components/actionfilter/template.html' },
    { name: 'components/component-arrayeditor', url: 'canopsis/uibase/components/arrayeditor/component', template: 'canopsis/uibase/components/arrayeditor/template.html' },
    { name: 'components/component-arrayclassifiedcrecordselector', url: 'canopsis/uibase/components/arrayclassifiedcrecordselector/component', template: 'canopsis/uibase/components/arrayclassifiedcrecordselector/template.html' },
    { name: 'components/component-classifiedcrecordselector', url: 'canopsis/uibase/components/classifiedcrecordselector/component', template: 'canopsis/uibase/components/classifiedcrecordselector/template.html' },
    { name: 'components/component-classifieditemselector', url: 'canopsis/uibase/components/classifieditemselector/component', template: 'canopsis/uibase/components/classifieditemselector/template.html' },
    { name: 'components/component-dateinterval', url: 'canopsis/uibase/components/dateinterval/component', template: 'canopsis/uibase/components/dateinterval/template.html' },
    { name: 'components/component-dictclassifiedcrecordselector', url: 'canopsis/uibase/components/dictclassifiedcrecordselector/component', template: 'canopsis/uibase/components/dictclassifiedcrecordselector/template.html' },
    { name: 'components/component-eventkey', url: 'canopsis/uibase/components/eventkey/component', template: 'canopsis/uibase/components/eventkey/template.html' },
    { name: 'components/component-expandableaddbutton', url: 'canopsis/uibase/components/expandableaddbutton/component', template: 'canopsis/uibase/components/expandableaddbutton/template.html' },
    { name: 'components/component-filterclause', url: 'canopsis/uibase/components/filterclause/component', template: 'canopsis/uibase/components/filterclause/template.html' },
    { name: 'components/component-listtree', url: 'canopsis/uibase/components/listtree/component', template: 'canopsis/uibase/components/listtree/template.html' },
    { name: 'components/component-modelselect', url: 'canopsis/uibase/components/modelselect/component', template: 'canopsis/uibase/components/modelselect/template.html' },
    { name: 'components/component-rightsselector', url: 'canopsis/uibase/components/rightsselector/component', template: 'canopsis/uibase/components/rightsselector/template.html' },
    { name: 'components/component-searchbar', url: 'canopsis/uibase/components/searchbar/component', template: 'canopsis/uibase/components/searchbar/template.html' },
    { name: 'components/component-stateeditor', url: 'canopsis/uibase/components/stateeditor/component', template: 'canopsis/uibase/components/stateeditor/template.html' },
    { name: 'components/component-eventselector', url: 'canopsis/uibase/components/eventselector/component', template: 'canopsis/uibase/components/eventselector/template.html' },
    { name: 'components/component-simpledicteditor', url: 'canopsis/uibase/components/simpledicteditor/component', template: 'canopsis/uibase/components/simpledicteditor/template.html' },
    { name: 'components/component-stringclassifiedcrecordselector', url: 'canopsis/uibase/components/stringclassifiedcrecordselector/component', template: 'canopsis/uibase/components/stringclassifiedcrecordselector/template.html' },
    { name: 'components/component-table', url: 'canopsis/uibase/components/table/component', template: 'canopsis/uibase/components/table/template.html' },
    { name: 'components/component-templateselector', url: 'canopsis/uibase/components/templateselector/component', template: 'canopsis/uibase/components/templateselector/template.html' },
    { name: 'components/component-sessioneditor', url: 'canopsis/uibase/components/sessioneditor/component', template: 'canopsis/uibase/components/sessioneditor/template.html' },
    { name: 'components/component-cfiltereditor', url: 'canopsis/uibase/components/cfiltereditor/component', template: 'canopsis/uibase/components/cfiltereditor/template.html' },
    { name: 'components/component-cfilter2editor', url: 'canopsis/uibase/components/cfilter2editor/component', template: 'canopsis/uibase/components/cfilter2editor/template.html' },
    { name: 'components/component-cfilter3editor', url: 'canopsis/uibase/components/cfilter3editor/component', template: 'canopsis/uibase/components/cfilter3editor/template.html' },
    { name: 'components/component-mixinselector', url: 'canopsis/uibase/components/mixinselector/component', template: 'canopsis/uibase/components/mixinselector/template.html' },
    { name: 'components/component-textwithsortoption', url: 'canopsis/uibase/components/textwithsortoption/component', template: 'canopsis/uibase/components/textwithsortoption/template.html' },
    { name: 'components/component-typedvalue', url: 'canopsis/uibase/components/typedvalue/component', template: 'canopsis/uibase/components/typedvalue/template.html' },
    { name: 'components/component-draggablebutton', url: 'canopsis/uibase/components/draggablebutton/component', template: 'canopsis/uibase/components/draggablebutton/template.html' },
    { name: 'components/component-rrule', url: 'canopsis/uibase/components/rrule/component', template: 'canopsis/uibase/components/rrule/template.html' },
    { name: 'components/component-password', url: 'canopsis/uibase/components/password/component', template: 'canopsis/uibase/components/password/template.html' },
    { name: 'components/component-timestamptooltiped', url: 'canopsis/uibase/components/timestamptooltiped/component', template: 'canopsis/uibase/components/timestamptooltiped/template.html' },
    { name: 'components/component-ack', url: 'canopsis/uibase/components/ack/component', template: 'canopsis/uibase/components/ack/template.html' },
    { name: 'components/component-formulaeditor', url: 'canopsis/uibase/components/formulaeditor/component', template: 'canopsis/uibase/components/formulaeditor/template.html' },
    { name: 'components/component-propertiestopopup', url: 'canopsis/uibase/components/propertiestopopup/component', template: 'canopsis/uibase/components/propertiestopopup/template.html' },
    { name: 'components/component-restobjectcombo', url: 'canopsis/uibase/components/restobjectcombo/component', template: 'canopsis/uibase/components/restobjectcombo/template.html' },
    { name: 'components/component-contextselector', url: 'canopsis/uibase/components/contextselector/component', template: 'canopsis/uibase/components/contextselector/template.html' },
    { name: 'components/component-colpick', url: 'canopsis/uibase/components/colpick/component', template: 'canopsis/uibase/components/colpick/template.html' },
    { name: 'components/component-slider', url: 'canopsis/uibase/components/slider/component', template: 'canopsis/uibase/components/slider/template.html' },
    { name: 'components/component-labelledlink', url: 'canopsis/uibase/components/labelledlink/component', template: 'canopsis/uibase/components/labelledlink/template.hbs' },
    { name: 'components/component-miniform', url: 'canopsis/uibase/components/miniform/component', template: 'canopsis/uibase/components/miniform/template.hbs' },
    { name: 'components/component-miniformcontent', url: 'canopsis/uibase/components/miniformcontent/component', template: 'canopsis/uibase/components/miniformcontent/template.hbs' },
    { name: 'components/component-miniformheader', url: 'canopsis/uibase/components/miniformheader/component', template: 'canopsis/uibase/components/miniformheader/template.hbs' },
    { name: 'components/component-miniformheaderbuttons', url: 'canopsis/uibase/components/miniformheaderbuttons/component', template: 'canopsis/uibase/components/miniformheaderbuttons/template.hbs' },
    { name: 'components/component-miniformtitle', url: 'canopsis/uibase/components/miniformtitle/component', template: 'canopsis/uibase/components/miniformtitle/template.hbs' },
    { name: 'components/component-objecteditor', url: 'canopsis/uibase/components/objecteditor/component', template: 'canopsis/uibase/components/objecteditor/template.hbs' },
    { name: 'components/component-elementidselectorwithoptions', url: 'canopsis/uibase/components/elementidselectorwithoptions/component', template: 'canopsis/uibase/components/elementidselectorwithoptions/template.hbs' },
    { name: 'components/component-formlabel', url: 'canopsis/uibase/components/formlabel/component', template: 'canopsis/uibase/components/formlabel/template.hbs' }
];

loader.loadWithTemplates(components);
