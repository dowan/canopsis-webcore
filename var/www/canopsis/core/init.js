// /**
//  * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
//  *
//  * This file is part of Canopsis.
//  *
//  * Canopsis is free software: you can redistribute it and/or modify
//  * it under the terms of the GNU Affero General Public License as published by
//  * the Free Software Foundation, either version 3 of the License, or
//  * (at your option) any later version.
//  *
//  * Canopsis is distributed in the hope that it will be useful,
//  * but WITHOUT ANY WARRANTY; without even the implied warranty of
//  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  * GNU Affero General Public License for more details.
//  *
//  * You should have received a copy of the GNU Affero General Public License
//  * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
//  *
//  * @module canopsis-frontend-core
//  */

// require.config({
//     paths: {
//         'css3-mediaqueries': 'canopsis/core/src/lib/externals/min/css3-mediaqueries',
//         'math': 'canopsis/core/src/lib/externals/mathjs/dist/math',
//         'hashes': 'canopsis/core/src/lib/externals/jshashes/hashes',

//         //TODO move this in uibase
//         'jsonselect': 'canopsis/core/lib/wrappers/jsonselect',
//         'ember-selectize': 'canopsis/core/lib/externals/ember-selectize/src/ember.selectize',
//         'selectize': 'canopsis/core/lib/externals/selectize/dist/js/selectize'
//     },
//      shim: {
//         'ember-selectize': {
//              deps: ['selectize']
//         }
//     }
// });

// define([
//     'hashes',
//     'app/src/lib/loaders/schemas',
//     'app/src/lib/loaders/templates',
//     'app/dist/app',
//     'canopsis/runtime.conf',
//     'css3-mediaqueries',
//     'link!canopsis/core/src/lib/externals/ion.rangeSlider/css/ion.rangeSlider.css',
//     'link!canopsis/core/src/lib/externals/ion.rangeSlider/css/ion.rangeSlider.skinHTML5.css',
//     'link!canopsis/core/src/lib/externals/ionicons/css/ionicons.min.css',
//     'link!canopsis/core/src/lib/externals/selectize/dist/css/selectize.bootstrap3.css',
//     'math'
//     // 'ember-selectize',
// ], function(Hashes, Canopsis) {
//     //TODO check if this is really useful
//     window.Hashes = Hashes;

//     window.getCanopsis = function () {
//         return Canopsis;
//     };
// });



//--------------------------------------------------------------------------

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
 *
 * @module canopsis-frontend-core
 */

require.config({
    paths: {
        'css3-mediaqueries': 'canopsis/core/src/lib/externals/min/css3-mediaqueries',
        'math': 'canopsis/core/src/lib/externals/mathjs/dist/math',
        'hashes': 'canopsis/core/src/lib/externals/jshashes/hashes',

        //TODO move this in uibase
        'jsonselect': 'canopsis/core/src/lib/wrappers/jsonselect',
        'ember-selectize': 'canopsis/core/src/lib/externals/ember-selectize/src/ember.selectize',
        'selectize': 'canopsis/core/src/lib/externals/selectize/dist/js/selectize'
    },
     shim: {
        'ember-selectize': {
             deps: ['selectize']
        }
    }
});

define([
    'hashes',
    'app/src/lib/loaders/schemas',
    'app/src/lib/loaders/templates',
    'app/src/controller/application',
    'app/src/controller/form',
    'app/src/controller/formwrapper',
    'app/src/controller/login',
    'app/src/controller/partialslotablecontroller',
    'app/src/controller/perfdata',
    'app/src/controller/recordinfopopup',
    'app/src/controller/serie',
    'app/src/controller/userview',
    'app/src/controller/widget',
    'app/src/lib/abstractclassregistry',
    'app/src/lib/contextsregistry',
    'app/src/lib/externals/console.js/console',
    'app/src/lib/externals/ion.rangeSlider/js/ion.rangeSlider',
    'app/src/lib/externals/jquery-resize/jquery.ba-resize.min',
    'app/src/lib/externals/jsonselect/src/jsonselect',
    'app/src/lib/externals/mousetrap/mousetrap.min',
    'app/src/lib/factories/form',
    'app/src/lib/factories/mixin',
    'app/src/lib/factories/widget',
    'app/src/lib/factories/wrapper',
    'app/src/lib/formsregistry',
    'app/src/lib/inflections',
    'app/src/lib/mixinsregistry',
    'app/src/lib/schemasregistry',
    'app/src/lib/promisesmanager',
    'app/src/lib/widgetsregistry',
    'app/src/lib/actionsregistry',
    'app/src/lib/indexesregistry',
    'app/src/lib/promisesmanager',
    'app/src/lib/requirejsmocksmanager',
    'app/src/lib/searchmethodsregistry',
    'app/src/lib/utilityclass',
    'app/src/lib/utils/actions',
    'app/src/lib/utils/data',
    'app/src/lib/utils/dates',
    'app/src/lib/utils/debug',
    'app/src/lib/utils/dom',
    'app/src/lib/utils/drag',
    'app/src/lib/utils/event',
    'app/src/lib/utils/filterObject',
    'app/src/lib/utils/forms',
    'app/src/lib/utils/hash',
    'app/src/lib/utils/indexes',
    'app/src/lib/utils/modelsolve',
    'app/src/lib/utils/notification',
    'app/src/lib/utils/routes',
    'app/src/lib/utils/slug',
    'app/src/lib/utils/values',
    'app/src/lib/utils/widgets',
    'app/src/lib/utils/widgetSelectors',
    'app/src/lib/wrappers/console',
    'app/src/lib/wrappers/ionicons',
    'app/src/lib/wrappers/mousetrap',
    'app/src/mixins/consolemanager',
    'app/src/mixins/criticitylevels',
    'app/src/mixins/documentation',
    'app/src/mixins/embeddedrecordserializer',
    'app/src/mixins/hashserializer',
    'app/src/mixins/inspectablearray',
    'app/src/mixins/inspectableitem',
    'app/src/mixins/loadingindicator',
    'app/src/mixins/metaserializer',
    'app/src/mixins/notifications',
    'app/src/mixins/promisemanager',
    'app/src/mixins/requirejsmocksmanager',
    'app/src/mixins/schemamanager',
    'app/src/mixins/screentoolstatusmenu',
    'app/src/mixins/userprofilestatusmenu',
    'app/src/mixins/validation',
    'app/src/mixins/validationfield',
    'app/src/routes/application',
    'app/src/routes/authenticated',
    'app/src/routes/index',
    'app/src/routes/userview',
    'app/src/serializers/application',
    'app/src/serializers/loggedaccount',
    'app/src/serializers/userview',
    'app/src/serializers/widget',
    'app/src/serializers/widgetwrapper',
    'app/src/validators/mail/validator',
    'app/src/validators/maxItems/validator',
    'app/src/validators/minItems/validator',
    'app/src/validators/number/validator',
    'app/src/validators/required/validator',
    'app/src/validators/rights/validator',
    'app/src/validators/validate/validator',
    'app/src/view/application',
    'app/src/view/arraytocollectioncontrol',
    'app/src/view/editor',
    'app/src/view/formwrapper',
    'app/src/view/listline',
    'app/src/view/mixineditdropdown',
    'app/src/view/partialslot',
    'app/src/view/recordinfopopup',
    'app/src/view/tabledraggableth',
    'app/src/view/userview',
    'app/src/view/validationtextarea',
    'app/src/view/validationtextfield',
    'app/src/view/widget',
    'app/src/view/widgetslot',
    'app/src/components/editor/component',
    'app/src/components/renderer/component',
    'app/src/components/wrapper/component',
    'app/src/forms/modelform/controller',
    'app/src/forms/widgetform/controller',
    'app/src/forms/confirmform/controller',
    'app/src/forms/viewtreeform/controller',
    'app/src/lib/helpers/formview',
    'app/src/lib/helpers/getfield',
    'app/src/lib/helpers/i18n',
    'app/src/lib/helpers/log',
    'app/src/lib/helpers/partialslot',
    'app/src/lib/helpers/renderwidget',
    'app/src/lib/helpers/validationtextarea',
    'app/src/lib/helpers/validationtextfield',
    'app/src/lib/helpers/widgetslot',
    'app/src/mixins/validation',
    'app/src/mixins/criticitylevels',
    'canopsis/runtime.conf',
    'css3-mediaqueries',
    'link!canopsis/core/src/lib/externals/ion.rangeSlider/css/ion.rangeSlider.css',
    'link!canopsis/core/src/lib/externals/ion.rangeSlider/css/ion.rangeSlider.skinHTML5.css',
    'link!canopsis/core/src/lib/externals/ionicons/css/ionicons.min.css',
    'link!canopsis/core/src/lib/externals/selectize/dist/css/selectize.bootstrap3.css',
    'math'
    // 'ember-selectize',
], function(Hashes, Canopsis) {
    //TODO check if this is really useful
    window.Hashes = Hashes;

    window.getCanopsis = function () {
        return Canopsis;
    };
});
