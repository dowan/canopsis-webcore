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
    'app/application',
    'app/lib/factories/form',
    'utils',
    'app/lib/utils/forms',
    'app/lib/utils/hash',
    'app/lib/schemasregistry',
    'app/serializers/job'
], function(Ember, Application, FormFactory, utils, formsUtils, hashUtils, schemasRegistry) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var form = FormFactory('jobform', {
        title: 'Select task type',
        scheduled: true,

        schemas: schemasRegistry.all,

        init: function() {
            this._super(arguments);

            set(this, 'store', DS.Store.create({
                container: get(this, "container")
            }));

            var job_types = [];
            console.log('availableJobs CP', get(this, 'schemas'));
            for(var sname in get(this, 'schemas')) {
                if(sname.indexOf('task') === 0 && sname.length > 4) {
                    job_types.pushObject({
                        name: sname.slice(4),
                        value: sname
                    });
                }
            }

            set(this, 'availableJobs', { all : job_types, byClass: {}});
        },

        actions: {
            selectItem: function(jobName) {
                console.group('selectJob', this, jobName);

                var context;
                var availableJobs = get(this, 'availableJobs.all');

                var job;
                for (var i = 0, l = availableJobs.length; i < l; i++) {
                    if(availableJobs[i].name === jobName) {
                        job = availableJobs[i];
                    }
                }

                var xtype = job.value;
                var modelname = xtype[0].toUpperCase() + xtype.slice(1);
                var model = Application[modelname];

                var params = get(this, 'formContext.params');
                console.log('params:', params);

                if(!isNone(params) && get(params, 'xtype') === xtype) {
                    context = params;
                }
                else {
                    params = {
                        id: hashUtils.generateId('task'),
                        crecord_type: xtype,
                        xtype: xtype
                    };

                    console.log('Instanciate non-persistent model:', model, params);
                    context = get(this, 'store').createRecord(xtype, params);
                    console.log('model:', context);

                    var jobdict = get(this, 'formContext._data');
                    jobdict.task = xtype;
                    jobdict.paramsType = xtype;
                    jobdict.params = context;

                    job = this.get('store').push('job', jobdict);
                    this.formContext.rollback();
                    this.formContext = job;
                }

                console.log('Show new form with context:', context, this.formContext);
                var recordWizard = formsUtils.showNew('taskform', context, {
                    formParent: this,
                    scheduled: get(this, 'scheduled')
                });

                console.groupEnd();
            }
        },

        partials: {
            buttons: ["formbutton-cancel"]
        },
    });

    return form;
});
