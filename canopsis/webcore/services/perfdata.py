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

from canopsis.common.ws import apply_routes
from canopsis.perfdata.utils import PerfDataInterface


iface = PerfDataInterface()


def exports(ws):
    apply_routes([
        {
            'method': ws.application.post,
            'name': 'perfdata/count',
            'params': {
                'payload': ['metric_id', 'timewindow']
            },
            'handler': iface.count
        },
        {
            'method': ws.application.post,
            'name': 'perfdata',
            'params': {
                'payload': [
                    'metric_id', 'with_meta',
                    'limit', 'skip', 'period',
                    'timewindow', 'period', 'timeserie'
                ]
            },
            'handler': iface.get
        },
        {
            'method': ws.application.post,
            'name': 'perfdata/meta',
            'params': {
                'payload': ['timewindow', 'limit', 'sort']
            },
            'handler': iface.meta
        },
        {
            'method': ws.application.put,
            'name': 'perfdata',
            'params': {
                'payload': ['metric_id', 'points', 'meta']
            },
            'handler': iface.put
        },
        {
            'method': ws.application.delete,
            'name': 'perfdata',
            'params': {
                'payload': ['metric_id', 'with_meta', 'timewindow']
            },
            'handler': iface.remove
        },
        {
            'method': ws.application.put,
            'name': 'perfdata/meta',
            'params': {
                'payload': ['metric_id', 'meta', 'timestamp']
            },
            'handler': iface.manager.put_meta
        },
        {
            'method': ws.application.get,
            'name': 'perfdata/period',
            'params': {},
            'handler': iface.manager.get_period
        },
        {
            'method': ws.application.get,
            'name': 'perfdata/internal',
            'params': {},
            'handler': iface.manager.is_internal
        }
    ])
