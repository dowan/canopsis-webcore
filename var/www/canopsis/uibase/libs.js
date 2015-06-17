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
        'datetimepicker': 'canopsis/uibase/libwrappers/datetimepicker',

        'rrule': 'canopsis/uibase/lib/externals/kb-rrule/lib/rrule',
        'nlp': 'canopsis/uibase/lib/externals/kb-rrule/lib/nlp',
        'underscore' : 'canopsis/uibase/libwrappers/underscore',

        'moment': 'canopsis/uibase/lib/externals/moment/min/moment-with-locales.min'
    },
    shim: {
        'rrule': {
             deps: ['underscore']
        },
        'nlp': {
             deps: ['rrule', 'underscore']
        },
        'datetimepicker': {
            deps: ['moment']
        }
    }
});

define([
    'canopsis/uibase/lib/externals/iCheck/icheck',
    'canopsis/uibase/lib/externals/ember-icheck/lib/component',
    'canopsis/uibase/lib/externals/ember-tooltip/lib/component',
    'canopsis/uibase/lib/externals/ember-durationcombo/lib/component',
    'canopsis/uibase/lib/externals/bootstrap/dist/js/bootstrap.min',
    'canopsis/uibase/lib/externals/jsoneditor/jsoneditor',
    'canopsis/uibase/lib/externals/d3/d3',
    'canopsis/uibase/lib/externals/summernote/dist/summernote.min',
    'canopsis/uibase/lib/externals/ember-summernote/lib/component',
    'canopsis/uibase/lib/externals/ember-datetimepicker/lib/component',
    'canopsis/uibase/lib/externals/bootstrap-daterangepicker/daterangepicker',
    'canopsis/uibase/lib/externals/ember-jsoneditor/ember-jsoneditor',

    'canopsis/uibase/lib/externals/summernote/dist/summernote',
    'canopsis/uibase/lib/externals/codemirror/lib/codemirror',

    'canopsis/uibase/lib/externals/colpick/js/colpick',

    'link!canopsis/uibase/lib/externals/jsoneditor/jsoneditor.css',
    'link!canopsis/uibase/lib/externals/bootstrap/dist/css/bootstrap.min.css',
    'link!canopsis/uibase/lib/externals/fontawesome/css/font-awesome.min.css',
    'link!canopsis/uibase/lib/externals/bootstrap-daterangepicker/daterangepicker-bs3.css',
    'link!canopsis/uibase/lib/externals/iCheck/skins/all.css',
    'link!canopsis/uibase/lib/externals/codemirror/theme/ambiance.css',
    'link!canopsis/uibase/lib/externals/codemirror/lib/codemirror.css',
    'link!canopsis/uibase/lib/externals/summernote/dist/summernote.css',
    'link!canopsis/uibase/lib/externals/colpick/css/colpick.css'
], function () {
});
