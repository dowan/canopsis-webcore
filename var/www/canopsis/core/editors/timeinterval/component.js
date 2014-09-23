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
    'app/application'
], function(Ember, Application) {

    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        init: function () {

            this._super.apply(this, arguments);

            set(this, 'durationType', 'duration');

            if (Ember.isNone(get(this, 'content'))) {
                set(this, 'content',
                    {
                        startDate: 0,
                        stopDate: 0
                    }
                );
            }

        },

        onUpdate: function () {

            console.log('on update timeinterval editor content', get(this, 'content'));

        }.observes('content'),

        updateDelayDuration: function (delay, referer) {

            var content = get(referer, 'content');

            var now = parseInt(new Date().getTime() / 1000);

            content.startDate = now - delay;

            set(referer, 'content', content);

            console.log('updateDelayDuration', content);
        },

        updateStartDuration: function (startDate, referer) {

            var content = get(referer, 'content');

            content.startDate = startDate;

            set(referer, 'content', content);

            console.log('updateDelayDuration', content);

        },

        updateStopDuration: function (stopDate, referer) {

            var content = get(referer, 'content');

            var now = parseInt(new Date().getTime() / 1000);

            content.stopDate = stopDate;

            set(referer, 'content', content);

            console.log('updateDelayDuration', content);
        },

        isDurationType: function (){

            var test = get(this, 'durationType') === 'duration';

            console.log('Duration type is now', get(this, 'durationType') , test);

            return test;

        }.property('durationType'),

        actions: {
            switchDurationType: function () {
                if(get(this, 'durationType') === 'duration'){
                    set(this, 'durationType', 'interval');
                } else {
                    set(this, 'durationType', 'duration');
                }

                console.log('switching duration type', get(this,'durationType'));
            }
        }
    });

    Application.ComponentTimeintervalComponent = component;

    return component;
});
