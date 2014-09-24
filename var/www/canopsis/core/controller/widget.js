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
    'jquery',
    'ember',
    'app/application',
    'app/controller/partialslotablecontroller',
    'app/lib/utils/userconfiguration',
    'app/lib/utils/widgets',
    'app/lib/utils/routes',
    'app/lib/utils/forms',
    'utils',

], function($, Ember, Application, PartialslotAbleController, userConfiguration, widgetUtils, routesUtils, formsUtils, utils) {
    var get = Ember.get,
        set = Ember.set;

    var controller = PartialslotAbleController.extend({

        userParams: {},

        init: function () {


            console.log('widget init');

            get(this, 'model').set('controllerInstance', this);

            console.log('viewController', widgetUtils.getParentViewForWidget(this));
            console.log('viewController', get(widgetUtils.getParentViewForWidget(this), 'isMainView'));

            set(this, 'viewController', widgetUtils.getParentViewForWidget(this));
            set(this, 'isOnMainView', get(widgetUtils.getParentViewForWidget(this), 'isMainView'));
            //manage user configuration
            set(this, 'userConfiguration', userConfiguration.create({widget: this}));

            set(this, "container", routesUtils.getCurrentRouteController().container);

            this.startRefresh();

            //setting default/minimal reload delay for current widget
            if (get(this, 'refreshInterval') <= 10 || Ember.isNone(get(this, 'refreshInterval'))) {
                set(this, 'refreshInterval', 10);
            }

            this.refreshContent();

        },

        updateInterval: function (interval){
            console.warn('This method should be overriden for current widget', get(this, 'id'), interval);
        },

        getSchema: function() {
            return Application[get(this, 'xtype').capitalize()].proto().categories;
        },

        onReload: function () {
            console.debug('Reload widget:', get(this, 'id'));

            if (get(this, 'widgetData.content') !== undefined) {
                //Allows widget to know how many times they have been repainted
                if (get(this, 'domReadyCount') === undefined) {
                    set(this, 'domReadyCount', 1);
                } else {
                    set(this, 'domReadyCount', get(this, 'domReadyCount') + 1);
                }

                this.onDomReady($('#' + get(this, 'id')));
            }
        },

        onDomReady: function() {
            console.log(get(this, 'title'), 'widget dom load complete');
            //To override
        },

        stopRefresh: function () {
            set(this, 'isRefreshable', false);
        },

        startRefresh: function () {
            set(this, 'isRefreshable', true);
        },

        isRollbackable: function() {
            if(get(this, 'isDirty') && get(this, 'dirtyType') === "updated" && get(this, 'rollbackable') === true) {
                return true;
            }

            return false;

        }.property('isDirty', 'dirtyType', 'rollbackable'),


        actions: {
            do: function(action) {
                var params = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    params.push(arguments[i]);
                }

                this.send(action, params);
            },
            creationForm: function(itemType) {
                formsUtils.addRecord(itemType);
            },

            rollback: function(widget){
                console.log('rollback changes', arguments);
                widget.rollback();
                set(this, 'rollbackable', false);
            },

            editWidget: function (widget) {
                console.info("edit widget", widget);

                var widgetWizard = utils.forms.showNew('modelform', widget, { title: __("Edit widget") });
                console.log("widgetWizard", widgetWizard);

                var widgetController = this;

                widgetWizard.submit.done(function() {
                    console.log('record going to be saved', widget);

                    var userview = get(widgetController, 'viewController').get('content');
                    userview.save();
                    console.log("triggering refresh");
                    widgetController.trigger('refresh');
                });
            },

            removeWidget: function (widget) {
                console.group("remove widget", widget);
                console.log("parent container", this);

                var itemsContent = get(this, 'content.items.content');

                for (var i = 0, l = itemsContent.length; i < l; i++) {
                    console.log(get(this, 'content.items.content')[i]);
                    if (get(itemsContent[i], 'widget') === widget) {
                        itemsContent.removeAt(i);
                        console.log("deleteRecord ok");
                        break;
                    }
                }

                var userview = get(this, 'viewController.content');
                userview.save();

                console.groupEnd();
            },

            editWidgetPreferences: function (widget) {

                var widgetController = this;

                var label = "Edit your widget preferences";
                console.info(label, widget);

                var widgetWizard = formsUtils.showNew('modelform', widget, {
                    title: __(label),
                    userPreferencesOnly: true
                });
                console.log("widgetWizard", widgetWizard);

                widgetWizard.submit.then(function(form) {

                    record = get(form, 'formContext');
                    console.log('user param record', record);
                    //widgetController.set('userParams.filters', widgetController.get('filters'));
                    //widgetController.get('userConfiguration').saveUserConfiguration();

                    widgetController.trigger('refresh');
                });
            },

            movedown: function(widgetwrapper) {
                console.group('movedown', widgetwrapper);
                try{
                    console.log('context', this);

                    var foundElementIndex,
                        nextElementIndex;


                    var itemsContent = get(this, 'content.items.content');

                    for (var i = 0, l = itemsContent.length; i < l; i++) {
                        console.log('loop', i, itemsContent[i], widgetwrapper);
                        console.log(itemsContent[i] === widgetwrapper);
                        if (foundElementIndex !== undefined && nextElementIndex === undefined) {
                            nextElementIndex = i;
                            console.log('next element found');
                        }

                        if (itemsContent[i] === widgetwrapper) {
                            foundElementIndex = i;
                            console.log('searched element found');
                        }
                    }

                    if (foundElementIndex !== undefined && nextElementIndex !== undefined) {
                        //swap objects
                        var array = itemsContent;
                        console.log('swap objects', array);

                        var tempObject = array.objectAt(foundElementIndex);

                        array.insertAt(foundElementIndex, array.objectAt(nextElementIndex));
                        array.insertAt(nextElementIndex, tempObject);
                        array.replace(foundElementIndex + 2, 2);

                        console.log('new array', array);
                        set(this, 'content.items.content', array);

                        var userview = get(this, 'viewController.content');
                        userview.save();
                    }
                } catch (e) {
                    console.error(e.stack, e.message);
                }
                console.groupEnd();
            },

            moveup: function(widgetwrapper) {
                console.group('moveup', widgetwrapper);

                try{
                    console.log('context', this);

                    var foundElementIndex,
                        nextElementIndex;

                    var itemsContent = get(this, 'content.items.content');

                    for (var i = itemsContent.length; i >= 0 ; i--) {
                        console.log('loop', i, itemsContent[i], widgetwrapper);
                        console.log(itemsContent[i] === widgetwrapper);

                        if (foundElementIndex !== undefined && nextElementIndex === undefined) {
                            nextElementIndex = i;
                            console.log('next element found');
                        }

                        if (itemsContent[i] === widgetwrapper) {
                            foundElementIndex = i;
                            console.log('searched element found');
                        }
                    }

                    console.log('indexes to swap', foundElementIndex, nextElementIndex);

                    if (foundElementIndex !== undefined && nextElementIndex !== undefined) {
                        //swap objects
                        var array = get(this, 'content.items.content');
                        console.log('swap objects', array);

                        var tempObject = array.objectAt(foundElementIndex);

                        array.insertAt(foundElementIndex, array.objectAt(nextElementIndex));
                        array.insertAt(nextElementIndex, tempObject);
                        array.replace(nextElementIndex + 2, 2);

                        console.log('new array', array);
                        set(this, 'content.items.content', array);

                        var userview = get(widgetUtils.getParentViewForWidget(this), 'content');
                        userview.save();
                    }
                } catch (e) {
                    console.error(e.stack, e.message);
                }
                console.groupEnd();
            },

        },

        config: Ember.computed.alias("content"),

        itemController: function() {
            if(get(this, 'itemType')) {
                return get(this, 'itemType').capitalize();
            }
        }.property('itemType'),

        refreshContent: function() {
            this._super();

            this.findItems();
        },

        findItems: function() {
            console.warn('findItems not implemented');
        },

        extractItems: function(queryResult) {
            console.log("extractItems", queryResult);

            this._super(queryResult);

            set(this, "widgetData", queryResult);
        },

        availableTitlebarButtons: function(){
            var buttons = get(this, 'partials.titlebarsbuttons');
            console.log("availableTitlebarPartialButtons CP");

            if(buttons === undefined) {
                return Ember.A();
            }

            var res = Ember.A();

            for (var i = 0, l = buttons.length; i < l; i++) {
                var currentButton = buttons[i];

                if(Ember.TEMPLATES[currentButton] !== undefined) {
                    res.push(currentButton);
                } else {
                    //TODO manage this with utils.problems
                    console.warn('template not found', currentButton);
                }
            }

            return res;
        }.property()
    });

    Application.WidgetController = controller;

    return controller;
});
