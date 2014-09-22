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
from canopsis.context.manager import Context

manager = Context()


@route(get)
def context(_type, names=None, context=None, extended=None):
    if names:
        names = [n.strip() for n in names.split(',')]

    result = manager.get(
        _type=_type, names=names, context=context, extended=extended)

    return result


@route(post, payload=['limit', 'skip', 'sort', '_filter'])
def context(
    _type=None, context=None, _filter=None, extended=False,
    limit=0, skip=0, sort=None
):

    result = manager.find(
        _type=_type, context=context, _filter=_filter, extended=extended,
        limit=limit, skip=skip, sort=sort)

    return result


@route(put, payload=['_type', 'entity', 'context', 'extended_id'])
def context(_type, entity, context=None, extended_id=None):

    manager.put(
        _type=_type, entity=entity, context=context, extended_id=extended_id)

    return entity


@route(delete, payload=['context', 'ids', '_type', 'extended'])
def context(ids=None, _type=None, context=None, extended=False):

    manager.remove(ids=ids, _type=_type, context=context, extended=extended)


@route(post, payload=['entities', 'extended'])
def unify(entities, extended=False):

    result = manager.unify_entities(entities=entities, extended=extended)

    return result
