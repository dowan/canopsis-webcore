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
        'bootstrap': 'webcore-libs/bootstrap/dist/js/bootstrap.min',
        'datetimepicker': 'canopsis/uibase/libwrappers/datetimepicker',
        'icheck': 'webcore-libs/iCheck/icheck',
        'codemirror': 'webcore-libs/codemirror/lib/codemirror',
        'summernote': 'webcore-libs/summernote/dist/summernote',
        'ember-summernote': 'webcore-libs/ember-summernote/lib/component',
        'daterangepicker': 'webcore-libs/bootstrap-daterangepicker/daterangepicker',

        'rrule': 'webcore-libs/kb-rrule/lib/rrule',
        'nlp': 'webcore-libs/kb-rrule/lib/nlp',
        'underscore' : 'canopsis/uibase/libwrappers/underscore',

        'moment': 'webcore-libs/moment/min/moment-with-locales.min',
        'jsoneditorlib': 'webcore-libs/jsoneditor/jsoneditor',
        'ember-jsoneditor-lib': 'webcore-libs/ember-jsoneditor/build/lib',
        'd3': 'webcore-libs/d3/d3'
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
        },
        'jsoneditorlib': {
            deps: ['ember']
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
    'canopsis/uibase/libwrappers/codemirror'
], function () {});
