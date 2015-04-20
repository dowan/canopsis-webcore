# -*- coding: utf-8 -*-

from canopsis.common.ws import route
from canopsis.linklist.manager import Linklist

manager = Linklist()


def exports(ws):

    @route(ws.application.delete, payload=['context'])
    def linklist(context):
        manager.remove(context)
        ws.logger.info('Delete : {}, {}'.format(
            context,
            type(context)
        ))
        return True

    @route(
        ws.application.post,
        payload=['extra_keys', 'context'],
        name='linklist/put'
    )
    def linklist(context, extra_keys):
        ws.logger.info({
            'extra_keys': extra_keys,
            'context': context
        })

        manager.put(context, extra_keys)

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
