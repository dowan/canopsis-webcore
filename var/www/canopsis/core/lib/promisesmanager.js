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

define(['ember'], function(Ember) {
    var get = Ember.get,
        set = Ember.set;

    var PromiseManager = Ember.Object.extend({
        all: [],

        pending: Ember.A(),
        errors: Ember.A(),

        pendingCount: 0,
        errorsCount: 0,

        byClass: {},

        handlePromise: function(promise) {
            Ember.run.schedule('sync', this, function() {
                console.log('manage promise', promise);
                this.all.pushObject(promise);
                this.pending.pushObject(promise);
                this.set('pendingCount', this.pendingCount + 1);
            });
        },

        promiseSuccess: function(promise) {
            console.info('promise success', promise);
        },

        promiseFail: function(promise) {
            if(promise._detail !== undefined && promise._detail.status === 200) {
                console.warn('promise failed with error code 200, assuming it\'s a success');
                this.promiseSuccess(promise);
            } else {
                Ember.run.schedule('sync', this, function() {
                    console.error('promise failed', promise);
                    this.get('errors').pushObject(promise);
                    this.set('errorsCount', this.errorsCount + 1);
                });
            }
        },

        promiseFinally: function (promise) {
            Ember.run.schedule('sync', this, function() {
                console.log('finally');
                this.get('pending').removeObject(promise);
                this.set('pendingCount', this.pendingCount - 1);
            });
        }
    });


    return PromiseManager.create();
});
