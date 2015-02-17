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
    'jquery',
    'ember',
    'ember-data',
    'app/application',
    'app/controller/partialslotablecontroller',
    'canopsis/canopsisConfiguration',
    'app/lib/utils/widgets',
    'app/lib/utils/routes',
    'app/lib/utils/forms',
    'app/lib/utils/debug',
    'app/lib/utils/data',
    'app/view/mixineditdropdown'
], function($, Ember, DS, Application, PartialslotAbleController, canopsisConfiguration, widgetUtils, routesUtils, formsUtils, debugUtils, dataUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var controller = PartialslotAbleController.extend({
        needs: ['application', 'login'],

        /**
         * This is useful mostly for debug, to know that a printend object is a widget
         */
        abstractType: 'widget',

        canopsisConfiguration: canopsisConfiguration,
        debug: Ember.computed.alias('canopsisConfiguration.DEBUG'),

        editMode : Ember.computed.alias('controllers.application.editMode'),

        init: function () {

            set(this, 'userParams', {});

            console.log('widget init');

            var viewId = get(widgetUtils.getParentViewForWidget(this), 'content.id');
            var container = routesUtils.getCurrentRouteController().container;
            var store = DS.Store.create({
                container: container
            });

            console.debug('View id for current widget is ', viewId);
            this.setProperties({
                'model.controllerInstance': this,
                'viewId': viewId,
                'viewController': widgetUtils.getParentViewForWidget(this),
                'isOnMainView': get(widgetUtils.getParentViewForWidget(this), 'isMainView'),
                'container': container,
                'widgetDataStore': store
            });

            //User preference are called just before the refresh to ensure
            //refresh takes care of user information and widget general preference is overriden
            //All widget may not have this mixin, so it's existance is tested
            if (!isNone(this.loadUserConfiguration)) {
                this.loadUserConfiguration();
            }

            console.debug('user configuration loaded for widget ' + get(this, 'title'));
            this.refreshContent();
        },

        mixinsOptionsReady: function () {
            //can be overriden to trigger action when mixins options ready.
        },

        addMixinView: function (viewMixin) {
            /**
                Adds mixins view to the current widget controller
            **/
            var viewMixins = get(this, 'viewMixins');
            if (isNone(viewMixins)) {
                viewMixins = [];
                set(this, 'viewMixins', viewMixins);
            }
            viewMixins.push(viewMixin);
        },

        updateInterval: function (interval) {
            console.warn('This method should be overriden for current widget', get(this, 'id'), interval);
        },

        getSchema: function() {
            return Application[get(this, 'xtype').capitalize()].proto().categories;
        },

        stopRefresh: function () {
            set(this, 'isRefreshable', false);
        },

        startRefresh: function () {
            this.setProperties({
                'isRefreshable': true,
                'lastRefresh': null
            });
        },

        isRollbackable: function() {
            if(get(this, 'isDirty') && get(this, 'dirtyType') === 'updated' && get(this, 'rollbackable') === true) {
                return true;
            }

            return false;
        }.property('isDirty', 'dirtyType', 'rollbackable'),


        actions: {
            /**
             * Show debug info in console and put widget var in window.$E
             */
            inspect: function (widget) {
                debugUtils.inspectObject(widget);
            },

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
                console.info('edit widget', widget);

                var widgetWizard = formsUtils.showNew('modelform', widget, { title: __('Edit widget') });
                console.log('widgetWizard', widgetWizard);

                var widgetController = this;

                widgetWizard.submit.done(function() {
                    console.log('record going to be saved', widget);

                    if(!get(widget, 'widgetId')) {
                        set(widget, 'widgetId', get(widget,'id'));
                    }

                    var userview = get(widgetController, 'viewController').get('content');

                    userview.save().then(function(){
                        get(widgetController, 'viewController').send('refresh');
                        console.log('triggering refresh', userview);
                    });
                });
            },

            editMixin: function (widget, mixinName) {
                console.info('edit mixin', widget, mixinName);

                var mixinDict = get(widget, 'mixins').findBy('name', mixinName),
                    mixinModelInstance = dataUtils.getStore().createRecord(mixinName, mixinDict);

                var mixinForm = formsUtils.showNew('modelform', mixinModelInstance, { title: __('Edit mixin'), inspectedItemType: mixinName });

                var mixinObject = get(widget, 'mixins').findBy('name', mixinName);

                console.log('mixinObject', mixinObject);

                var widgetController = this;

                mixinForm.submit.done(function() {
                    var referenceModel = Application[mixinName.capitalize()];
                    var modelAttributes = get(referenceModel, 'attributes');

                    console.log('attributes', modelAttributes);

                    modelAttributes.forEach(function(property) {
                        console.log('each', arguments);
                        var propertyValue = get(mixinModelInstance, property.name);
                        console.log('mixinObject', mixinObject);

                        set(mixinObject, property.name, propertyValue);
                        console.log(widget.get('mixins'));

                        var userview = get(widgetController, 'viewController').get('content');
                        userview.save().then(function(){
                            get(widgetController, 'viewController').send('refresh');
                            console.log('triggering refresh', userview);
                        });
                    });
                });
            },


            /**
             * Deletes the widget from its parents saves the view, and refresh it
             */
            removeWidget: function (widget) {
                console.group('remove widget', widget);
                console.log('parent container', this);

                var itemsContent = get(this, 'content.items.content');

                for (var i = 0, l = itemsContent.length; i < l; i++) {
                    console.log(get(this, 'content.items.content')[i]);

                    if (get(itemsContent[i], 'widget') === widget) {
                        itemsContent.removeAt(i);
                        console.log('deleteRecord ok');
                        break;
                    }
                }

                var widgetController = this,
                    userview = get(this, 'viewController.content');

                userview.save().then(function() {
                    get(widgetController, 'viewController').send('refresh');
                });

                console.groupEnd();
            },

            /**
             * Moves the widget under the next one, if any
             */
            movedown: function(widgetwrapper) {
                console.group('movedown', widgetwrapper);

                try{
                    console.log('context', this);

                    var foundElementIndex,
                        nextElementIndex,
                        itemsContent = get(this, 'content.items.content');

                    for (var i = 0, l = itemsContent.length; i < l; i++) {

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

                        var widgetController = this,
                            userview = get(this, 'viewController.content');

                        userview.save().then(function() {
                            get(widgetController, 'viewController').send('refresh');
                        });
                    }
                } catch (e) {
                    console.error(e.stack, e.message);
                }
                console.groupEnd();
            },

            /**
             * Moves the widget above the previous one, if any
             */
            moveup: function(widgetwrapper) {
                console.group('moveup', widgetwrapper);

                try{
                    console.log('context', this);

                    var foundElementIndex,
                        nextElementIndex,
                        itemsContent = get(this, 'content.items.content');

                    for (var i = itemsContent.length; i >= 0 ; i--) {

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

                        var widgetController = this,
                            userview = get(widgetUtils.getParentViewForWidget(this), 'content');

                        userview.save().then(function() {
                            get(widgetController, 'viewController').send('refresh');
                        });
                    }
                } catch (e) {
                    console.error(e.stack, e.message);
                }
                console.groupEnd();
            },

        },

        config: Ember.computed.alias('content'),

        itemController: function() {
            if(get(this, 'itemType')) {
                return get(this, 'itemType').capitalize();
            }
        }.property('itemType'),

        refreshContent: function() {

            console.log('refreshContent', get(this, 'xtype'));

            this._super();
            this.findItems();

            this.setProperties({
                'lastRefresh': new Date().getTime(),
                'lastRefreshControlDelay': true
            });
        },

        findItems: function() {
            console.warn('findItems not implemented', this);
        },

        extractItems: function(queryResult) {
            console.log('extractItems', queryResult);

            this._super(queryResult);

            set(this, 'widgetData', queryResult);
        },

        availableTitlebarButtons: function(){
            var buttons = get(this, '_partials.titlebarsbuttons');

            if(buttons === undefined) {
                return Ember.A();
            }

            var res = Ember.A();

            for (var i = 0, l = buttons.length; i < l; i++) {
                var currentButton = buttons[i];

                if(Ember.TEMPLATES[currentButton] !== undefined) {
                    res.pushObject(currentButton);
                } else {
                    //TODO manage this with utils.problems
                    console.warn('template not found', currentButton);
                }
            }

            return res;
        }.property()
    });

    loader.register('controller:widget', controller);

    return controller;
});
