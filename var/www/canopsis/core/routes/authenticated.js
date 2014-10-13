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
    'app/controller/login',
    'app/lib/loaders/schemas'
], function(Ember, Application) {

    var route = Ember.Route.extend({

        beforeModel: function() {
            this.controllerFor('login').getUser();
        },

        actions: {
            editAndSaveModel: function(model, record_raw, callback) {
                console.log("editAndSaveModel", record_raw);

                model.setProperties(record_raw);

                var promise = model.save();

                if (callback !== undefined) {
                    promise.then(callback);
                }
            },

            addRecord: function(crecord_type, raw_record, options) {
                raw_record[crecord_type] = crecord_type;

                if (options !== undefined && options.customFormAction !== undefined) {
                    options.customFormAction(crecord_type, raw_record);
                } else {
                    var record = this.store.createRecord(crecord_type, raw_record);
                    var promise = record.save();
                    if (options !== undefined && options.callback !== undefined) {
                        promise.then(options.callback);
                    }
                }
                //send the new item via the API
                //optional callback may ba called from crecord form
            },
            error: function(reason, transition) {
                if (reason.status === 403 || reason.status === 401) {
                    this.loginRequired(transition);
                }
            }
        }
    });

    Application.AuthenticatedRoute = route;

    return route;
});
