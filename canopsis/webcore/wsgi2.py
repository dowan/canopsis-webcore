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

from canopsis.configuration.parameters import Parameter, ParamList
from canopsis.configuration.configurable.decorator import conf_paths
from canopsis.configuration.configurable.decorator import add_config
from canopsis.configuration.configurable import Configurable
from canopsis.common.utils import ensure_iterable

from bottle import default_app as BottleApplication

import importlib
import imp
import os


config = {
    'server': (
        Parameter('debug', parser=Parameter.bool),
        Parameter('enable_crossdomain_send_events', parser=Parameter.bool),
        Parameter('root_directory', parser=Parameter.path)
    ),
    'auth': (
        Parameter('providers', parser=Parameter.array(), critical=True)
    ),
    'session': (
        Parameter('cookie_expires', parser=int),
        Parameter('secret'),
        Parameter('data_dir', parser=Parameter.path)
    ),
    'webservices': ParamList(parser=Parameter.bool),
    'webservice_paths': ParamList(parser=Parameter.array())
}


@add_config(config)
@conf_paths('webserver.conf')
class WebServer(Configurable):
    @property
    def webservices(self):
        if not hasattr(self, '_webservices'):
            self._webservices = {}

        return self._webservices

    @property
    def webservice_paths(self):
        if not hasattr(self, '_webservice_paths'):
            self._webservice_paths = {}

        return self._webservice_paths

    @property
    def providers(self):
        if not hasattr(self, '_providers'):
            self._providers = []

        return self._providers

    @providers.setter
    def providers(self, value):
        self._providers = value

    def __init__(self, *args, **kwargs):
        super(WebServer, self).__init__(*args, **kwargs)

    def __call__(self):
        self.app = BottleApplication()
        self.load_webservices()
        self.load_backends()

        return self

    def load_webservices(self):
        self.webmodules = {}

        for webservice in self.webservices:
            if self.webservices[webservice]:
                self.logger.info('Loading webservice: {0}'.format(webservice))

                try:
                    # TODO: Remove webservice_paths
                    # You should always distribute webservices via Python
                    # package canopsis.webcore.services, since it was made
                    # for this use.
                    if webservice in self.webservice_paths:
                        path = self.webservice_paths[webservice]
                        mod = imp.load_source(
                            webservice,
                            os.path.join(path, '{0}.py'.format(webservice))
                        )

                    else:
                        mod = importlib.import_module(
                            'canopsis.webcore.services.{0}'.format(webservice)
                        )

                except ImportError as err:
                    self.logger.error(
                        'Impossible to load webservice {0}: {1}'.format(
                            webservice, err
                        )
                    )

                else:
                    if hasattr(mod, 'exports'):
                        self.webmodules[webservice] = mod
                        mod.exports(self)

                    else:
                        self.logger.error(
                            'Invalid module {0}, no exports()'.format(
                                webservice
                            )
                        )

    def load_backends(self):
        for provider in self.providers:
            modname = 'canopsis.auth.{0}'.format(provider)

            try:
                mod = importlib.import_module(modname)

            except ImportError as err:
                self.logger.error(
                    'Impossible to load authentication backend %s: %s' % (
                        provider, err
                    )
                )

            else:
                self.app.install(mod.get_backend())

    def unload_backends(self):
        pass

    def unload_webservices(self):
        pass

    def __del__(self):
        self.unload_backends()
        self.unload_webservices()

        return super(WebServer, self).__del__()

    @property
    def application(self):
        return self.app


# Declare WSGI application
ws = WebServer()()
app = ws.application
