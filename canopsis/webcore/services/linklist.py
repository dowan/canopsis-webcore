# -*- coding: utf-8 -*-

from canopsis.common.ws import route
from canopsis.linklist.manager import Linklist

manager = Linklist()


def exports(ws):

    @route(ws.application.delete, payload=['ids'])
    def linklist(ids):
        manager.remove(ids)
        ws.logger.info('Delete : {}'.format(ids))
        return True

    @route(
        ws.application.post,
        payload=['document'],
        name='linklist/put'
    )
    def linklist(document):
        ws.logger.info({
            'document': document,
            'type': type(document)
        })

        manager.put(document)

        return True

    @route(ws.application.post, payload=['limit', 'start', 'sort', 'filter'])
    def linklist(limit=0, start=0, sort=None, filter={}):
        result = manager.find(
            limit=limit,
            skip=start,
            _filter=filter,
            sort=sort,
            with_count=True
        )
        return result

    @route(
        ws.application.post,
        payload=['event'],
        name='entitylink'
    )
    def linklist(event):
        return manager.get_links_from_event(event)
