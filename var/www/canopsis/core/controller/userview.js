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
    'app/lib/utils/forms',
    'app/mixins/inspectableitem',
    'app/routes/userview',
    'app/view/userview',
    'app/serializers/userview'
], function(Ember, formUtils, InspectableItem) {

    var get = Ember.get,
        set = Ember.set,
        __ = Ember.String.loc;


    recursiveDeleteKeys = function(object, keysToRemove) {
        var objectKeys = Ember.keys(object);
        alert('recursiveDeleteKeys ' + objectKeys.length);

        for (var i = 0, li = objectKeys.length; i < li; i++) {
            var currentKey = objectKeys[i],
                currentObject = object[objectKeys[i]];

            alert(currentKey);
            if(keysToRemove.contains(currentKey)) {
                alert('delete key ' + currentKey);
                delete object[currentKey];
            } else if(Ember.isArray(currentObject)) {
                var buffer = [];

                for (var j = 0, lj = currentObject.length; j < lj; j++) {
                    buffer.pushObject(recursiveDeleteKeys(currentObject[j], keysToRemove));
                }

                object[currentKey] = recursiveDeleteKeys(object[currentKey], keysToRemove);
            } else if(typeof currentKey === 'object') {
                object[currentKey] = recursiveDeleteKeys(object[currentKey], keysToRemove);
            }
        }

        return object;
    }

    var controller = Ember.ObjectController.extend(InspectableItem, Ember.Evented, {
        needs: ['application'],

        actions: {
            insertWidget: function(containerController) {
                console.log("insertWidget", containerController);
                var widgetChooserForm = formUtils.showNew('widgetform', this);

                var userviewController = this;

                widgetChooserForm.submit.done(function(form, newWidgetWrappers) {
                    void (form);
                    var newWidgetWrapper = newWidgetWrappers[0];

                    console.log('onsubmit, adding widgetwrapper to containerwidget', newWidgetWrapper, containerController);
                    console.log('containerwidget items', get(containerController, 'content.items.content'));
                    //FIXME wrapper does not seems to have a widget
                    get(containerController, 'content.items.content').pushObject(newWidgetWrapper);

                    console.log("saving view");
                    get(userviewController, 'content').save().then(function() {
                        userviewController.trigger('refreshView');
                    });
                });

                widgetChooserForm.submit.fail(function() {
                    console.info('Widget insertion canceled');
                });
            },

            duplicateWidgetAndContent: function(widgetModel) {
                window.$F(widgetModel);
            },

            refreshView: function() {
                console.log('refresh view');
                this.trigger('refreshView');
            }
        }
    });

    loader.register('controller:userview', controller);

    return controller;
});
