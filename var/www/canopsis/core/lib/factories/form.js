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
    'app/application',
    'app/controller/form',
    "app/lib/formsregistry",
    'app/view/form'
], function(Application, FormController, formsregistry, FormView) {

    var get = Ember.get,
        set = Ember.set;

    /**
     * Form factory. Creates a controller, stores it in Application
     * @param formName {string} the name of the new form. lowercase
     * @param classdict {dict} the controller dict
     * @param options {dict} options :
     *            - subclass: to handle form's controller inheritance: default is FormController
     *            - templateName: to use another template in the editor
     *
     * @author Gwenael Pluchon <info@gwenp.fr>
     */
    function Form(formName, classdict, options) {

        console.tags.add('factory');

        console.group("form factory call", arguments);

        var extendArguments = [];

        if (options === undefined) {
            options = {};
        }

        if (options.subclass === undefined) {
            options.subclass = FormController;
        }

        if (options.mixins !== undefined) {
            for (var i = 0, l = options.mixins.length; i < l; i++) {
                extendArguments.push(options.mixins[i]);
            }
        }

        set(classdict, 'formName', formName);

        extendArguments.push(classdict);

        Ember.assert('formName must be a string', typeof formName === 'string');

        var formControllerName = formName.camelize().capitalize() + "Controller";
        var formViewName = formName.camelize().capitalize() + "View";
        console.log("extendArguments", extendArguments);
        console.log("subclass", options.subclass);

        Application[formViewName] = FormView.extend();
        Application[formControllerName] = options.subclass.extend.apply(options.subclass, extendArguments);

        formsregistry.all[formName] = {
            EmberClass: Application[formControllerName]
        };

        console.groupEnd();
        console.tags.remove('factory');

        return Application[formControllerName];
    }

    return Form;
});
