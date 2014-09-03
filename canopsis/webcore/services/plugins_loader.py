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

import os
import logging
import json
import re

from bottle import get, request, response ,static_file , HTTPError
## Canopsis
from canopsis.webcore.services.auth import auth_backends

logger = logging.getLogger("plugins_loader")

#########################################################################

var_path = os.path.expanduser("~/var/")
plugins_path=os.path.join(var_path ,"plugins/")

logger.info(" var_path  = {} ".format(var_path))
logger.info(" plugins_path  = {} ".format(plugins_path))

# can't have file with same name but different extention

@get('/plugins/<filename:path>')
def get_externals_files(filename):
    found = False;
    output = filename + "_is_empty"
    allowed_extentions = ["json" , "js", "html"]
    base_path = var_path + "plugins/"

    if os.path.exists(base_path):
        extention = filename.split(".")

        if len(extention) == 1 :
            for ext in allowed_extentions:
                path_to_test = '{}{}.{}'.format(plugins_path, filename, ext)
                logger.info( "path_to_test = {}".format(path_to_test) )
                if os.path.exists(path_to_test):
                    found = True
                    filename = '{}.{}'.format(filename, ext)
                    break

        elif extention[-1] in allowed_extentions :
            found = True

        if found :
            logger.info("Load form Plugins file : " + filename)
            output = static_file(filename, root=plugins_path)
            return output

    return HTTPError(404, "Error on "+filename)