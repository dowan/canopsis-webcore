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
    'app/routes/authenticated',
    'app/lib/formsregistry',
    'app/lib/loaders/templates',
    'app/lib/loaders/forms',
    'app/lib/helpers/i18n'
], function(Ember, Application, AuthenticatedRoute, formsregistry) {

    var get = Ember.get,
        set = Ember.set;

    var route = AuthenticatedRoute.extend({
        actions: {
            showView: function(id) {
                console.log("ShowView action", arguments);
                this.transitionTo('userview', id);
            },

            showEditFormWithController: function(formController, formContext, options) {
                if (formController.ArrayFields) {
                    while(formController.ArrayFields.length > 0) {
                        formController.ArrayFields.pop();
                    }
                }

                var formName = formController.get('formName');
                console.log("showEditFormWithController", formController, formName, formContext, options);

                var formwrapperController = this.controllerFor('formwrapper');
                set(formsregistry, 'formwrapper', formwrapperController);

                set(formController, 'formwrapper', formwrapperController);
                set(formController, 'formContext', formContext);
                set(formwrapperController, 'form', formController);
                set(formwrapperController, 'formName', formName);

                formwrapperController.send('show');

                return formController;
            }
        },

        model: function() {
            return {
                title: 'Canopsis'
            };
        },

        renderTemplate: function() {
            console.info('render application template');
            this.render();

            //getting the generated controller
            var formwrapperController = this.controllerFor('formwrapper');

            this.render('formwrapper', {
                outlet: 'formwrapper',
                into: 'application',
                controller: formwrapperController
            });

        }
    });

    Application.ApplicationRoute = route;

    return route;
});
