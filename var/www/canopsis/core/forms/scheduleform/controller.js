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
    'app/lib/factories/form',
    'app/forms/modelform/controller'
], function(Ember, Application, FormFactory, ModelFormController) {
    var formOptions = {
        subclass: ModelFormController
    };

    var form = FormFactory('scheduleform', {
        title: 'Configure Schedule',

        actions: {
            submit: function() {
                console.group('submitSchedule');

                console.log('context:', this.formContext);

                console.groupEnd();

                this._super(arguments);
            }
        },

        partials: {
            buttons: ["formbutton-previous", "formbutton-cancel", "formbutton-submit"]
        },
    }, formOptions);

    return form;
});
