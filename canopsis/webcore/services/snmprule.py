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

        upload = request.files.get('file')
        filepath = os.path.expanduser('~/tmp/mibimport.mib')
        ws.logger.info('writting mib file {}'.format(filepath))

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

        try:
            # Depends on what does the mib parser produces
            lines = stdout.split('----------')[-1].strip().split('\n')
            # Filter output mibimport error line if any (nice summary in ui)
            lines = [line for line in lines if 'mibimport.mib' not in line]
            output = '\n'.join(lines)
        except Exception as e:
            output = 'Could not get import summary'

        return {'message': output}
