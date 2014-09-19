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
], function(Ember, Application, FormFactory, utils) {
    var get = Ember.get,
        set = Ember.set;

    FormFactory('jobform', {
        title: 'Select task type',
        scheduled: true,

        availableJobs: function() {
            var job_types = [];

            for(var sname in utils.schemaList) {
                if(sname.indexOf('Task.') === 0) {
                    job_types.pushObject({
                        name: sname.slice(9),
                        value: sname
                    });
                }
            }

            return { all : job_types, byClass: {}};
        }.property('utils.schemaList'),

        init: function() {
            this._super(arguments);

            this.set('store', DS.Store.create({
                container: this.get("container")
            }));
        },

        actions: {
            selectItem: function(jobName) {
                console.group('selectJob', this, jobName);

                var context;
                var availableJobs = get(this, 'availableJobs.all');

                var job;
                for (var i = 0; i < availableJobs.length; i++) {
                    if(availableJobs[i].name === jobName) {
                        job = availableJobs[i];
                    }
                }

                var xtype = job.value.slice(5);
                var modelname = xtype[0].toUpperCase() + xtype.slice(1);
                var model = Application[modelname];

                var params = this.get('formContext.params');
                console.log('params:', params);

                if(params && params.get('xtype') === xtype) {
                    context = params;
                }
                else {
                    params = {
                        id: utils.hash.generateId('task'),
                        crecord_type: xtype,
                        xtype: xtype
                    };

                    console.log('Instanciate non-persistent model:', model, params);
                    context = this.get('store').createRecord(xtype, params);

                    var jobdict = this.get('formContext._data');
                    jobdict.task = xtype;
                    jobdict.paramsType = xtype;
                    jobdict.params = params.id;

                    job = this.get('store').push('job', jobdict);
                    this.formContext.rollback();
                    this.formContext = job;
                }

                console.log('Show new form with context:', context, this.formContext);
                var recordWizard = utils.forms.showNew('taskform', context, {
                    formParent: this,
                    scheduled: this.scheduled
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
