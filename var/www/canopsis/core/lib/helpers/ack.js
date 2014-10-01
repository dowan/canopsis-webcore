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

        var ticketNumber = crecord.get('record.ticket') || __('To be set');

        if(!Ember.isNone(ticket.timestamp)) {
            value.ticket = ['<center>',
                '<b>' + __('Ticket declared') + '</b><br/>',
                utils.dates.timestamp2String(value.timestamp) +' <br/> ',
                '<b>' + __('Ticket number') + '</b><br/>',
                '<i>' + ticketNumber +'</i><br/> ',
                __('By') +' : ' + value.author +' <br/><br/> ',
                "</center>"
            ].join('');

        } else if (!Ember.isNone(crecord.get('record.ticket'))) {

            //When no ticket declared, then ticket date was saved.
            console.debug('ticket date is ', crecord.get('record.ticket_date'));
            var date = utils.dates.timestamp2String(crecord.get('record.ticket_date'));

            value.ticket = ['<center>',
                '<b>' + __('Ticket number') + '</b><br/>',
                '<i>' + ticketNumber +'</i><br/> ',
                date +' <br/> ',
                "</center>"
            ].join('');
        }



        value.html = ['<center>',
            '<b>' + __('Ack') + '</b><br/>',
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
