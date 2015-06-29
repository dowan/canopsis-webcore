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

require.config({
    paths: {
        'bootstrap': 'canopsis/uibase/lib/externals/bootstrap/dist/js/bootstrap.min',
        'datetimepicker': 'canopsis/uibase/libwrappers/datetimepicker',

        'rrule': 'canopsis/uibase/lib/externals/kb-rrule/lib/rrule',
        'nlp': 'canopsis/uibase/lib/externals/kb-rrule/lib/nlp',
        'underscore' : 'canopsis/uibase/libwrappers/underscore',

        'moment': 'canopsis/uibase/lib/externals/moment/min/moment-with-locales.min',
        'jsoneditorlib': 'canopsis/uibase/lib/externals/jsoneditor/jsoneditor',
        'ember-jsoneditor-lib': 'canopsis/uibase/lib/externals/ember-jsoneditor/ember-jsoneditor',
    },
    shim: {
        'rrule': {
             deps: ['underscore']
        },
        'nlp': {
             deps: ['rrule', 'underscore']
        },
        'datetimepicker': {
            deps: ['moment', 'bootstrap']
        },
        'ember-jsoneditor-lib': {
            deps: ['jsoneditorlib']
        }
    }
});

define([
    'canopsis/uibase/lib/externals/d3/d3',
    'bootstrap',
    'canopsis/uibase/components/actionbutton/component',
    'canopsis/uibase/components/actionfilter/component',
    'canopsis/uibase/components/arrayclassifiedcrecordselector/component',
    'canopsis/uibase/components/arrayeditor/component',
    'canopsis/uibase/components/classifiedcrecordselector/component',
    'canopsis/uibase/components/classifieditemselector/component',
    'canopsis/uibase/components/colpick/component',
    'canopsis/uibase/components/contextselector/component',
    'canopsis/uibase/components/dateinterval/component',
    'canopsis/uibase/components/dictclassifiedcrecordselector/component',
    'canopsis/uibase/components/draggablebutton/component',
    'canopsis/uibase/components/dropdownbutton/component',
    'canopsis/uibase/components/dropdownbuttoncontent/component',
    'canopsis/uibase/components/dropdownbuttonheader/component',
    'canopsis/uibase/components/dropdownbuttonoverview/component',
    'canopsis/uibase/components/dropdownbuttontitle/component',
    'canopsis/uibase/components/elementidselectorwithoptions/component',
    'canopsis/uibase/components/eventkey/component',
    'canopsis/uibase/components/expandableaddbutton/component',
    'canopsis/uibase/components/filterclause/component',
    'canopsis/uibase/components/formulaeditor/component',
    'canopsis/uibase/components/labelledlink/component',
    'canopsis/uibase/components/linklist/component',
    'canopsis/uibase/components/listtree/component',
    'canopsis/uibase/components/miniform/component',
    'canopsis/uibase/components/miniformcontent/component',
    'canopsis/uibase/components/miniformheader/component',
    'canopsis/uibase/components/miniformheaderbuttons/component',
    'canopsis/uibase/components/miniformtitle/component',
    'canopsis/uibase/components/mixinselector/component',
    'canopsis/uibase/components/modelselect/component',
    'canopsis/uibase/components/password/component',
    'canopsis/uibase/components/propertiestopopup/component',
    'canopsis/uibase/components/restobjectcombo/component',
    'canopsis/uibase/components/rrule/component',
    'canopsis/uibase/components/searchbar/component',
    'canopsis/uibase/components/sessioneditor/component',
    'canopsis/uibase/components/simpledicteditor/component',
    'canopsis/uibase/components/slider/component',
    'canopsis/uibase/components/stringclassifiedcrecordselector/component',
    'canopsis/uibase/components/table/component',
    'canopsis/uibase/components/templateselector/component',
    'canopsis/uibase/components/textwithsortoption/component',
    'canopsis/uibase/components/timestamptooltiped/component',
    'canopsis/uibase/components/typedvalue/component',
    'canopsis/uibase/helpers/color',
    'canopsis/uibase/helpers/eventtype',
    'canopsis/uibase/helpers/glyphicon',
    'canopsis/uibase/helpers/interval2html',
    'canopsis/uibase/helpers/json2html',
    'canopsis/uibase/helpers/logo',
    'canopsis/uibase/helpers/percent',
    'canopsis/uibase/helpers/rights',
    'canopsis/uibase/helpers/sorticon',
    'canopsis/uibase/helpers/timeSince',
    'canopsis/uibase/helpers/timestamp',
    'canopsis/uibase/lib/externals/bootstrap-daterangepicker/daterangepicker',
    'canopsis/uibase/lib/externals/codemirror/lib/codemirror',
    'canopsis/uibase/lib/externals/colpick/js/colpick',
    'canopsis/uibase/lib/externals/ember-datetimepicker/lib/component',
    'canopsis/uibase/lib/externals/ember-durationcombo/lib/component',
    'canopsis/uibase/lib/externals/ember-icheck/lib/component',
    'canopsis/uibase/lib/externals/ember-summernote/lib/component',
    'canopsis/uibase/lib/externals/ember-tooltip/lib/component',
    'canopsis/uibase/lib/externals/eonasdan-bootstrap-datetimepicker/lib/js/bootstrap-datetimepicker.min',
    'canopsis/uibase/lib/externals/iCheck/icheck',
    'canopsis/uibase/lib/externals/iCheck/icheck',
    'canopsis/uibase/lib/externals/stacktable/stacktable',
    'canopsis/uibase/lib/externals/summernote/dist/summernote.min',
    'canopsis/uibase/lib/externals/underscore/underscore',
    'canopsis/uibase/lib/loaders/components',
    'canopsis/uibase/lib/loaders/editors',
    'canopsis/uibase/lib/loaders/helpers',
    'canopsis/uibase/lib/loaders/mixins',
    'canopsis/uibase/lib/loaders/renderers',
    'canopsis/uibase/lib/loaders/templates',
    'canopsis/uibase/lib/loaders/widgets',
    'canopsis/uibase/libwrappers/bootstrap',
    'canopsis/uibase/libwrappers/codemirror',
    'canopsis/uibase/libwrappers/codemirror',
    'canopsis/uibase/libwrappers/colpick',
    'canopsis/uibase/libwrappers/jsoneditor',
    'canopsis/uibase/libwrappers/rrule',
    'canopsis/uibase/libwrappers/summernote',
    'canopsis/uibase/mixins/arraysearch',
    'canopsis/uibase/mixins/background',
    'canopsis/uibase/mixins/crud',
    'canopsis/uibase/mixins/customfilterlist',
    'canopsis/uibase/mixins/draggablecolumns',
    'canopsis/uibase/mixins/gridlayout',
    'canopsis/uibase/mixins/horizontallayout',
    'canopsis/uibase/mixins/lightlayout',
    'canopsis/uibase/mixins/listlinedetail',
    'canopsis/uibase/mixins/listlinedetail',
    'canopsis/uibase/mixins/minimizebutton',
    'canopsis/uibase/mixins/pagination',
    'canopsis/uibase/mixins/pagination',
    'canopsis/uibase/mixins/periodicrefresh',
    'canopsis/uibase/mixins/responsivelist',
    'canopsis/uibase/mixins/showviewbutton',
    'canopsis/uibase/mixins/sortablearray',
    'canopsis/uibase/mixins/tablayout',
    'canopsis/uibase/mixins/verticallayout',
    'canopsis/uibase/widgets/euewi/controller',
    'canopsis/uibase/widgets/list/controller',
    'canopsis/uibase/widgets/text/controller',
    'canopsis/uibase/widgets/topology/adapter',
    'canopsis/uibase/widgets/topology/controller',
    'canopsis/uibase/widgets/topology/view',
    'canopsis/uibase/widgets/uiactionbutton/controller',
    'canopsis/uibase/widgets/uimaintabcollection/controller',
    'canopsis/uibase/widgets/widgetcontainer/controller',
    'ember-jsoneditor-lib',
    'jsoneditorlib',
    'link!canopsis/uibase/lib/externals/bootstrap-daterangepicker/daterangepicker-bs3.css',
    'link!canopsis/uibase/lib/externals/bootstrap/dist/css/bootstrap.min.css',
    'link!canopsis/uibase/lib/externals/codemirror/lib/codemirror.css',
    'link!canopsis/uibase/lib/externals/codemirror/lib/codemirror.css',
    'link!canopsis/uibase/lib/externals/codemirror/theme/ambiance.css',
    'link!canopsis/uibase/lib/externals/colpick/css/colpick.css',
    'link!canopsis/uibase/lib/externals/eonasdan-bootstrap-datetimepicker/lib/css/bootstrap-datetimepicker.min.css',
    'link!canopsis/uibase/lib/externals/fontawesome/css/font-awesome.min.css',
    'link!canopsis/uibase/lib/externals/iCheck/skins/all.css',
    'link!canopsis/uibase/lib/externals/jsoneditor/jsoneditor.css',
    'link!canopsis/uibase/lib/externals/stacktable/stacktable.css',
    'link!canopsis/uibase/lib/externals/summernote/dist/summernote.css',
    'link!canopsis/uibase/widgets/topology/style.css',
    'nlp',
    'underscore'
], function (d3) {
    window.d3 = d3
});

