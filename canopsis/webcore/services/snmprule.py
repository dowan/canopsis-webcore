# -*- coding: utf-8 -*-

from canopsis.common.ws import route
from canopsis.snmp.rulesmanager import RulesManager
from canopsis.snmp.mibs import MibsManager

manager = RulesManager()
mibmanager = MibsManager()


def exports(ws):

    @route(ws.application.delete, payload=['ids'])
    def snmprule(ids):
        manager.remove(ids)
        ws.logger.info('Delete : {}'.format(ids))
        return True

    @route(
        ws.application.post,
        payload=['document'],
        name='snmprule/put'
    )
    def snmprule(document):
        ws.logger.debug(document)
        manager.put(document)
        return True

    @route(ws.application.post, payload=['limit', 'start', 'sort', 'filter'])
    def snmprule(limit=0, start=0, sort=None, filter={}):
        result = manager.find(
            limit=limit,
            skip=start,
            query=filter,
            sort=sort,
            with_count=True
        )
        return result

    @route(ws.application.post, payload=['limit', 'query', 'projection'])
    def snmpmib(limit=None, query={}, projection=None):
        result = mibmanager.get(
            limit=limit,
            query=query,
            projection=projection
        )
        return result
