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
    'app/controller/widget',
    "app/lib/widgetsregistry",
    "app/serializers/userview",
    'app/lib/utils/notification',
    "app/lib/loaders/schemas"
], function(Application, WidgetController, WidgetsRegistry, UserviewSerializer, notificationUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    /**
     * Widget factory. Creates a controller, stores it in Application
     * @param widgetName {string} the name of the new widget. lowercase
     * @param classdict {dict} the controller dict
     * @param options {dict} options :
     *            - subclass: to handle widget's controller inheritance: default is WidgetController
     *            - templateName: to use another template in the editor
     *
     * @author Gwenael Pluchon <info@gwenp.fr>
     */
    function Widget(widgetName, classdict, options) {
        console.group("widget factory call", arguments);

        var extendArguments = [];

        if (options === undefined) {
            options = {};
        }

        //This option allows to manually define inheritance for widgets
        if (options.subclass === undefined) {
            options.subclass = WidgetController;
        }

        //TODO check if this is still needed, as mixins are in configuration now
        if (options.mixins !== undefined) {
            for (var i = 0, l = options.mixins.length; i < l; i++) {
                extendArguments.push(options.mixins[i]);
            }
        }

        extendArguments.push(classdict);

        var widgetControllerName = widgetName.camelize().capitalize() + "Controller";
        var widgetSerializerName = widgetName.camelize().capitalize() + "Serializer";
        var widgetModel = Application[widgetName.camelize().capitalize()];

        if(isNone(widgetModel)) {
            notificationUtils.error('No model found for the widget ' + widgetName + '. There might be no schema concerning this widget on the database');
            return;
        }

        console.log("extendArguments", extendArguments);
        console.log("subclass", options.subclass);

        Application[widgetControllerName] = options.subclass.extend.apply(options.subclass, extendArguments);

        //dynamically create an adapter that implements EmbeddedRecordMixin if a custom adapter is not already defined in Application
        if(isNone(get(Application, widgetSerializerName))) {
            Application[widgetSerializerName] = UserviewSerializer;
        }

        console.log("widget", widgetName.camelize().capitalize(), Application[widgetName.camelize().capitalize()]);
        var metadataDict = Application[widgetName.camelize().capitalize()].proto().metadata;

        console.log("metadataDict", widgetName, metadataDict);

        var registryEntry = Ember.Object.create({
            name: widgetName,
            EmberClass: Application[widgetControllerName]
        });

        if(!isNone(metadataDict)) {
            if(metadataDict.icon) {
                registryEntry.set('icon', metadataDict.icon);
            }
            if(metadataDict.classes) {
                var classes = metadataDict.classes;
                for (var j = 0, lj = classes.length; j < lj; j++) {
                    var currentClass = classes[j];
                    if(!Ember.isArray(get( WidgetsRegistry.byClass, currentClass))) {
                        set(WidgetsRegistry.byClass, currentClass, Ember.A());
                    }

                    get(WidgetsRegistry.byClass, currentClass).push(registryEntry);
                }
            }
        }


        WidgetsRegistry.all.push(registryEntry);

        console.groupEnd();

        return Application[widgetControllerName];
    }

    return Widget;
});
