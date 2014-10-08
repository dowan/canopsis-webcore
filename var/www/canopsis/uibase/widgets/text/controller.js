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
    'app/lib/factories/widget',
    'app/lib/loaders/schemas'
], function(WidgetFactory) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var count = 0;

    var TextViewMixin = Ember.Mixin.create({
        didInsertElement: function () {
            set(this, 'controller.viewElementId', get(this, 'elementId'));
            this._super.apply(this, arguments);
        },

        willDestroyElement: function () {
            this.controller.unloadGeneratedTemplate();
            this._super.apply(this, arguments);
        }
    });

    var widget = WidgetFactory('text', {
        viewMixins: [
            TextViewMixin
        ],

        generatedTemplateName: function() {
            var viewElementId = get(this, 'viewElementId');

            var template = get(this, 'html');
            var templateName = 'dynamic-' + viewElementId;
            console.log('setting dynamic template for widget', templateName, this);
            var tpl = Ember.Handlebars.compile(template);
            set(Ember.TEMPLATES, templateName, tpl);

            return templateName;
        }.property('viewElementId'),

        unloadGeneratedTemplate: function() {
            var generatedTemplateName = get(this, 'generatedTemplateName');
            if(isNone(generatedTemplateName)) {
                console.warn('no generated template found while destroying view', this);
                return;
            }

            console.log('destroying generated template', generatedTemplateName);
            delete Ember.TEMPLATES[generatedTemplateName];
        }
    });

    return widget;
});
