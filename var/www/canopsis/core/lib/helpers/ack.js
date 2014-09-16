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
    'utils',
], function(Ember, utils) {

    Ember.Handlebars.helper('ack', function(value, crecord) {

        //displays ticket information if any onto the status field
        var ticket = crecord.get('record.ticket_declared');
        if(!Ember.isNone(ticket.timestamp)) {
            value.ticket = ['<center>',
                '<i>' + __('Date') + '</i> : <br/>',
                utils.dates.timestamp2String(value.timestamp) +' <br/> ',
                __('By') +' : ' + value.author +' <br/><br/> ',
                "</center>"
            ].join('');
        }



        value.html = ['<center>',
            '<i>' + __('Date') + '</i> : <br/>',
            utils.dates.timestamp2String(value.timestamp) +' <br/> ',
            __('By') +' : ' + value.author +' <br/><br/> ',
            '<i>'+__('Comment') +' </i> : <br/>' + value.comment,
            "</center>"].join('');

        if(value.isCancel) {
            value.color = "";
            value.title = __("Cancelled");
        } else {
            value.color = "bg-purple";
            value.title = __("Acknowleged");

        }

        return "";
    });

});
