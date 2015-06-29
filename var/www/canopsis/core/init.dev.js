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
        'css3-mediaqueries': 'canopsis/core/lib/externals/min/css3-mediaqueries',
        'math': 'canopsis/core/lib/externals/mathjs/dist/math',
        'hashes': 'canopsis/core/lib/externals/jshashes/hashes',

        //TODO move this in uibase
        'jsonselect': 'canopsis/core/lib/wrappers/jsonselect',
        'ember-selectize': 'canopsis/core/lib/externals/ember-selectize/src/ember.selectize',
        'selectize': 'canopsis/core/lib/externals/selectize/dist/js/selectize'
    },
     shim: {
        'ember-selectize': {
             deps: ['selectize']
        }
    }
});

define([
    'hashes',
    'app/lib/loaders/schemas',
    'app/lib/loaders/templates',
    'app/controller/application',
    'app/controller/form',
    'app/controller/formwrapper',
    'app/controller/login',
    'app/controller/partialslotablecontroller',
    'app/controller/perfdata',
    'app/controller/recordinfopopup',
    'app/controller/serie',
    'app/controller/userview',
    'app/controller/widget',
    'app/lib/abstractclassregistry',
    'app/lib/contextsregistry',
    'app/lib/externals/console.js/console',
    'app/lib/externals/ion.rangeSlider/js/ion.rangeSlider',
    'app/lib/externals/jquery-resize/jquery.ba-resize.min',
    'app/lib/externals/jsonselect/src/jsonselect',
    'app/lib/externals/mousetrap/mousetrap.min',
    'app/lib/factories/form',
    'app/lib/factories/mixin',
    'app/lib/factories/widget',
    'app/lib/factories/wrapper',
    'app/lib/formsregistry',
    'app/lib/inflections',
    'app/lib/mixinsregistry',
    'app/lib/promisesmanager',
    'app/lib/requirejsmocksmanager',
    'app/lib/searchmethodsregistry',
    'app/lib/utilityclass',
    'app/lib/utils/actions',
    'app/lib/utils/data',
    'app/lib/utils/dates',
    'app/lib/utils/debug',
    'app/lib/utils/dom',
    'app/lib/utils/drag',
    'app/lib/utils/event',
    'app/lib/utils/filterObject',
    'app/lib/utils/forms',
    'app/lib/utils/hash',
    'app/lib/utils/indexes',
    'app/lib/utils/modelsolve',
    'app/lib/utils/notification',
    'app/lib/utils/routes',
    'app/lib/utils/slug',
    'app/lib/utils/values',
    'app/lib/utils/widgets',
    'app/lib/utils/widgetSelectors',
    'app/lib/wrappers/console',
    'app/lib/wrappers/ionicons',
    'app/lib/wrappers/mousetrap',
    'app/mixins/consolemanager',
    'app/mixins/criticitylevels',
    'app/mixins/documentation',
    'app/mixins/embeddedrecordserializer',
    'app/mixins/hashserializer',
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
    'app/routes/application',
    'app/routes/authenticated',
    'app/routes/index',
    'app/routes/userview',
    'app/serializers/application',
    'app/serializers/loggedaccount',
    'app/serializers/userview',
    'app/serializers/widget',
    'app/serializers/widgetwrapper',
    'app/validators/mail/validator',
    'app/validators/maxItems/validator',
    'app/validators/minItems/validator',
    'app/validators/number/validator',
    'app/validators/required/validator',
    'app/validators/rights/validator',
    'app/validators/validate/validator',
    'app/view/application',
    'app/view/arraytocollectioncontrol',
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
    'app/components/editor/component',
    'app/components/renderer/component',
    'app/components/wrapper/component',
    'app/forms/modelform/controller',
    'app/forms/widgetform/controller',
    'app/forms/confirmform/controller',
    'app/forms/viewtreeform/controller',
    'app/lib/helpers/formview',
    'app/lib/helpers/getfield',
    'app/lib/helpers/i18n',
    'app/lib/helpers/log',
    'app/lib/helpers/partialslot',
    'app/lib/helpers/renderwidget',
    'app/lib/helpers/validationtextarea',
    'app/lib/helpers/validationtextfield',
    'app/lib/helpers/widgetslot',
    'app/mixins/validation',
    'app/mixins/criticitylevels',
    'canopsis/runtime.conf',
    'css3-mediaqueries',
    'link!canopsis/core/lib/externals/ion.rangeSlider/css/ion.rangeSlider.css',
    'link!canopsis/core/lib/externals/ion.rangeSlider/css/ion.rangeSlider.skinHTML5.css',
    'link!canopsis/core/lib/externals/ionicons/css/ionicons.min.css',
    'link!canopsis/core/lib/externals/selectize/dist/css/selectize.bootstrap3.css',
    'math'
    // 'ember-selectize',
], function(Hashes, Canopsis) {
    //TODO check if this is really useful
    window.Hashes = Hashes;

    window.getCanopsis = function () {
        return Canopsis;
    };
});
