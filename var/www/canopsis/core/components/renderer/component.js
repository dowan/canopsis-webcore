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
    'app/application',
    'app/lib/loaders/renderers'
], function(Ember, Application) {
    var get = Ember.get;

    var component = Ember.Component.extend({

        needs: ['application'],

        actions: {
            sendDisplayRecord: function (dest, action, record) {
                //This method is not ugly TODO refactor, it would be better if event bubble until application directly
                // but at the moment, event doen t bubble properly
                console.debug('sendDisplayRecord action called with params', dest, action, record);

                var template = get(dest, 'record_template');
                if (Ember.isNone(template)){
                    template = '';
                }

                console.debug('Template is ', template);

                var applicationController = get(dest, 'controllerInstance.controllers.application');


                console.log('applicationController', applicationController);

                if (!Ember.isNone(applicationController)) {
                    applicationController.showRecordWindow(record, template);
                } else {
                    console.debug('Unable to find application controller');
                }
            }
        },

        tagName: 'span',
        classNames: ['renderer'],

        value: function() {
            return get(this, 'record.' + get(this, 'attr.field'));
        }.property('attr.field', 'record'),

        rendererType: function() {

            var type = get(this, 'attr.type');
            var role = get(this, 'attr.options.role');
            if(get(this, 'attr.model.options.role')) {
                role = get(this, 'attr.model.options.role');
            }

            var rendererName;
            if (role) {
                rendererName = 'renderer-' + role;
            } else {
                rendererName = 'renderer-' + type;
            }

            if (Ember.TEMPLATES[rendererName] === undefined) {
                rendererName = undefined;
            }

            return rendererName;
        }.property('attr.type', 'attr.role')

    });

    Application.ComponentRendererComponent = component;

    return component;
});
