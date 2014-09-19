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
    'ember-data',
    'app/application',
    'app/lib/utils/forms',
    'app/lib/formsmanager',
    'utils'
], function(Ember, DS, Application, formsUtils, formsmanager, utils) {

    var component = Ember.Component.extend({
        job_types: [],
        job_type: undefined,
        job_params: {},

        init: function() {
            this._super(arguments);

            this.job_types = [];

            for(var sname in utils.schemaList) {
                if(sname.indexOf('Task.') === 0) {
                    this.job_types.pushObject({
                        name: sname.slice(10),
                        value: sname
                    });
                }
            }

            this.job_type = this.job_types[0].value;
        },

        actions: {
            configure: function() {
                var job_type = this.get('job_type');
                var modelname = job_type.slice(5);
                modelname = modelname[0].toUpperCase() + modelname.slice(1);

                var model = Application[modelname];

                console.log('Instanciate non-persistent model:', model);
                var context = model._create(this.get('content'));

                console.log('Show new form with context:', context);
                formsUtils.showNew('modelform', context, {
                    formParent: formsmanager.formwrapper.form
                });
            }
        }
    });

    Application.ComponentJobeditorComponent = component;

    return component;
});
