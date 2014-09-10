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

from bottle import get, delete, put

from canopsis.common.ws import response, route
from canopsis.topology.manager import TopologyManager

manager = TopologyManager()


@route(get)
def topology(ids=None, add_nodes=True):

    if not ids:
        ids = None

    topology = manager.get(ids=ids, add_nodes=add_nodes)

    result = response(topology)

    return result


@route(get)
def topology_find(regex=None, add_nodes=False):

    topologies = manager.find(regex=regex, add_nodes=add_nodes)

    result = response(topologies)

    return result


@route(put)
def topology(topology=None):

    manager.put(topology=topology)

    result = response(topology)

    return result


@route(delete)
def delete(ids=None):

    manager.remove(ids=ids)

    result = response(ids)

    return result


@route(get)
def topology_nodes(ids=None):

    nodes = manager.get_nodes(ids=ids)

    result = response(nodes)

    return result


@route(get)
def topology_nodes_by_entities_id(entity_id):

    nodes = manager.find_nodes_by_entity_id(entity_id=entity_id)

    result = response(nodes)

    return result
