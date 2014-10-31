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
    'ember'
], function(Ember) {

    var __ = Ember.String.loc;

    var dates = {

        getNow: function() {
            return parseInt(new Date().getTime() / 1000);
        },

        getStringNow: function(format, shortDate) {
            return dates.timestamp2String(dates.getNow(), format, shortDate);
        },

        timestamp2String: function (value, format, shortDate) {
            function addZero(i) {
                return (i < 10 ? '0'+ i +'' : i +'');
            }

            var a = new Date(value*1000);
            var months = [
                __("January"),
                __("February"),
                __("March"),
                __("April"),
                __("May"),
                __("June"),
                __("July"),
                __("August"),
                __("September"),
                __("October"),
                __("November"),
                __("December")
            ];
            if (!Ember.isNone(shortDate)) {
                months = [
                    __("Jan"),
                    __("Feb"),
                    __("Mar"),
                    __("Apr"),
                    __("May"),
                    __("June"),
                    __("July"),
                    __("Aug"),
                    __("Sep"),
                    __("Oct"),
                    __("Nov"),
                    __("Dec")
                ];

            }
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = addZero(a.getDate());
            var hour = addZero(a.getHours());
            var min = addZero(a.getMinutes());
            var sec = addZero(a.getSeconds());
            var time = "";

            switch(format) {
                case 'f':
                    time = [date, month, year].join(' ') + ' ' + [hour, min, sec].join(':') ;
                    break;
                case 'r':
                    time = [date, addZero(a.getMonth()), year].join('/') + ' <br>' + [hour, min, sec].join(':') ;
                    break;

                case 'timeOnly':
                    time = [hour, min, sec].join(':') ;
                    break;

                default:
                    time = [date, month, year].join(' ') + ' ' + [hour, min, sec].join(':') ;
                    break;
            }
            return time;
        },

        //bottom is not used yet
        locale: 'fr',
        months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
        days: ['Monday', 'Thuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

        setLang: function (lang) {
            dates.locale = lang;
            if (lang === 'fr') {
                dates.month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Octobre', 'Novembre', 'Décembre'];
                dates.days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
            }
        },

        dateFormat:'YYYY/MM/DD',

        diffDate: function(d1,d2,u) {
            div = 1;

            switch(u) {
                case 's':
                    div=1000;
                    break;
                case 'm':
                    div=1000*60;
                    break;
                case 'h':
                    div=1000*60*60;
                    break;
                case 'd':
                    div=1000*60*60*24;
                    break;
                default:
                    break;
            }

            var Diff = d2 - d1;
            return Math.ceil((Diff/div));
        }
    };

    return dates;
});
