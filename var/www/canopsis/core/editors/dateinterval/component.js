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
    'utils',
    'daterangepicker'
], function(Ember, Application, utils) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({

        init: function () {
            this._super.apply(this, arguments);
            set(this, 'id', utils.hash.generate_GUID());
        },

        didInsertElement: function (){
            var datepickerComponent = this;

            var daterangepicker = this.$('#' + get(this, 'id'));

            daterangepicker.daterangepicker(
                {
                    timePickerIncrement: 5,
                    timePicker: true,
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                        'Last 7 Days': [moment().subtract('days', 6), moment()],
                        'Last 30 Days': [moment().subtract('days', 29), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                    },
                    startDate: moment().subtract('days', 29),
                    endDate: moment()
                },
                function(start, end, label) {
                    set(datepickerComponent, 'label', label);
                    var startTimestamp = parseInt(new Date(start).getTime() / 1000);
                    var stopTimestamp = parseInt(new Date(end).getTime() / 1000);
                    console.log('startTimestamp', startTimestamp, 'stopTimestamp', stopTimestamp);

                    if (startTimestamp === stopTimestamp) {
                        console.log('We are on the same day, let compute the start of the day');
                        var startDateOfTheDay = new Date(start);
                        startDateOfTheDay.setHours(0);
                        startDateOfTheDay.setMinutes(0);
                        startDateOfTheDay.setSeconds(0);
                        startDateOfTheDay.setMilliseconds(0);
                        startTimestamp = parseInt(startDateOfTheDay.getTime() / 1000);
                        console.log('NEW -> startTimestamp',startTimestamp,'stopTimestamp',stopTimestamp);
                    }

                    //Translate result into mongo form filter
                    filter = {};
                    //we ve got an interval
                    var timestamp = {};
                    var hasLimit = false;

                    if (startTimestamp) {
                        timestamp.$gte = startTimestamp;
                        hasLimit = true;

                    }

                    if (stopTimestamp) {
                        timestamp.$lte = stopTimestamp;
                        hasLimit = true;
                    }

                    if (hasLimit) {
                        filter = {'timestamp': timestamp};
                    } else {
                        filter = {};
                    }

                    set(datepickerComponent, 'content', filter);

                    console.log(get(datepickerComponent, 'content'));
                }
            );
        }
    });

    Application.ComponentDateintervalComponent = component;

    return component;
});
