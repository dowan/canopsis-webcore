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

define([
    'jsonselect'
], function() {

    if(window.appShouldNowBeLoaded !== true) {
        console.error('Application module is required too early, and it is probably leading to bad application behaviour and errors. Please do NOT require "app/application" in your modules.');
    }

    var Application = Ember.Application.create({
        LOG_ACTIVE_GENERATION: false,
        LOG_TRANSITIONS: false,
        LOG_TRANSITIONS_INTERNAL: false,
        LOG_VIEW_LOOKUPS: false,
        LOG_BINDINGS: true,
        rootElement: '#applicationdiv'
    });

    Application.deferReadiness();

    Application.Router.map(function() {
        this.resource('userview', { path: '/userview/:userview_id' });
    });

    loader.setApplication(Application);

    Ember.Application.initializer({
        name: 'AppLaunch',
        after: ['DataUtils', 'InflexionsRegistry'],
        initialize: function(container, application) {
            var dataUtils = container.lookupFactory('utility:data');
            var inflectionsManager = container.lookupFactory('registry:inflexions');

            dataUtils.setEmberApplicationSingleton(Application);
            inflectionsManager.loadInflections();
        }
    });

    Ember.Application.initializer({
        name:"RESTAdaptertransforms",
        after: "transforms",
        initialize: function(container, application) {
            void (container);
            application.register('transform:array', DS.ArrayTransform);
            application.register('transform:integer', DS.IntegerTransform);
            application.register('transform:object', DS.ObjectTransform);
        }
    });
    Application.advanceReadiness();
    window.$A = Application;


    return Application;
});
