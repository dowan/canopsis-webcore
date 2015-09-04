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

/** @module canopsis.frontend.uibase */

require.config({
    paths: {
        'bootstrap': 'canopsis/uibase/lib/externals/bootstrap/dist/js/bootstrap.min',
        'datetimepicker': 'canopsis/uibase/libwrappers/datetimepicker',
        'icheck': 'canopsis/uibase/lib/externals/iCheck/icheck',
        'codemirror': 'canopsis/uibase/lib/externals/codemirror/lib/codemirror',
        'summernote': 'canopsis/uibase/lib/externals/summernote/dist/summernote',
        'ember-summernote': 'canopsis/uibase/lib/externals/ember-summernote/lib/component',
        'daterangepicker': 'canopsis/uibase/lib/externals/bootstrap-daterangepicker/daterangepicker',

        'rrule': 'canopsis/uibase/lib/externals/kb-rrule/lib/rrule',
        'nlp': 'canopsis/uibase/lib/externals/kb-rrule/lib/nlp',
        'underscore' : 'canopsis/uibase/libwrappers/underscore',

        'moment': 'canopsis/uibase/lib/externals/moment/min/moment-with-locales.min',
        'jsoneditorlib': 'canopsis/uibase/lib/externals/jsoneditor/jsoneditor',
        'ember-jsoneditor-lib': 'canopsis/uibase/lib/externals/ember-jsoneditor/ember-jsoneditor',
        'd3': 'canopsis/uibase/lib/externals/d3/d3'
    },
    shim: {
        'rrule': {
             deps: ['jquery', 'underscore']
        },
        'nlp': {
             deps: ['jquery', 'rrule', 'underscore']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'datetimepicker': {
            deps: ['jquery', 'moment', 'bootstrap']
        },
        'icheck': {
            deps: ['jquery']
        }
    }
});

define([
    'canopsis/uibase/lib/loaders/editors',
    'canopsis/uibase/lib/loaders/widgets',
    'canopsis/uibase/lib/loaders/components',
    'canopsis/uibase/lib/loaders/renderers',
    'canopsis/uibase/lib/loaders/templates',
    'canopsis/uibase/lib/loaders/helpers',
    'canopsis/uibase/lib/loaders/mixins',
    'canopsis/uibase/libwrappers/bootstrap',
    'canopsis/uibase/libwrappers/jsoneditor',
    'canopsis/uibase/libwrappers/summernote',
    'canopsis/uibase/libwrappers/codemirror',

    'canopsis/uibase/libwrappers/colpick',
    'canopsis/uibase/libwrappers/rrule',
    'canopsis/core/lib/wrappers/slider',
    'canopsis/uibase/mixins/arraysearch',
    'canopsis/uibase/mixins/customfilterlist',
    'canopsis/uibase/mixins/draggablecolumns',
    'canopsis/uibase/mixins/gridlayout',
    'canopsis/uibase/mixins/horizontallayout',
    'canopsis/uibase/mixins/lightlayout',
    'canopsis/uibase/mixins/listlinedetail',
    'canopsis/uibase/mixins/minimizebutton',
    'canopsis/uibase/mixins/pagination',
    'canopsis/uibase/mixins/periodicrefresh',
    'canopsis/uibase/mixins/responsivelist',
    'canopsis/uibase/mixins/showviewbutton',
    'canopsis/uibase/mixins/sortablearray',
    'canopsis/uibase/mixins/tablayout',
    'canopsis/uibase/mixins/verticallayout',
    'canopsis/uibase/mixins/downtime',
    'canopsis/uibase/mixins/crud',
    'canopsis/uibase/mixins/background',
    'canopsis/uibase/widgets/topology/controller',
    'canopsis/uibase/widgets/topology/view',
    'canopsis/uibase/widgets/topology/adapter',
    'link!canopsis/uibase/widgets/topology/style.css',
    'canopsis/uibase/views/widgettitlebar-drag-handle',
    'canopsis/uibase/lib/externals/ember-datetimepicker/lib/component',
    'canopsis/uibase/lib/externals/ember-icheck/lib/component',
    'canopsis/uibase/lib/externals/ember-tooltip/lib/component',
    'canopsis/uibase/lib/externals/jquery-nearest/src/jquery.nearest',
    'canopsis/uibase/lib/externals/ember-durationcombo/lib/component',
    'link!canopsis/uibase/lib/externals/fontawesome/css/font-awesome.min.css',
    'link!canopsis/uibase/lib/externals/bootstrap-daterangepicker/daterangepicker-bs3.css',
    'canopsis/uibase/lib/externals/stacktable/stacktable',
    'link!canopsis/uibase/lib/externals/stacktable/stacktable.css',
    'daterangepicker'
], function () {});

