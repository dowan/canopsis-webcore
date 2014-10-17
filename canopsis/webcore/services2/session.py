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

from bottle import request
from .rights import get_manager as get_rights


def get_user(_id=None):
    s = request.environ.get('beaker.session')

    user = s.get('user', {})

    if not _id:
        _id = user.get('_id', None)

    if not _id:
        return None

    else:
        return get_rights().get_user(_id)


def create(user):
    s = request.environ.get('beaker.session')
    s['user'] = user
    s['auth_on'] = True
    s.save()

    return s


def delete():
    s = request.environ.get('beaker.session')
    s.delete()


def exports(ws):
    pass
