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
	'ember',
	'app/application'
], function(Ember, Application) {
	var get = Ember.get,
		set = Ember.set;

	Application.WidgetView = Ember.View.extend({
		templateName:'widget',
		classNames: ['widget'],

		/**
		 * Used to visually display error messages to the user (in the widget template)
		 */
		errorMessages : Ember.A(),

		init: function() {
			console.log('widget view init', this.widget.get("xtype"), this.widget, get(this, 'widget.tagName'));
			set(this, 'target', get(this, 'controller'));

			this._super();
			if (!! get(this, 'widget')) {
				this.setupController(this.widget);
				this.applyViewMixins();
			} else {
				console.error("no correct widget found for view", this);
				this.errorMessages.pushObject('No correct widget found');
			}
			if(get(this, 'widget.tagName')) {
				console.log('custom tagName', get(this, 'widget.tagName'));
				set(this, 'tagName', get(this, 'widget.tagName'));
			}

			var cssClasses = get(this, 'widget.cssClass');
			if(cssClasses) {
				console.log('custom tagName', get(this, 'widget.tagName'));
				set(this, 'classNames', cssClasses.split(','));
			}
		},

		applyViewMixins: function(){
			var controller = get(this, 'controller');
			console.group('apply widget view mixins');
			if(controller.viewMixins !== undefined) {
				for (var i = 0, mixinsLength = controller.viewMixins.length; i < mixinsLength; i++) {
					var mixinToApply = controller.viewMixins[i];

					console.log('mixinToApply', mixinToApply);
					mixinToApply.apply(this);
				}
			}
			console.groupEnd();
		},

		setupController: function(widget) {
			console.group('set controller for widget', widget);
			set(this, "controller", this.instantiateCorrectController(widget));
			set(this, "templateName", get(widget, "xtype"));
			this.registerHooks();
			console.groupEnd();
		},

		//Controller -> View Hooks
		registerHooks: function() {
			console.log("registerHooks", this.get("controller"), this.get("controller").on);
			get(this, "controller").on('refresh', this, this.rerender);
		},

		unregisterHooks: function() {
		},

		rerender: function() {
			console.info('refreshing widget');
			this._super.apply(this, arguments);
		},

		instantiateCorrectController: function(widget) {
			//for a widget that have xtype=widget, controllerName=WidgetController
			var controllerName = widget.get("xtype").capitalize() + "Controller";
			var widgetController;
			console.log("controllerName", controllerName, Application[controllerName], this.get('target'));

			if (Application[controllerName] !== undefined) {
				//var mixinClass = Application.SearchableMixin
				 widgetController =  Application[controllerName].createWithMixins(Ember.Evented, {
					content: widget,
					target: this.get('target')
				});
			} else {
				 widgetController =  Application.WidgetController.createWithMixins(Ember.Evented, {
					content: widget,
					target: this.get('target')
				});
			}

			var mixinsName = widget._data.mixins;

			if (  mixinsName  ){
				for (var i = 0 ; i < mixinsName.length ; i++ ){
					var currentName =  mixinsName[i];
					var currentMixin = Application.SearchableMixin.all[currentName];
					if ( currentMixin ){
						currentMixin.apply(widgetController);
					}
				}
			}
			return widgetController;
		},

		didInsertElement : function() {
			console.log("inserted widget, view:", this);

			this.registerHooks();
			var result = this._super.apply(this, arguments);
			this.get('controller').onReload(this.$);
			//TODO put this somewhere on list widget
			// this.$('input').iCheck({checkboxClass: 'icheckbox_minimal-grey', radioClass: 'iradio_minimal-grey'});

			return result;
		},

		willClearRender: function() {
			this.unregisterHooks();
			return this._super.apply(this, arguments);
		}

	});

	return Application.WidgetView;
});