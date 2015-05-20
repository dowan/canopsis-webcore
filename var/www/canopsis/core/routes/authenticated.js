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
    'ember-data',
    'app/controller/application',
    'utils',
    'app/lib/utils/data',
    'app/controller/login',
], function(Ember, DS, ApplicationController, utils, dataUtils) {

    var get = Ember.get,
        set = Ember.set;


    var route = Ember.Route.extend({

        beforeModel: function(transition) {
            // var loginPromise = this.controllerFor('login').getUser();

            var route = this;
            var store = DS.Store.create({ container: get(this, "container") });

            //FIXME dirty, risky
            loggedaccountAdapter = getCanopsis().Application.__container__.lookup('adapter:loggedaccount');

            var loginPromise = store.findAll('loggedaccount');

            loginPromise.then(function (promiseResult) {

                var record = promiseResult.content[0];
                var loginController = route.controllerFor('login');

                set(loginController, 'record', record);

                dataUtils.setLoggedUserController(loginController);

                var appController = route.controllerFor('application');
                var enginesviews = get(appController, 'enginesviews');

                for (var i = 0, l = enginesviews.length; i < l; i++) {
                    var item = enginesviews[i];
                    //FIXME stop using utils to store data!
                    if(get(loginController, 'record._id') === "root") {
                        set(item, 'displayable', true);
                    } else {
                        viewId = item.value;
                        if (get(loginController, 'record.rights.showview_' + viewId.replace('.', '_'))) {
                            set(item, 'displayable', true);
                        } else {
                            set(item, 'displayable', false);
                        }
                    }
                }
            });

            var superPromise = this._super(transition);

            return Ember.RSVP.Promise.all([
                superPromise,
                loginPromise
            ]);
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


    loader.register('route:authenticated', route);

    return route;
});
