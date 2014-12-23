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

from canopsis.common.ws import route
from canopsis.topology.manager import TopologyManager

manager = TopologyManager()


def exports(ws):

    @route(ws.application.get, name='topology/elts')
    @route(
        ws.application.post,
        payload=['ids', 'types', 'data', 'graph_ids', 'base_type', 'query'],
        name='topology/elts'
    )
    def get_elts(
        ids=None, types=None, graph_ids=None, data=None, base_type=None,
        query=None
    ):
        """
        Get topology element(s) related to input ids, types and query.

        :param ids: list of ids or id of element to retrieve. If None, get all
            elements. If str, get one element.
        :type ids: list or str
        :param types: topology element types to retrieve.
        :type types: list or str
        :param graph_ids: topology ids from where find elts.
        :type graph_ids: list or str
        :param data: data query
        :param dict query: element search query.
        :param str base_type: elt base type.

        :return: element(s) corresponding to input ids and query.
        :rtype: list or dict
        """

        result = manager.get_elts(
            ids=ids,
            types=types,
            graph_ids=graph_ids,
            data=data,
            base_type=base_type,
            query=query,
            serialize=False
        )

        return result

    @route(
        ws.application.delete,
        payload=['ids', 'types', 'query'],
        name='topology/elts'
    )
    def del_elts(ids=None, types=None, query=None, cache=False):
        """
        Del elements identified by input ids in removing reference before.

        :param ids: list of ids or id elements to delete. If None, delete all
            elements.
        :type ids: list or str
        :param types: element types to delete.
        :type types: list or str
        :param dict query: additional deletion query.
        :param bool cache: use query cache if True (False by default).
        """

        manager.del_elts(ids=ids, types=types, query=query)

    @route(
        ws.application.put,
        payload=['elt', 'graph_ids'],
        name='topology/elt'
    )
    def put_elt(elt, graph_ids=None, cache=False):
        """
        Put an element.

        :param dict elt: element to put.
        :type elt: dict or GraphElement
        :param str graph_ids: element topology id. None if elt is a topology.
        :param bool cache: use query cache if True (False by default).
        """

        manager.put_elt(elt=elt, graph_ids=graph_ids)

    @route(
        ws.application.delete,
        payload=['ids', 'graph_ids'],
        name='topology/content'
    )
    def remove_elts(ids, graph_ids=None, cache=False):
        """
        Remove vertices from graphs.

        :param ids: elt ids to remove from graph_ids.
        :type ids: list or str
        :param graph_ids: topology ids from where remove self.
        :type graph_ids: list or str
        """

        manager.remove_elts(ids=ids, graph_ids=graph_ids)

    @route(
        ws.application.delete,
        payload=['ids', 'vids', 'sources', 'targets'],
        name='topology/refs'
    )
    def del_edge_refs(
        ids=None, vids=None, sources=None, targets=None, cache=False
    ):
        """
        Delete references of vertices from edges.

        :param ids: edge ids to select for removing vertices links.
        :type ids: list or str
        :param vids: vertice ids to remove from edge links.
        :type vids: list or str
        :param sources: source ids to remove.
        :type sources: list or str
        :param targets: target ids to remove.
        :type targets: list or str
        """

        manager.del_edge_refs(
            ids=ids, vids=vids, sources=sources, targets=targets)

    @route(ws.application.get, name='topology/graphs')
    @route(
        ws.application.post,
        payload=[
            'ids', 'graph_ids', 'types', 'elts', 'query', 'add_elts', 'data'
        ],
        name='topology/graphs'
    )
    def get_graphs(
        ids=None, types=None, elts=None, graph_ids=None, data=None,
        query=None, add_elts=False
    ):
        """
        Get one or more graphs related to input ids, types and elts.

        :param ids: topology ids to retrieve.
        :type ids: list or str
        :param types: topology types to retrieve.
        :type types: list or str
        :param elts: elts embedded by graphs to retrieve.
        :type elts: list or str
        :param graph_ids: topology ids from where get graphs.
        :type graph_ids: list or str
        :param data: data to find among graphs.
        :param dict query: additional topology search query. Could help to search
            specific data information.
        :param bool add_elts: (False by default) add elts in the result.

        :return: topology(s) corresponding to input parameters.
        :rtype: list or Graph
        """

        result = manager.get_graphs(
            ids=ids,
            types=types,
            elts=elts,
            graph_ids=graph_ids,
            data=data,
            query=query,
            add_elts=add_elts,
            serialize=False
        )

        result = list(result)

        return result

    @route(ws.application.get, name='topology/sources')
    @route(
        ws.application.post,
        payload=[
            'ids', 'sources', 'targets',
            'graph_ids',
            'data', 'source_data', 'target_data',
            'types', 'source_types', 'target_types',
            'edge_ids', 'edge_types', 'add_edges',
            'source_edge_types', 'target_edge_types',
            'edge_data',
            'query', 'edge_query', 'source_query', 'target_query'
        ],
        name='topology/sources'
    )
    def get_sources(
        ids=None, graph_ids=None, data=None, query=None, types=None,
        edge_ids=None, add_edges=None, edge_types=None, edge_data=None,
        edge_query=None
    ):

        result = manager.get_sources(
            ids=ids,
            graph_ids=graph_ids,
            data=data,
            query=query,
            types=types,
            edge_ids=edge_ids,
            add_edges=add_edges,
            edge_types=edge_types,
            edge_data=edge_data,
            edge_query=edge_query,
            serialize=False
        )

        return result

    @route(ws.application.get, name='topology/targets')
    @route(
        ws.application.post,
        payload=[
            'ids', 'sources', 'targets',
            'graph_ids',
            'data', 'source_data', 'target_data',
            'types', 'source_types', 'target_types',
            'edge_ids', 'edge_types', 'add_edges',
            'source_edge_types', 'target_edge_types',
            'edge_data',
            'query', 'edge_query', 'source_query', 'target_query'
        ],
        name='topology/targets'
    )
    def get_targets(
        ids=None, graph_ids=None, data=None, query=None, types=None,
        edge_ids=None, add_edges=None, edge_types=None, edge_data=None,
        edge_query=None
    ):

        result = manager.get_targets(
            ids=ids,
            graph_ids=graph_ids,
            data=data,
            query=query,
            types=types,
            edge_ids=edge_ids,
            add_edges=add_edges,
            edge_types=edge_types,
            edge_data=edge_data,
            edge_query=edge_query,
            serialize=False
        )

        return result

    @route(ws.application.get, name='topology/neighbourhood')
    @route(
        ws.application.post,
        payload=[
            'ids', 'sources', 'targets',
            'graph_ids',
            'data', 'source_data', 'target_data',
            'types', 'source_types', 'target_types',
            'edge_ids', 'edge_types', 'add_edges',
            'source_edge_types', 'target_edge_types',
            'edge_data',
            'query', 'edge_query', 'source_query', 'target_query'
        ],
        name='topology/neighbourhood'
    )
    def get_neighbourhood(
        ids=None, sources=False, targets=True,
        graph_ids=None,
        data=None, source_data=None, target_data=None,
        types=None, source_types=None, target_types=None,
        edge_ids=None, edge_types=None, add_edges=False,
        source_edge_types=None, target_edge_types=None,
        edge_data=None,
        query=None, edge_query=None, source_query=None, target_query=None
    ):
        """
        Get neighbour vertices identified by context parameters.

        Sources and targets are handled in not directed edges.

        :param ids: vertice ids from where get neighbours.
        :type ids: list or str
        :param bool sources: if True (False by default) add source vertices.
        :param bool targets: if True (default) add target vertices.
        :param graph_ids: vertice topology ids.
        :type graph_ids: list or str
        :param dict data: neighbourhood data to find.
        :param dict source_data: source neighbourhood data to find.
        :param dict target_data: target neighbourhood data to find.
        :param types: vertice type(s).
        :type types: list or str
        :param types: neighbourhood types to retrieve.
        :type types: list or str
        :param source_types: neighbourhood source types to retrieve.
        :type source_types: list or str
        :param target_types: neighbourhood target types to retrieve.
        :type target_types: list or str
        :param edge_ids: edge from where find target/source vertices.
        :type edge_ids: list or str
        :param edge_types: edge types from where find target/source vertices.
        :type edge_types: list or str
        :param bool add_edges: if True (default), add pathed edges in the
            result.
        :param source_edge_types: edge types from where find source vertices.
        :type source_edge_types: list or str
        :param target_edge_types: edge types from where find target vertices.
        :type target_edge_types: list or str
        :param dict edge_data: edge data to find.
        :param dict query: additional search query.
        :param dict edge_query: additional edge query.
        :param dict source_query: additional source query.
        :param dict target_query: additional target query.
        :return: list of neighbour vertices designed by ids, or dict of
            {edge: list(vertices)} if add_edges.
        :rtype: list or dict
        """

        result = manager.get_neighbourhood(
            ids=ids, sources=sources, targets=targets,
            graph_ids=graph_ids,
            data=data, source_data=source_data, target_data=target_data,
            types=types, source_types=source_types, target_types=target_types,
            edge_ids=edge_ids, edge_types=edge_types, add_edges=add_edges,
            source_edge_types=source_edge_types,
            target_edge_types=target_edge_types,
            edge_data=edge_data,
            query=query, edge_query=edge_query, source_query=source_query,
            target_query=target_query
        )

        return result

    @route(ws.application.get, name='topology/vertices')
    @route(
        ws.application.post,
        payload=['ids', 'graph_ids', 'types', 'data', 'query'],
        name='topology/vertices'
    )
    def get_vertices(
        ids=None, graph_ids=None, types=None, data=None, query=None
    ):
        """
        Get topology vertices related to some context property.

        :param ids: vertice ids to get.
        :type ids: list or str
        :param graph_ids: vertice topology ids.
        :type graph_ids: list or str
        :param types: vertice type(s).
        :type types: list or str
        :param data: data to find among vertices.
        :param dict query: additional search query.

        :return: list of vertices if ids is a list. One vertice if ids is a
            str.
        :rtype: list or dict
        """

        result = manager.get_vertices(
            ids=ids, graph_ids=graph_ids, types=types, data=data, query=query
        )

        return result

    @route(ws.application.get, name='topology/edges')
    @route(
        ws.application.post,
        payload=['elt', 'graph_ids'],
        name='topology/edges'
    )
    def get_edges(
        ids=None, types=None, sources=None, targets=None, graph_ids=None,
        data=None, query=None
    ):
        """
        Get edges related to input ids, types and source/target ids.

        :param ids: edge ids to find. If ids is a str, result is an Edge or
            None.
        :type ids: list or str
        :param types: edge types to find.
        :type types: list or str
        :param sources: source edge attribute to find.
        :type sources: list or str
        :param targets: target edge attribute to find.
        :type targets: list or str
        :param graph_ids: topology ids from where find edges.
        :type graph_ids: list or str
        :param dict data: data to find.
        :param dict query: additional query.

        :return: Edge(s) corresponding to input parameters.
        :rtype: Edge or list of Edges.
        """

        result = manager.get_edges(
            ids=ids,
            types=types,
            sources=sources,
            targets=targets,
            graph_ids=graph_ids,
            data=data,
            query=query
        )

        return result
