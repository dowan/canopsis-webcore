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
    'utils'
], function(Ember, Application, FormFactory, cutils) {

    FormFactory('jobform', {
        title: 'Select task type',

        availableJobs: function() {
            var job_types = [];

            for(var sname in cutils.schemaList) {
                if(sname.indexOf('Task.') === 0) {
                    job_types.pushObject({
                        name: sname.slice(10),
                        value: sname
                    });
                }
            }

            return job_types;
        }.property('Canopsis.utils.schemaList'),

        actions: {
            selectJob: function(job) {
                console.group('selectJob', this, job.name);

                var modelname = job.value.slice(5);
                this.formContext.task = modelname;

                modelname = modelname[0].toUpperCase() + modelname.slice(1);

                var model = Application[modelname];

                console.log('Instanciate non-persistent model:', model);
                var context = model._create(this.get('content'));
                context.xtype = modelname;

                console.log('Show new form with context:', context);
                cutils.forms.showNew('taskform', context, {
                    formParent: this
                });

                console.groupEnd();
            }
        },

        partials: {
            buttons: ["formbutton-cancel"]
        },
    });

    return Application.JobformController;
});
