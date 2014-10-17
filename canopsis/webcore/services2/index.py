# -*- coding: utf-8 -*-
#--------------------------------
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

from canopsis.old.template import Template
from bottle import get, static_file, request, redirect
import os


def exports(ws):
    session = ws.require('session')
    auth = ws.require('auth')

    @get('/:lang/static/canopsis/index.html')
    @get('/static/canopsis/index.html')
    def index(lang='en'):
        return static_file('canopsis/index.html', root=ws.root_directory)

    @get('/:lang/static/:path#.+#', skip=ws.skip_login)
    @get('/static/:path#.+#', skip=ws.skip_login)
    def server_static(path, lang='en'):
        key = request.params.get('authkey', default=None)
        if key:
            auth.autoLogin(key)

        return static_file(path, root=ws.root_directory)

    @get('/favicon.ico', skip=ws.skip_login)
    def favicon():
        return

    @get('/', skip=ws.skip_login)
    @get('/:key', skip=ws.skip_login)
    @get('/:lang/', skip=ws.skip_login)
    @get('/:lang/:key', skip=ws.skip_login)
    @get('/index.html', skip=ws.skip_login)
    @get('/:lang/index.html', skip=ws.skip_login)
    def loginpage(key=None, lang='en'):
        s = session.get()

        # Try to authenticate user
        key = key or request.params.get('authkey', default=None)

        if key:
            auth.autoLogin(key)

        ticket = request.params.get('ticket', default=None)

        if not ticket and not s.get('auth_on', False):
            # Build cservice dict for login page templating
            cservices = {
                'webserver': {provider: 1 for provider in ws.providers}
            }

            records = ws.db.find(
                {'crecord_type': 'cservice'},
                namespace='object'
            )

            prefix = len('cservice.')

            for cservice in records:
                cname = cservice._id[prefix:]
                cservices[cname] = cservice.dump()

            # Compile template
            login_page = os.path.join(ws.root_directory, 'login', 'index.html')
            with open(login_page) as src:
                tmplsrc = src.read()

            tmpl = Template(tmplsrc)
            return tmpl(cservices)

        else:
            redirect('/{0}/static/canopsis/index.html'.format(lang))
