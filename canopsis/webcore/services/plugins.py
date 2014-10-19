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

from bottle import static_file, HTTPError

import sys
import os


def exports(ws):
    plugins_dir = os.path.join(sys.prefix, 'var', 'lib', 'canopsis', 'plugins')
    allowed_extensions = ['.json', '.js', '.html']

    @ws.application.get('/plugins/<filename:path>')
    def get_externals_files(filename):
        if os.path.exists(plugins_dir):
            ext = os.path.splitext(filename)[1]

            if not ext:
                for tmpext in allowed_extensions:
                    fname = '{0}.{1}'.format(filename, tmpext)
                    abspath = os.path.join(plugins_dir, fname)

                    if os.path.exists(abspath):
                        filename = fname
                        ext = tmpext
                        break

            if ext not in allowed_extensions:
                return HTTPError(404, 'Not found: {0}'.format(filename))

            return static_file(filename, root=plugins_dir)
