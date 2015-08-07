/**
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

/** @module canopsis.frontend.core */

require.config({
    paths: {
        'css3-mediaqueries': 'canopsis/core/lib/externals/min/css3-mediaqueries',
        'math': 'canopsis/core/lib/externals/mathjs/dist/math',
        'hashes': 'canopsis/core/lib/externals/jshashes/hashes',

        //TODO move this in uibase
        'jsonselect': 'canopsis/core/lib/wrappers/jsonselect'
    }
});

define([
    'canopsis/runtime.conf',
    'app/controller/application',
    'app/controller/formwrapper',
    'app/controller/serie',
    'app/controller/login',
    'app/controller/userview',
    'app/view/userview',
    'app/controller/widget',
    'app/view/application',
    'app/view/formwrapper',
    'app/view/editor',
    'app/view/widget',
    'app/view/validationtextfield',
    'app/view/validationtextarea',
    'app/serializers/application',
    'app/serializers/widgetwrapper',
    'app/serializers/loggedaccount',
    'app/serializers/userview',
    'app/serializers/widget',
    'app/lib/wrappers/console',
    'app/lib/wrappers/ionicons',
    'app/lib/loaders/forms',
    'app/lib/loaders/validators',
    'app/lib/loaders/mixins',
    'app/routes/application',
    'app/routes/authenticated',
    'app/routes/index',
    'app/routes/userview',
    'css3-mediaqueries'
], function(Canopsis) {

    window.getCanopsis = function () {
        return Canopsis;
    };
});
