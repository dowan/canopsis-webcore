# -*- coding: utf-8 -*-

import os
from subprocess import Popen, PIPE
from canopsis.common.ws import route
from canopsis.snmp.rulesmanager import RulesManager
from canopsis.snmp.mibs import MibsManager
from bottle import request, HTTPError

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

    @route(ws.application.post, payload=[])
    def uploadmib():
        try:
            upload = request.files.get('file')
            filepath = os.path.expanduser('~/tmp/mibimport.mib')
            with open(filepath, 'w') as f:
                f.write(upload.file.read())

            # Try import mib
            process = Popen(
                [
                    'python',
                    '-m',
                    'canopsis.snmp.mibs',
                    '-k',
                    filepath
                ],
                stdout=PIPE
            )
            stdout, _ = process.communicate()
            ws.logger.info(stdout)

            if process.returncode != 0:
                raise('Could not import uploaded mib')

            return True
        except Exception as e:
            message = 'Upload error {}'.format(e)
            ws.logger.error(message)
            return HTTPError(500, message)
