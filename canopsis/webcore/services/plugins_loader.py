#!/usr/bin/env python
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

from os.path import expanduser, join, exists
from sys import prefix as sys_prefix

from logging import getLogger

from bottle import get, static_file, HTTPError

logger = getLogger("plugins_loader")

#########################################################################

var_path = join(sys_prefix, "var")
plugins_path = join(var_path, "plugins/")

logger.info(" var_path  = {} ".format(var_path))
logger.info(" plugins_path  = {} ".format(plugins_path))


@get('/plugins/<filename:path>')
def get_externals_files(filename):
    """
    can't have file with same name but different extention
    """
    found = False
    output = "{0}_is_empty".format(filename)
    allowed_extentions = ["json", "js", "html"]

    if exists(plugins_path):
        extention = filename.split(".")

        if len(extention) == 1:
            for ext in allowed_extentions:
                path_to_test = join(plugins_path, '{}.{}'.format(filename, ext))
                logger.info("path_to_test = {}".format(path_to_test))
                if exists(path_to_test):
                    found = True
                    filename = '{}.{}'.format(filename, ext)
                    break

        elif extention[-1] in allowed_extentions:
            found = True

        if found:
            logger.info("Load form Plugins file : " + filename)
            output = static_file(filename, root=plugins_path)
            return output

    return HTTPError(404, "Error on " + filename)
