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
    'app/lib/utils/dates'
], function(Ember, datesUtils) {

    var get = Ember.get,
        isNone = Ember.isNone,
         __ = Ember.String.loc;

    Ember.Handlebars.helper('ack', function(value, crecord) {

        //displays ticket information if any onto the status field
        var ticket_declared_author = get(crecord, 'record.ticket_declared_author');
        var ticket_declared_date = get(crecord, 'record.ticket_declared_date');

        var ticketNumber = get(crecord, 'record.ticket');
        var ticketDate = get(crecord, 'record.ticket_date');

        ticketNumberHtml = '';

        //Generate ticket declared html information
        if (!isNone(ticketNumber) && !isNone(ticketDate)) {
            ticketNumberHtml = [
                '<b>' + __('Ticket number') + '</b><br/>',
                datesUtils.timestamp2String(ticketDate) +' <br/> ',
                '<i>' + ticketNumber +'</i><br/> ',
            ].join('');
        }

        //Generate html display for ticket declared and ticket number when possible
        if(!isNone(ticket_declared_date) && !isNone(ticket_declared_author)) {
            value.ticket = ['<center>',
                '<b>' + __('Ticket declared') + '</b><br/>',
                datesUtils.timestamp2String(ticket_declared_date) +' <br/> ',
                __('By') +' : ' + ticket_declared_author +' <br/><br/> ',
                ticketNumberHtml,
                "</center>"
            ].join('');

        } else if (!isNone(ticketNumber) && !isNone(ticketDate)) {

            //When no ticket declared, then ticket date was saved.
            console.debug('ticket date is ', get(crecord, 'record.ticket_date'));
            var date = datesUtils.timestamp2String(get(crecord, 'record.ticket_date'));

            value.ticket = ['<center>',
                ticketNumberHtml,
                "</center>"
            ].join('');
        }



        value.html = ['<center>',
            '<b>' + __('Ack') + '</b><br/>',
            '<i>' + __('Date') + '</i> : <br/>',
            datesUtils.timestamp2String(value.timestamp) +' <br/> ',
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
