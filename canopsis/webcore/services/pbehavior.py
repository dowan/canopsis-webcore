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
from canopsis.pbehavior.manager import PBehaviorManager

pbm = PBehaviorManager()

DOCS_ROUTE = 'pbehavior/docs'  #: route specifics to pbehavior document
ENTITY_ROUTE = 'pbehavior/entity'  #: route specifics to pbehavior entity


def exports(ws):

    @route(ws.application.get, name=DOCS_ROUTE)
    def get(ids):
        """Get a document related to input id(s).

        :param ids: document id(s) to get.
        :type ids: list or str
        :return: depending on ids type:
            - str: one document.
            - list: list of documents.
        :rtype: list or dict
        """

        result = pbm.get(ids)

        return result

    @route(
        ws.application.post,
        payload=['entity_ids', 'behaviors', 'start', 'end'],
        name=DOCS_ROUTE
    )
    def find(entity_ids=None, behaviors=None, start=None, end=None):
        """Find documents related to input entity id(s) and behavior(s).

        :param entity_ids:
        :type entity_ids: list or str
        :param behaviors:
        :type behaviors: list or str
        :param int start: start timestamp.
        :param int end: end timestamp.
        :return: entity documents with input behaviors.
        :rtype: list
        """

        result = pbm.find(
            entity_ids=entity_ids, behaviors=behaviors, start=start, end=end
        )

        return result

    @route(
        ws.application.put,
        payload=['_id', 'document', 'cache'],
        name=DOCS_ROUTE
    )
    def put(_id, document, cache=False):
        """Put a pbehavior document.

        :param str _id: document entity id.
        :param dict document: pbehavior document.
        :param bool cache: if True (False by default), use storage cache.
        :return: _id if input pbehavior document has been putted. Otherwise
            None.
        :rtype: str
        """

        result = pbm.put(_id=_id, document=document, cache=cache)

        return result

    @route(
        ws.application.delete, payload=['ids', 'cache'],
        name=DOCS_ROUTE
    )
    def remove(ids=None, cache=False):
        """Remove document(s) by id.

        :param ids: pbehavior document id(s). If None, remove all documents.
        :type ids: list or str
        :param bool cache: if True (False by default), use storage cache.
        :return: removed document id(s).
        :rtype: list
        """

        result = pbm.remove(ids=ids, cache=cache)

        return result

    @route(
        ws.application.get,
        payload=['entity_id', 'behaviors', 'ts', 'start', 'end'],
        name=ENTITY_ROUTE
    )
    def getending(entity_id, behaviors, ts=None, start=None, end=None):
        """Get end date of corresponding behaviors if a timestamp is in a
        behavior period.

        :param str entity_ids: entity id.
        :param behaviors: behavior(s) to check at timestamp.
        :type behaviors: list or str
        :param long ts: timestamp to check. If None, use now.
        :param int start: start timestamp.
        :param int end: end timestamp.
        :return: depending on behaviors types:
            - behaviors:
                + str: behavior end timestamp.
                + array: dict of end timestamp by behavior.
        :rtype: dict or long or NoneType
        """

        result = pbm.getending(
            entity_id=entity_id, behaviors=behaviors,
            ts=ts, start=start, end=end
        )

        return result

    @route(
        ws.application.put,
        payload=['entity_id', 'values', 'behaviors', 'cache'],
        name=ENTITY_ROUTE
    )
    def add(entity_id, values, behaviors, cache=False):
        """Add a pbehavior entry related to input entity_id and values.

        :param str entity_id: entity id.
        :param values: value(s) to add.
        :type values: str, Event or list of str/Event.
        :param behaviors: value(s) behavior(s) to add. If None, behaviors are
            retrieved from values with the PBehaviorManager.BEHAVIOR key.
        :type behaviors: list or str
        :param bool cache: if True (False by default), use storage cache.
        :return: added document ids
        :rtype: list
        """

        result = pbm.add(
            entity_id=entity_id, values=values, behaviors=behaviors,
            cache=cache
        )

        return result

    @route(
        ws.application.delete,
        payload=['entity_ids', 'cache'],
        name=ENTITY_ROUTE
    )
    def remove_by_entity(entity_ids, cache=False):
        """Remove document(s) by entity ids.

        :param entity_ids: document entity id(s) to remove.
        :type entity_ids: list or str
        :param bool cache: if True (False by default), use storage cache.
        :return: removed document id(s).
        :rtype: list
        """

        result = pbm.remove_by_entity(entity_ids=entity_ids, cache=cache)

        return result

    @route(
        ws.application.post,
        payload=['behaviors', 'ts', 'entity_ids', 'start', 'end'],
        name=ENTITY_ROUTE
    )
    def whois(behaviors, ts=None, entity_ids=None, start=None, end=None):
        """Get entities which currently have all specific behaviors.

        :param behaviors: behavior(s) to look for.
        :type behaviors: list or str
        :param int start: start timestamp.
        :param int end: end timestamp.
        :return: list of entities ids with the specified behaviors
        :rtype: list
        """

        result = pbm.whois(
            behaviors=behaviors,
            ts=ts, entity_ids=entity_ids, start=start, end=end
        )

        return result
