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

define([
    'app/application',
    'runtime.conf',
    'app/serializers/application',
    'app/serializers/ctxmetric',
    'app/serializers/ctxcomponent',
    'app/serializers/ctxresource',
    'app/serializers/ctxselector',
    'app/lib/wrappers/bootstrap',
    'app/lib/wrappers/hint',
    'app/lib/wrappers/swag',
    'app/lib/wrappers/console',
    'app/lib/wrappers/ionicons',
    'app/lib/wrappers/jsoneditor',
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
