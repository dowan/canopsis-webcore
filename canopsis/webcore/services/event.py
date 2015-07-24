# -*- coding: utf-8 -*-
# --------------------------------
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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis.  If not, see <http://www.gnu.org/licenses/>.
# ---------------------------------

from canopsis.common.utils import ensure_iterable
from canopsis.common.ws import route
from canopsis import schema

from bottle import HTTPError
import requests
import json
import datetime
import time


def exports(ws):
    @route(ws.application.post, name='event', payload=['event', 'url'])
    @route(ws.application.put, name='event', payload=['event', 'url'])
    def send_event(event, url=None):
        if ws.enable_crossdomain_send_events and url is not None:
            payload = {
                'event': json.dumps(event)
            }

            response = requests.post(url, data=payload)

            if response.status_code != 200:
                api_response = json.loads(response.text)

                return (api_response['data'], api_response['total'])

            else:
                return HTTPError(response.status_code, response.text)

        else:
            events = ensure_iterable(event)
            exchange = ws.amqp.exchange_name_events

            for event in events:
                if schema.validate(event, 'cevent'):
                    sname = 'cevent.{0}'.format(event['event_type'])

                    if schema.validate(event, sname):
                        if event['event_type'] == 'eue':
                            sname = 'cevent.eue.{0}'.format(
                                event['type_message']
                            )

                            if not schema.validate(event, sname):
                                continue

                        rk = '{0}.{1}.{2}.{3}.{4}'.format(
                            event['connector'],
                            event['connector_name'],
                            event['event_type'],
                            event['source_type'],
                            event['component']
                        )

                        if event['source_type'] == 'resource':
                            rk = '{0}.{1}'.format(rk, event['resource'])

                        ws.amqp.publish(event, rk, exchange)

            return events

    def get_timeperiod_occurence(tstart, tstop, granularity='days', number=1):
        """ give an array with each day period of the timewindow
            :param tstart: timestamp of the begin timewindow
            :param tstop: timestamp of the end timewindow
            :param granularity: occurence period
            (seconds, minutes, days, months, years)
            :return: array of timestamp period
            :rtype: list
        """
        dstart = datetime.date.fromtimestamp(tstart)
        dstop = datetime.date.fromtimestamp(tstop)
        day = datetime.timedelta(granularity=number)

        result = []

        while dstart < dstop:

            calendarday = {}
            calendarday['begin'] = time.mktime(dstart.timetuple())
            dstart += day
            calendarday['end'] = time.mktime(dstart.timetuple())

            result.append(calendarday)

        return result

    @route(ws.application.get,
           name='eventslog/count',
           payload=['tstart', 'tstop', 'limit', 'filter']
           )
    def get_event_count_for_period(tstart, tstop, limit=100, filter=None):
        """ give eventslog count for every days in the given period
        """
        result = []

        result = get_timeperiod_occurence(tstart, tstop)

        return result

        """results = []
        for date in timezone:
            new_eventfilter = {}
                new_eventfilter['$and'] = eventfilter['$or']

                selection = {}
                selection['$gte'] = date['begin']
                selection['$lte'] = date['end']

                timestamp_selection = {}
                timestamp_selection['timestamp'] = selection

                new_eventfilter['$and'].append(timestamp_selection)

                params['filter'] = new_eventfilter

                nrecords = get_records(
                    ws, namespace,
                    ctype=ctype,
                    _id=_id,
                    **params
                )
                records = []

                results.append(nrecords)
                records = results

            return records, results"""
