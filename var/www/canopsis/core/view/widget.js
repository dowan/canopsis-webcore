/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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
    'app/application',
    'canopsis/canopsisConfiguration',
    'app/lib/mixinsregistry',
    'app/lib/widgetsregistry',
    'app/controller/widget',
    'app/lib/loaders/mixins'
], function(Ember, Application, canopsisConfiguration, mixinsregistry, widgetsregistry, WidgetController) {

    var get = Ember.get,
        set = Ember.set;

    function computeMixinsArray(view, widget) {
        var mixinsNames = get(widget, 'mixins');

        var mixinArray = [];

        console.log('computeMixinsArray', mixinsNames, widget);

        var mixinOptions = {};

        if(mixinsNames) {

            for (var i = 0, l = mixinsNames.length; i < l; i++) {
                var currentName = mixinsNames[i];

                //DEPRECATE handle progressive deprecation of mixins as strings
                if(typeof currentName === 'string') {
                    Ember.deprecate('Defining mixins as strings is deprecated. The new format is : \'{ name: "mixinName" }\'. This is required by the mixin options system.');
                } else {
                    currentName = currentName.name.camelize();
                }

                mixinOptions[currentName] = mixinsNames[i];

                var currentClass = get(Application, currentName.capitalize() + 'Mixin');
                console.log('find mixin', currentName, currentClass);

                //merge mixin's userpreferences into the userpref model
                var mixinModel = get(Application, currentName.capitalize());
                if(mixinModel !== undefined) {
                    var mixinUserPreferenceModel = mixinModel.proto().userPreferencesModel;

                    console.log('mixinModel', mixinUserPreferenceModel);
                    var mixinUserPreferenceModelAttributes = get(mixinUserPreferenceModel, 'attributes');
                    console.log('mixinModelAttributes', mixinUserPreferenceModelAttributes);

                    mixinUserPreferenceModelAttributes.forEach(function(item) {
                        widget.userPreferencesModel[item.name] = mixinUserPreferenceModel[item.name];
                        widget.userPreferencesModel.attributes.add(item);
                    });
                }

                if(currentClass) {
                    mixinArray.pushObject(currentClass);
                } else {
                    get(view, 'displayedErrors').pushObject('mixin not found : ' + currentName);
                    console.error('mixin not found', currentName);
                }
            }
            var controller = view.get('controller');

            if(controller.onMixinsApplied) {
                controller.onMixinsApplied();
            }
        }

        mixinArray.pushObject(Ember.Evented);

        return {array: mixinArray, mixinOptions: mixinOptions};
    }


    var view = Ember.View.extend({
        templateName:'widget',
        classNames: ['widget'],

        /**
         * Used to visually display error messages to the user (in the widget template)
         */
        errorMessages : Ember.A(),
        widgetController: undefined,

        init: function() {
            console.group('widget initialisation :', get(this.widget, "xtype"), this.widget, get(this, 'widget.tagName'));
            set(this, 'target', get(this, 'controller'));

            this._super();

            set(this, 'displayedErrors', Ember.A());

            if (!! get(this, 'widget')) {
                this.intializeController(this.widget);
                this.applyAllViewMixins();
            } else {
                console.error("No correct widget found for view", this);
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

            console.groupEnd();
        },

        applyAllViewMixins: function(){
            var controller = get(this, 'controller');
            console.group('apply widget view mixins', controller.viewMixins);
            if(controller.viewMixins !== undefined) {
                for (var i = 0, mixinsLength = controller.viewMixins.length; i < mixinsLength; i++) {
                    var mixinToApply = controller.viewMixins[i];

                    console.log('mixinToApply', mixinToApply);

                    if(mixinToApply.mixins[0].properties.init !== undefined) {
                        console.warn('The mixin', mixinToApply, 'have a init method. This practice is not encouraged for view mixin as they are applied at runtime and the init method will not be triggerred');
                    }

                    mixinToApply.apply(this);
                }
            }
            console.groupEnd();
        },

        intializeController: function(widget) {
            console.group('set controller for widget', widget);

            this.setProperties({
                'controller': this.instantiateCorrectController(widget),
                'templateName': get(widget, "xtype")
            });

            this.registerHooks();
            console.groupEnd();
        },

        instantiateCorrectController: function(widget) {
            //for a widget that have xtype=widget, controllerName=WidgetController
            console.log('instantiateCorrectController', arguments);
            var xtype = get(widget, "xtype");
            if(xtype === undefined || xtype === null) {
                console.error('no xtype for widget', widget, this);
            }

            var mixins = computeMixinsArray(this, widget);

            mixins.array.pushObject({
                model: widget,
                target: get(this, 'target')
            });

            var widgetControllerInstance;

            var widgetClass = widgetsregistry.getByName(get(widget, "xtype"));

            if(widgetClass !== undefined) {
                widgetClass = widgetClass.EmberClass;
            } else {
                widgetClass = WidgetController;
            }

            widgetControllerInstance = widgetClass.createWithMixins.apply(widgetClass, mixins.array);
            widgetControllerInstance.refreshPartialsList();

            Ember.setProperties(widgetControllerInstance, {
                'model.displayedErrors': get(this, 'displayedErrors'),
                'mixinOptions': mixins.mixinOptions
            });

            widgetControllerInstance.mixinsOptionsReady();

            var mixinsName = widget._data.mixins;

            if (mixinsName) {
                for (var i = 0, l = mixinsName.length; i < l ; i++ ){
                    var currentName =  mixinsName[i];
                    var currentMixin = mixinsregistry.all[currentName];

                    if (currentMixin) {
                        currentMixin.apply(widgetControllerInstance);
                    }
                }
            }

            return widgetControllerInstance;
        },

        didInsertElement : function() {
            console.log("inserted widget, view:", this);

            this.registerHooks();
            var result = this._super.apply(this, arguments);

            return result;
        },

        willDestroyElement: function () {
            clearInterval(get(this, 'widgetRefreshInterval'));

            this.unregisterHooks();

            return this._super.apply(this, arguments);
        },

        //Controller -> View Hooks
        registerHooks: function() {
            console.log("registerHooks", get(this, "controller"), get(this, "controller").on);
            get(this, "controller").on('refresh', this, this.rerender);
            return this._super();
        },

        unregisterHooks: function() {
            get(this, "controller").off('refresh', this, this.rerender);
            return this._super();
        },

        rerender: function() {
            console.info('refreshing widget');
            this._super.apply(this, arguments);
        }

    });


    loader.register('view:widget', view);

    return view;
});
