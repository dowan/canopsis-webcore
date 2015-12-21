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

var JSONSelect;

require.config({
    paths: {
        'css3-mediaqueries': 'canopsis/core/lib/externals/min/css3-mediaqueries',
        'math': 'canopsis/core/lib/externals/mathjs/dist/math',
        'hashes': 'canopsis/core/lib/externals/jshashes/hashes',

        'jsonselect': 'canopsis/core/lib/externals/jsonselect/src/jsonselect'
    }
});

define([
    'canopsis/core/lib/loaders/utils',
    'canopsis/core/lib/registries',
    'canopsis/core/lib/wrappersmanager',
    'canopsis/core/lib/indexesregistry',
    'canopsis/core/lib/actionsregistry',
    'canopsis/core/lib/formsregistry',
    'canopsis/core/lib/loaders/components',
    'canopsis/core/controller/application',
    'canopsis/core/controller/formwrapper',
    'canopsis/core/controller/login',
    'canopsis/core/controller/partialslotable',
    'canopsis/core/controller/form',
    'canopsis/core/controller/perfdata',
    'canopsis/core/controller/recordinfopopup',
    'canopsis/core/controller/serie',
    'canopsis/core/controller/userview',
    'canopsis/core/controller/widget',
    'canopsis/core/lib/contextsregistry',
    'canopsis/core/lib/inflections',
    'canopsis/core/lib/factories/mixin',
    'canopsis/core/lib/factories/form',
    'canopsis/core/lib/promisesmanager',
    'canopsis/core/lib/factories/widget',
    'canopsis/core/lib/helpers/partialslot',
    'canopsis/core/lib/loaders/forms',
    'canopsis/core/lib/loaders/helpers',
    'canopsis/core/lib/loaders/mixins',
    'canopsis/core/lib/loaders/validators',
    'canopsis/core/lib/loaders/schemas',
    'canopsis/core/lib/requirejsmocksmanager',
    'canopsis/core/lib/utils/actions',
    'canopsis/core/lib/utils/data',
    'canopsis/core/lib/utils/dates',
    'canopsis/core/lib/utils/forms',
    'canopsis/core/lib/helpers/widgetslot',
    'canopsis/core/lib/utils/routes',
    'canopsis/core/lib/utils/widgets',
    'canopsis/core/lib/utils/debug',
    'canopsis/core/lib/utils/modelsolve',
    'canopsis/core/lib/utils/values',
    'canopsis/core/lib/utils/slug',
    'canopsis/core/lib/widgetsregistry',
    'canopsis/core/lib/abstractclassregistry',
    'canopsis/core/lib/utilityclass',
    'canopsis/core/lib/mixinsregistry',
    'canopsis/core/lib/searchmethodsregistry',
    'canopsis/core/lib/schemasregistry',
    'canopsis/core/lib/wrappers/console',
    'canopsis/core/mixins/consolemanager',
    'canopsis/core/mixins/inspectablearray',
    'canopsis/core/mixins/inspectableitem',
    'canopsis/core/mixins/loadingindicator',
    'canopsis/core/mixins/metaserializer',
    'canopsis/core/mixins/notifications',
    'canopsis/core/mixins/promisemanager',
    'canopsis/core/mixins/requirejsmocksmanager',
    'canopsis/core/mixins/schemamanager',
    'canopsis/core/mixins/screentoolstatusmenu',
    'canopsis/core/mixins/userprofilestatusmenu',
    'canopsis/core/mixins/validation',
    'canopsis/core/mixins/validationfield',
    'canopsis/core/mixins/hashserializer',
    'canopsis/core/mixins/embeddedrecordserializer',
    'canopsis/core/mixins/documentation',
    'canopsis/core/mixins/criticitylevels',
    'canopsis/core/routes/application',
    'canopsis/core/routes/authenticated',
    'canopsis/core/routes/index',
    'canopsis/core/routes/userview',
    'canopsis/core/serializers/application',
    'canopsis/core/serializers/eventlog',
    'canopsis/core/serializers/loggedaccount',
    'canopsis/core/serializers/userview',
    'canopsis/core/serializers/widget',
    'canopsis/core/serializers/widgetwrapper',
    'canopsis/core/view/application',
    'canopsis/core/view/editor',
    'canopsis/core/view/formwrapper',
    'canopsis/core/view/listline',
    'canopsis/core/view/mixineditdropdown',
    'canopsis/core/view/partialslot',
    'canopsis/core/view/recordinfopopup',
    'canopsis/core/view/tabledraggableth',
    'canopsis/core/view/userview',
    'canopsis/core/view/validationtextarea',
    'canopsis/core/view/validationtextfield',
    'canopsis/core/view/widget',
    'canopsis/core/view/widgetslot',
    'canopsis/runtime.conf',
    'css3-mediaqueries',
    'math',
    'canopsis/core/lib/utils/hash',
    'canopsis/core/lib/externals/mousetrap/mousetrap.min',
    'jsonselect',
    'canopsis/core/lib/externals/jquery-resize/jquery.ba-resize.min',
    'link!canopsis/core/lib/externals/ionicons/css/ionicons.min.css',
], function() {
});
