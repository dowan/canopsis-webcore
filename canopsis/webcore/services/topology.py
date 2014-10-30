# -*- coding: utf-8 -*-
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
from canopsis.topology.manager import Topology


def exports(ws):
    manager = Topology()

    @route(get)
    def topology(ids=None, add_nodes=True):
        # converts possible [] into None
        if not ids:
            ids = None

        return manager.get(ids=ids, add_nodes=add_nodes)

    @route(post, payload=('ids', 'add_nodes'))
    def topology(ids=None, add_nodes=True):
        # converts possible [] into None
        if not ids:
            ids = None

        return manager.get(ids=ids, add_nodes=add_nodes)

    @route(get)
    def topology_find(regex=None, add_nodes=False):
        return manager.find(regex=regex, add_nodes=add_nodes)

    @route(put, payload='topology')
    def topology(topology=None):
        manager.put(topology=topology)
        return topology

    @route(delete)
    def topology(ids=None):
        manager.remove(ids=ids)
        return ids

    @route(get)
    def topology_nodes(topology_id=None, ids=None):
        return manager.get_nodes(topology_id=topology_id, ids=ids)

    @route(post, payload=['topology_id', 'ids'])
    def topology_nodes(topology_id=None, ids=None):
        return manager.get_nodes(topology_id=topology_id, ids=ids)

    @route(get)
    def topology_nodes_find(entity_id=None):
        return manager.find_nodes_by_entity_id(entity_id=entity_id)

    @route(delete)
    def topology_nodes(ids=None):
        manager.remove_nodes(ids=ids)
        return ids

    @route(put, payload='topology_node')
    def topology_node(topology_node):
        manager.put_node(topology_node=topology_node)
        return topology_node
