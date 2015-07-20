# -*- coding: utf-8 -*-
# --------------------------------
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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

from canopsis.common.ws import route
from bottle import request
from .rights import get_manager as get_rights


def get():
    return request.environ.get('beaker.session')


def get_user(_id=None):
    s = get()

    user = s.get('user', {})

    if not _id:
        _id = user.get('_id', None)

    if not _id:
        return None

    else:
        rights = get_rights()

        user = rights.get_user(_id)

        if user:
            user['rights'] = rights.get_user_rights(_id)

        return user


def create(user):
    s = get()
    s['user'] = user
    s['auth_on'] = True
    s.save()

    return s


def delete():
    s = get()
    s.delete()


def exports(ws):
    @route(ws.application.get, name='account/me', adapt=False)
    def get_me():
        user = get_user()
        user.pop('id', None)
        user.pop('eid', None)
        return user
