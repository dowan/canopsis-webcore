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

from canopsis.common.ws import route
from canopsis.downtime.manager import DowntimeManager

manager = DowntimeManager()


def exports(ws):

    @route(
        ws.application.get,
        payload=['entity_ids'],
        name='/downtime/:entity_ids'
    )
    def get(entity_ids):
        """Get a downtime related to input entity id(s).

        :param entity_ids: entity id(s) bound to downtime.
        :type entity_ids: list or str
        :return: depending on entity_ids type:
            - str: one dictionary with two fields, entity_id which contains
                the entity id, and ``value`` which contains the downtime
                expression.
            - list: list of previous dictionaries.
        :rtype: list or dict
        """

        result = manager.get(entity_ids=entity_ids)

        return result

    @route(
        ws.application.post,
        payload=['entity_id', 'downtime', 'cache'],
        name='/downtimes'
    )
    @route(
        ws.application.put,
        payload=['entity_id', 'downtime', 'cache'],
        name='/downtimes'
    )
    def put(entity_id, downtime, cache=False):
        """Put a downtime related to an entity id.

        :param str entity_id: downtime entity id.
        :param str downtime: downtime value respecting icalendar format.
        :param bool cache: if True (False by default), use storage cache.
        :return: entity_id if input downtime has been putted. Otherwise None.
        :rtype: str
        """

        result = manager.put(
            entity_id=entity_id, downtime=downtime, cache=cache
        )

        if result != entity_id:
            result = None

        return result

    @route(
        ws.application.delete,
        payload=['entity_ids', 'cache'],
        name='/downtime'
    )
    def remove(entity_ids, cache=False):
        """Remove entity downtime(s) related to input entity id(s).

        :param entity_ids: downtime entity id(s).
        :type entity_ids: list or str
        :param bool cache: if True (False by default), use storage cache.
        :return: entity id(s) of removed downtime(s).
        :rtype: list
        """

        result = manager.remove(entity_ids=entity_ids, cache=cache)

        return result

    @route(
        ws.application.get,
        payload=['entity_ids', 'ts'],
        name='/downtime/isdown/:entity_ids/:ts'
    )
    def isdown(entity_ids, ts=None):
        """Check if entitie(s) is/are down ts.

        :param entity_ids: entity id(s).
        :type entity_ids: list or str
        :param long ts: timestamp to check. If None, use now.
        :return: depending on entity_ids type:
            - str: True/False if related entity is down at ts. None if entity
                ids is not in Storage.
            - list: set of (entity id: down status at ts). If entity is not
                registered in downtime, no entry is added in the result.
        :rtype: dict or bool or NoneType
        """

        result = manager.isdown(entity_ids=entity_ids, ts=ts)

        return result
