/*
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

Ember.Application.initializer({
    name: 'JobForm',
    after: ['FormFactory', 'SchemasRegistry', 'FormsUtils', 'HashUtils', 'DataUtils'],
    initialize: function(container, application) {
        var schemasRegistry = container.lookupFactory('registry:schemas');
        var formsUtils = container.lookupFactory('utility:forms');
        var hashUtils = container.lookupFactory('utility:hash');
        var dataUtils = container.lookupFactory('utility:data');

        var FormFactory = container.lookupFactory('factory:form');

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        var form = FormFactory('jobform', {
            title: 'Select task type',
            scheduled: true,

            loggedAccountloggedaccountController: undefined,

            schemas: schemasRegistry.all,

            init: function() {
                this._super(arguments);

                set(this, 'loggedaccountController', dataUtils.getLoggedUserController());

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
                    var model = schemasRegistry.getByName(xtype).EmberModel;

                    var params = get(this, 'formContext.params');
                    console.log('params:', params);

                    if(!isNone(params) && get(params, 'xtype') === xtype) {
                        context = params;
                    }
                    else {
                        params = {
                            id: hashUtils.generateId('task'),
                            crecord_type: xtype,
                            xtype: xtype,
                            jtype: get(this, 'jtype')
                        };

                        console.log('Instanciate non-persistent model:', model, params);
                        context = get(this, 'store').createRecord(xtype, params);
                        console.log('model:', context);

                        set(this, 'formContext.task', xtype);
                        set(this, 'formContext.paramsType', xtype);
                        set(this, 'formContext.params', context);
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
            }
        });

        application.register('form:jobform', form);
    }
});
