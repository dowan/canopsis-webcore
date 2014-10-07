#!/usr/bin/env python
# --------------------------------
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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis.  If not, see <http://www.gnu.org/licenses/>.
# ---------------------------------

from bottle import get, delete, put, post

from canopsis.common.ws import route
from canopsis.perfdata.manager import PerfData

import logging


manager = PerfData()
logger = logging.getLogger('webserver')


@route(post, payload=['metric_id', 'timewindow', 'period'])
def perfdata_count(metric_id, timewindow=None, period=None):

    result = manager.count(
        metric_id=metric_id, timewindow=timewindow, period=period)

    return result


@route(
    post,
    payload=[
        'metric_id', 'with_meta',
        'limit', 'skip',
        'timewindow', 'period', 'timeserie'
    ])
def perfdata(
    metric_id, timewindow=None, period=None, with_meta=True,
    limit=0, skip=0, timeserie=None
):

    if not isinstance(metric_id, list):
        metrics = [metric_id]

    else:
        metrics = metric_id

    result = []

    for metric_id in metrics:
        ret = manager.get(
            metric_id=metric_id, period=period, with_meta=with_meta,
            timewindow=timewindow, limit=limit, skip=skip)

        if timeserie is not None:

            _points = ret[0] if with_meta else ret
            ret = timeserie.calculate(_points, timewindow=timewindow)

        if with_meta:
            result.append({
                "points": ret[0],
                "length": ret[1]
            })

        else:
            result.append({
                "points": ret,
                "length": len(ret)
            })

    if len(result) == 1:
        if with_meta:
            result = (result[0]['points'], result[0]['length'])

        else:
            result = result[0]

    else:
        result = (result, len(result))

    return result


@route(post, payload=['timewindow', 'limit', 'sort'])
def perfdata_meta(metric_id, timewindow=None, limit=0, sort=None):

    result = manager.get_meta(
        metric_id=metric_id, timewindow=timewindow, limit=limit, sort=sort)

    return result


@route(put, payload=['metric_id', 'points', 'meta', 'period'])
def perfdata(metric_id, points, meta=None, period=None):

    manager.put(metric_id=metric_id, points=points, meta=meta, period=period)

    result = points

    return result


@route(delete, payload=['metric_id', 'period', 'with_meta', 'timewindow'])
def perfdata(metric_id, period=None, with_meta=False, timewindow=None):

    manager.remove(
        metric_id=metric_id, period=period, with_meta=with_meta,
        timewindow=timewindow)

    result = None

    return result


@route(put, payload=['metric_id', 'meta', 'timestamp'])
def perfdata_meta(metric_id, meta, timestamp=None):

    result = manager.put_meta(
        metric_id=metric_id, meta=meta, timestamp=timestamp)

    return result


@route(get)
def perfdata_period(metric_id):

    result = manager.get_period(metric_id)

    return result


@route(get)
def perfdata_internal(metric):

    result = manager.is_internal(metric)

    return result
