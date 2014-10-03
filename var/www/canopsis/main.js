/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
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
    'app/adapters/application',
    'app/adapters/ack',
    'app/adapters/event',
    'app/adapters/eventlog',
    'app/adapters/cancel',
    'app/adapters/entity',
    'app/adapters/eue',
    'app/adapters/metric',
    'app/adapters/connector',
    'app/adapters/cservice',
    'app/serializers/application',
    'bootstrap',
    'colorpicker',
    'gridster',
    'timepicker',
    'icheck',
    'app/lib/wrappers/console',
    'app/lib/loaders/editors',
    'app/lib/loaders/renderers',
    'app/lib/loaders/widgets',
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

    //TEMP
    Application.connector = [ { name : "nagios" }, { name : "shinken" } , { name : "schneider" } , { name : "collectd" }];

    Application.manifest = routes;

});
