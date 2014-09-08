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
	"app/lib/widgetsmanager",
	"app/lib/loaders/schema-manager"
], function(Application, WidgetController, WidgetsManager) {

	/**
	 * Widget factory. Creates a controller, stores it in Application
	 * @param widgetName {string} the name of the new widget. lowercase
	 * @param classdict {dict} the controller dict
	 * @param options {dict} options :
	 *			- subclass: to handle widget's controller inheritance: default is WidgetController
	 *			- templateName: to use another template in the editor
	 *
	 * @author Gwenael Pluchon <info@gwenp.fr>
	 */
	function Widget(widgetName, classdict, options) {
		console.group("widget factory call", arguments);

		var extendArguments = [];

		if (options === undefined) {
			options = {};
		}

		if (options.subclass === undefined) {
			options.subclass = WidgetController;
		}

		if (options.mixins !== undefined) {
			for (var i = 0; i < options.mixins.length; i++) {
				extendArguments.push(options.mixins[i]);
			}
		}

		extendArguments.push(classdict);

		var widgetControllerName = widgetName.camelize().capitalize() + "Controller";
		console.log("extendArguments", extendArguments);
		console.log("subclass", options.subclass);

		Application[widgetControllerName] = options.subclass.extend.apply(options.subclass, extendArguments);

		console.log("widget", widgetControllerName, Application[widgetControllerName], Application);
		var metadataDict = Application[widgetName.camelize().capitalize()].proto().metadata;

		console.log("metadataDict", widgetName, metadataDict);

		var registryEntry = Ember.Object.create({
			name: widgetName,
			EmberClass: Application[widgetControllerName]
		});

		if(metadataDict) {
			if(metadataDict.icon) {
				registryEntry.set('icon', metadataDict.icon);
			}
			if(metadataDict.classes) {
				var classes = metadataDict.classes;
				for (var i = 0, l = classes.length; i < l; i++) {
					var currentClass = classes[i];
					if(!Ember.isArray(WidgetsManager.byClass.get(currentClass))) {
						WidgetsManager.byClass.set(currentClass, Ember.A());
					}

					WidgetsManager.byClass.get(currentClass).pushObject(registryEntry)
				}
			}
		}


		WidgetsManager.all.pushObject(registryEntry);

		console.groupEnd();

		return Application[widgetControllerName];
	}

	return Widget;
});