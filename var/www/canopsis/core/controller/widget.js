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

define([
    'app/controller/partialslotablecontroller',
    'canopsis/canopsisConfiguration',
    'app/lib/utils/widgets',
    'app/lib/utils/routes',
    'app/lib/utils/forms',
    'app/lib/utils/debug',
    'app/lib/utils/data',
    'app/lib/schemasregistry',
    'app/view/mixineditdropdown'
], function(PartialslotAbleController, canopsisConfiguration, widgetUtils, routesUtils, formsUtils, debugUtils, dataUtils, schemasregistry, mixinsregistry) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    /**
     * @class WidgetController
     * @extends PartialslotAbleController
     * @constructor
     */
    var controller = PartialslotAbleController.extend({
        needs: ['application', 'login'],

        /**
         * This is useful mostly for debug, to know that a printend object is a widget
         *
         * @property abstractType
         * @type string
         */
        abstractType: 'widget',

        /**
         * @property canopsisConfiguration
         * @type Object
         */
        canopsisConfiguration: canopsisConfiguration,

        /**
         * @property debug
         * @type boolean
         *
         * true is the Frontend is in debug mode
         */
        debug: Ember.computed.alias('canopsisConfiguration.DEBUG'),

        /**
         * @property editMode
         * @type boolean
         */
        editMode : Ember.computed.alias('controllers.application.editMode'),

        /**
         * @property config
         * @deprecated
         * @type DS.Model
         *
         * Alias for content
         */
        config: Ember.computed.alias('content'),

        /**
         * @method init
         */
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

            this._super();

            console.debug('user configuration loaded for widget ' + get(this, 'title'));
            this.refreshContent();
        },


        /**
         * @method mixinsOptionsReady
         */
        mixinsOptionsReady: function () {
            //can be overriden to trigger action when mixins options ready.
        },

        /**
         * @method addMixinView
         * @param viewMixin
         *
         * Adds mixins view to the current widget controller
         */
        addMixinView: function (viewMixin) {
            var viewMixins = get(this, 'viewMixins');
            if (isNone(viewMixins)) {
                viewMixins = [];
                set(this, 'viewMixins', viewMixins);
            }
            viewMixins.push(viewMixin);
        },

        /**
         * @method updateInterval
         * @param interval
         */
        updateInterval: function (interval) {
            console.warn('This method should be overriden for current widget', get(this, 'id'), interval);
        },

        /**
         * @method stopRefresh
         */
        stopRefresh: function () {
            set(this, 'isRefreshable', false);
        },

        /**
         * @method startRefresh
         */
        startRefresh: function () {
            this.setProperties({
                'isRefreshable': true,
                'lastRefresh': null
            });
        },

        /**
         * @method isRollbackable
         */
        isRollbackable: function() {
            if(get(this, 'isDirty') && get(this, 'dirtyType') === 'updated' && get(this, 'rollbackable') === true) {
                return true;
            }

            return false;
        }.property('isDirty', 'dirtyType', 'rollbackable'),


        actions: {

            /**
             * @event inspect
             * @param object
             * Show debug info in console and put widget var in window.$E
             */
            inspect: function (object) {
                debugUtils.inspectObject(object);
            },

            /**
             * @event do
             * @param action
             */
            do: function(action) {
                var params = [];

                for (var i = 1, l = arguments.length; i < l; i++) {
                    params.push(arguments[i]);
                }

                this.send(action, params);
            },

            /**
             * @event creationForm
             * @param itemType
             */
            creationForm: function(itemType) {
                formsUtils.addRecord(itemType);
            },

            /**
             * @event rollback
             * @param widget
             */
            rollback: function(widget){
                console.log('rollback changes', arguments);
                set(widget, 'volatile', {});
                widget.rollback();
                set(widget, 'rollbackable', false);
            },

            /**
             * @event editWidget
             * @param widget
             */
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

            /**
             * @event editMixin
             * @param widget
             * @param mixinName
             */
            editMixin: function (widget, mixinName) {
                console.info('edit mixin', widget, mixinName);

                var mixinDict = get(widget, 'mixins').findBy('name', mixinName),
                    mixinModelInstance = dataUtils.getStore().createRecord(mixinName, mixinDict);

                var mixinForm = formsUtils.showNew('modelform', mixinModelInstance, { title: __('Edit mixin'), inspectedItemType: mixinName });

                var mixinObject = get(widget, 'mixins').findBy('name', mixinName);

                console.log('mixinObject', mixinObject);

                var widgetController = this;

                mixinForm.submit.done(function() {
                    var referenceModel = schemasregistry.getByName(mixinName).EmberModel;
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
             * @event removeWidget
             * @param widget
             */
            removeWidget: function (widget) {

                var widgetController = this;

                var confirmform = formsUtils.showNew('confirmform', {}, {
                    title: __('Delete this widget ?')
                });

                confirmform.submit.then(function(form) {


                    console.group('remove widget', widget);
                    console.log('parent container', widgetController);

                    var itemsContent = get(widgetController, 'content.items.content');

                    for (var i = 0, l = itemsContent.length; i < l; i++) {
                        console.log(get(widgetController, 'content.items.content')[i]);

                        if (get(itemsContent[i], 'widget') === widget) {
                            itemsContent.removeAt(i);
                            console.log('deleteRecord ok');
                            break;
                        }
                    }

                    var userview = get(widgetController, 'viewController.content');

                    userview.save();

                    console.groupEnd();
                });
            },

            /**
             * @event movedown
             * @param widgetwrapper
             *
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

                        userview.save();
                    }
                } catch (e) {
                    console.error(e.stack, e.message);
                }
                console.groupEnd();
            },

            /**
             * @event moveup
             * @param widgetwrapper
             *
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

                        userview.save();
                    }
                } catch (e) {
                    console.error(e.stack, e.message);
                }
                console.groupEnd();
            }
        },


        /**
         * @property itemController
         * @type string
         */
        itemController: function() {
            if(get(this, 'itemType')) {
                return get(this, 'itemType').capitalize();
            }
        }.property('itemType'),

        /**
         * @method refreshContent
         */
        refreshContent: function() {

            console.log('refreshContent', get(this, 'xtype'));

            this._super();
            this.findItems();

            this.setProperties({
                'lastRefresh': new Date().getTime(),
                'lastRefreshControlDelay': true
            });
        },

        /**
         * @method findItems
         */
        findItems: function() {
            console.warn('findItems not implemented', this);
        },

        /**
         * @method extractItems
         * @param queryResult
         */
        extractItems: function(queryResult) {
            console.log('extractItems', queryResult);

            this._super(queryResult);
            set(this, 'widgetData', queryResult);
        },

        /**
         * @property availableTitlebarButtons
         * @type array
         */
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
