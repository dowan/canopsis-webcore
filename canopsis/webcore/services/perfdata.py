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
        (
            ws.application.post,
            'perfdata/count',
            {
                'payload': ['metric_id', 'timewindow']
            },
            iface.count
        ),
        (
            ws.application.post,
            'perfdata',
            {
                'payload': [
                    'metric_id', 'with_meta',
                    'limit', 'skip', 'period',
                    'timewindow', 'period', 'timeserie'
                ]
            },
            iface.get
        ),
        (
            ws.application.post,
            'perfdata/meta',
            {
                'payload': ['timewindow', 'limit', 'sort']
            },
            iface.meta
        ),
        (
            ws.application.put,
            'perfdata',
            {
                'payload': ['metric_id', 'points', 'meta']
            },
            iface.put
        ),
        (
            ws.application.delete,
            'perfdata',
            {
                'payload': ['metric_id', 'with_meta', 'timewindow']
            },
            iface.remove
        ),
        (
            ws.application.put,
            'perfdata/meta',
            {
                'payload': ['metric_id', 'meta', 'timestamp']
            },
            iface.manager.put_meta
        ),
        (
            ws.application.get,
            'perfdata/period',
            {},
            iface.manager.get_period
        ),
        (
            ws.application.get,
            'perfdata/internal',
            {},
            iface.manager.is_internal
        )
    ])
