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


    Application.ComponentTimeintervalComponent = Ember.Component.extend({
        init: function () {

            this._super.apply(this, arguments);

            set(this, 'durationType', 'duration');

            if (Ember.isNone(this.get('content'))) {
                this.set('content',
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

            var content = referer.get('content');

            var now = parseInt(new Date().getTime() / 1000);

            content.startDate = now - delay;

            referer.set('content', content);

            console.log('updateDelayDuration', content);
        },

        updateStartDuration: function (startDate, referer) {

            var content = referer.get('content');

            content.startDate = startDate;

            referer.set('content', content);

            console.log('updateDelayDuration', content);

        },

        updateStopDuration: function (stopDate, referer) {

            var content = referer.get('content');

            var now = parseInt(new Date().getTime() / 1000);

            content.stopDate = stopDate;

            referer.set('content', content);

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

    return Application.ComponentTimeintervalComponent;
});
