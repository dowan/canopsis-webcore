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
        'jsoneditorlib': 'webcore-libs/jsoneditor/jsoneditor',
        'icheck': 'webcore-libs/iCheck/icheck',
        'css3-mediaqueries': 'webcore-libs/min/css3-mediaqueries',
    },
    shim: {
        'jsoneditorlib': {
            deps: ['ember']
        },
        'icheck': {
            deps: ['jquery']
        }
    }
});

define([
    'app/application',
    'runtime.conf',
    'app/controller/application',
    'app/controller/formwrapper',
    'app/controller/login',
    'app/controller/userview',
    'app/controller/widget',
    'app/view/application',
    'app/view/formwrapper',
    'app/view/editor',
    'app/view/widget',
    'app/view/validationtextfield',
    'app/view/validationtextarea',
    'app/serializers/application',
    'app/serializers/ctxmetric',
    'app/serializers/ctxcomponent',
    'app/serializers/ctxresource',
    'app/serializers/ctxselector',
    'app/serializers/ctxtopology',
    'app/serializers/linklist',
    'app/lib/wrappers/hint',
    'app/lib/wrappers/console',
    'app/lib/wrappers/jsoneditor',
    'app/lib/wrappers/ionicons',
    'app/lib/loaders/attributepresets',
    'app/lib/loaders/forms',
    'app/lib/loaders/validators',
    'app/lib/loaders/mixins',
    'app/routes/application',
    'app/routes/authenticated',
    'app/routes/index',
    'app/routes/userview',
    'css3-mediaqueries'
], function(Application, Canopsis) {

    window.getCanopsis = function () {
        return Canopsis;
    };

    return Application;
});
