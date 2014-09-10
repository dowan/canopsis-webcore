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
    'app/lib/utils/userconfiguration',
    'app/lib/utils/widgets',
    'utils'
], function($, Ember, Application, userConfiguration, widgetUtils, utils) {
    var get = Ember.get,
        set = Ember.set;

    Application.WidgetController = Ember.ObjectController.extend({

        userParams: {},

        init: function () {

            var widgetController = this;
            console.log('widget init');
            console.log('viewController', widgetUtils.getParentViewForWidget(this));
            console.log('viewController', widgetUtils.getParentViewForWidget(this).get('isMainView'));

            set(this, 'viewController', widgetUtils.getParentViewForWidget(this));
            set(this, 'isOnMainView', widgetUtils.getParentViewForWidget(this).get('isMainView'));
            //manage user configuration
            this.set('userConfiguration', userConfiguration.create({widget: this}));

            this.set("container", utils.routes.getCurrentRouteController().container);

            this.startRefresh();

            //setting default/minimal reload delay for current widget
            if (widgetController.get('refreshInterval') <= 10 || Ember.isNone(widgetController.get('refreshInterval'))) {
                widgetController.set('refreshInterval', 10);
            }

            this.refreshContent();

        },

        _partials: {},

        /**
         * Override of willmergemixin to merge mixin's partials with base partials
         */
        willMergeMixin: function(Mixin) {
            console.log('willMergeMixin', this, Mixin);

            this._super.apply(this, arguments);

            //TODO put this in arrayutils
            function union_arrays (x, y) {
                var obj = {};
                for (var i = x.length-1; i >= 0; -- i)
                    obj[x[i]] = x[i];
                for (var j = y.length-1; j >= 0; -- j)
                    obj[y[j]] = y[j];
                var res = [];
                for (var k in obj) {
                    if (obj.hasOwnProperty(k))  // <-- optional
                        res.push(obj[k]);
                }
                return res;
            }

            var me = this;

            if(Mixin.partials !== undefined) {
                Object.keys(Mixin.partials).forEach(function(key) {
                    console.log(key, Mixin.partials[key]);

                    var partialsKey = '_partials.' + key;

                    if(get(me, partialsKey) === undefined) {
                        set(me, partialsKey, Ember.A());
                    }

                    set(me, partialsKey, union_arrays(get(me, partialsKey), Mixin.partials[key]));
                });
            }
        },

        getSchema: function() {
            return Application[this.get('xtype').capitalize()].proto().categories;
        },

        onReload: function () {
            console.debug('Reload widget:', this.get('id'));

            if (this.get('widgetData.content') !== undefined) {
                //Allows widget to know how many times they have been repainted
                if (this.get('domReadyCount') === undefined) {
                    this.set('domReadyCount', 1);
                } else {
                    this.set('domReadyCount', this.get('domReadyCount') + 1);
                }
                this.onDomReady($('#' + this.get('id')));
            }
        },

        onDomReady: function() {
            console.log(this.get('title'), 'widget dom load complete');
            //To override
        },

        stopRefresh: function () {
            this.set('isRefreshable', false);
        },

        startRefresh: function () {
            this.set('isRefreshable', true);
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
                for (var i = 1; i < arguments.length; i++) {
                    params.push(arguments[i]);
                }

                this.send(action, params);
            },
            creationForm: function(itemType) {
                utils.forms.addRecord(itemType);
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

                var itemsContent = this.get('content.items.content');

                for (var i = 0, itemsContent_length = itemsContent.length; i < itemsContent_length; i++) {
                    console.log(this.get('content.items.content')[i]);
                    if (itemsContent[i].get('widget') === widget) {
                        itemsContent.removeAt(i);
                        console.log("deleteRecord ok");
                        break;
                    }
                }

                var userview = get(this, 'viewController').get('content');
                userview.save();

                console.groupEnd();
            },

            editWidgetPreferences: function (widget) {

                var widgetController = this;

                var label = "Edit your widget preferences";
                console.info(label, widget);

                var widgetWizard = utils.forms.showNew('modelform', widget, {
                    title: __(label),
                    userPreferencesOnly: true
                });
                console.log("widgetWizard", widgetWizard);

                widgetWizard.submit.then(function(form) {

                    record = form.get('formContext');
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

                    for (var i = 0; i < this.get('content.items.content').length; i++) {
                        console.log('loop', i, this.get('content.items.content')[i], widgetwrapper);
                        console.log(this.get('content.items.content')[i] === widgetwrapper);
                        if (foundElementIndex !== undefined && nextElementIndex === undefined) {
                            nextElementIndex = i;
                            console.log('next element found');
                        }

                        if (this.get('content.items.content')[i] === widgetwrapper) {
                            foundElementIndex = i;
                            console.log('searched element found');
                        }
                    }

                    if (foundElementIndex !== undefined && nextElementIndex !== undefined) {
                        //swap objects
                        var array = Ember.get(this, 'content.items.content');
                        console.log('swap objects', array);

                        var tempObject = array.objectAt(foundElementIndex);

                        array.insertAt(foundElementIndex, array.objectAt(nextElementIndex));
                        array.insertAt(nextElementIndex, tempObject);
                        array.replace(foundElementIndex + 2, 2);

                        console.log('new array', array);
                        Ember.set(this, 'content.items.content', array);

                        var userview = get(this, 'viewController').get('content');
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

                    for (var i = this.get('content.items.content').length; i >= 0 ; i--) {
                        console.log('loop', i, this.get('content.items.content')[i], widgetwrapper);
                        console.log(this.get('content.items.content')[i] === widgetwrapper);
                        if (foundElementIndex !== undefined && nextElementIndex === undefined) {
                            nextElementIndex = i;
                            console.log('next element found');
                        }

                        if (this.get('content.items.content')[i] === widgetwrapper) {
                            foundElementIndex = i;
                            console.log('searched element found');
                        }
                    }

                    console.log('indexes to swap', foundElementIndex, nextElementIndex);

                    if (foundElementIndex !== undefined && nextElementIndex !== undefined) {
                        //swap objects
                        var array = Ember.get(this, 'content.items.content');
                        console.log('swap objects', array);

                        var tempObject = array.objectAt(foundElementIndex);

                        array.insertAt(foundElementIndex, array.objectAt(nextElementIndex));
                        array.insertAt(nextElementIndex, tempObject);
                        array.replace(nextElementIndex + 2, 2);

                        console.log('new array', array);
                        Ember.set(this, 'content.items.content', array);

                        var userview = widgetUtils.getParentViewForWidget(this).get('content');
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
                return this.get("itemType").capitalize();
            }
        }.property("itemType"),

        refreshContent: function() {
            this._super();

            this.findItems();
        },

        findItems: function() {
            console.warn("findItems not implemented");
        },

        extractItems: function(queryResult) {
            console.log("extractItems", queryResult);

            this._super(queryResult);

            this.set("widgetData", queryResult);
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

    return Application.WidgetController;
});
