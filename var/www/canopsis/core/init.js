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
    'app/controller/application',
    'app/controller/formwrapper',
    'app/controller/login',
    'app/controller/partialslotable',
    'app/controller/form',
    'app/controller/perfdata',
    'app/controller/recordinfopopup',
    'app/controller/serie',
    'app/controller/userview',
    'app/controller/widget',
    'app/lib/contextsregistry',
    'app/lib/inflections',
    'app/lib/factories/mixin',
    'app/lib/factories/form',
    'app/lib/promisesmanager',
    'app/lib/factories/widget',
    'app/lib/helpers/partialslot',
    'app/lib/loaders/forms',
    'app/lib/loaders/helpers',
    'app/lib/loaders/mixins',
    'app/lib/loaders/validators',
    'app/lib/loaders/schemas',
    'app/lib/requirejsmocksmanager',
    'app/lib/utils/actions',
    'app/lib/utils/data',
    'app/lib/utils/forms',
    'app/lib/helpers/widgetslot',
    'app/lib/utils/routes',
    'app/lib/utils/widgets',
    'app/lib/utils/debug',
    'app/lib/utils/modelsolve',
    'app/lib/utils/values',
    'app/lib/utils/slug',
    'app/lib/widgetsregistry',
    'app/lib/abstractclassregistry',
    'app/lib/utilityclass',
    'app/lib/mixinsregistry',
    'app/lib/searchmethodsregistry',
    'app/lib/schemasregistry',
    'app/lib/wrappers/console',
    'app/lib/wrappers/ionicons',
    'app/lib/wrappers/mousetrap',
    'app/mixins/consolemanager',
    'app/mixins/inspectablearray',
    'app/mixins/inspectableitem',
    'app/mixins/loadingindicator',
    'app/mixins/metaserializer',
    'app/mixins/notifications',
    'app/mixins/promisemanager',
    'app/mixins/requirejsmocksmanager',
    'app/mixins/schemamanager',
    'app/mixins/screentoolstatusmenu',
    'app/mixins/userprofilestatusmenu',
    'app/mixins/validation',
    'app/mixins/validationfield',
    'app/mixins/hashserializer',
    'app/mixins/embeddedrecordserializer',
    'app/mixins/documentation',
    'app/mixins/criticitylevels',
    'app/routes/application',
    'app/routes/authenticated',
    'app/routes/index',
    'app/routes/userview',
    'app/serializers/application',
    'app/serializers/eventlog',
    'app/serializers/loggedaccount',
    'app/serializers/userview',
    'app/serializers/widget',
    'app/serializers/widgetwrapper',
    'app/view/application',
    'app/view/editor',
    'app/view/formwrapper',
    'app/view/listline',
    'app/view/mixineditdropdown',
    'app/view/partialslot',
    'app/view/recordinfopopup',
    'app/view/tabledraggableth',
    'app/view/userview',
    'app/view/validationtextarea',
    'app/view/validationtextfield',
    'app/view/widget',
    'app/view/widgetslot',
    'canopsis/runtime.conf',
    'css3-mediaqueries',
    'jsonselect',
    'math',
    'app/lib/utils/hash'
], function(Canopsis) {

    window.getCanopsis = function () {
        return Canopsis;
    };
});
