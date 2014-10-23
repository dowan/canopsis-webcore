# -*- coding: utf-8 -*-
#--------------------------------
# Copyright (c) 2014 'Capensis' [http://www.capensis.com]
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

from canopsis.organisation.rights import Rights
from canopsis.common.ws import route
from bottle import HTTPError


rights = None


def get_manager():
    global rights

    if not rights:
        rights = Rights()

    return rights


def save_group(ws, group):
    cname = group['_id']
    crights = group['rights']

    group = rights.get_group(cname)

    if not group and not rights.create_group(cname, crights):
        raise ws.Error('Impossible to create group')

    rights.update_rights(cname, 'group', crights, group)

    return group


def save_profile(ws, profile):
    pid = profile['_id']
    pcomp = profile['profile_groups']
    prights = profile['profile_rights']

    profile = rights.get_profile(pid)

    if not profile and not rights.create_profile(pid, pcomp):
        raise ws.Error('Impossible to create profile')

    rights.update_comp(pid, 'profile', pcomp, profile)
    rights.update_rights(pid, 'profile', prights, profile)

    return profile


def save_role(ws, role):
    rid = role['_id']
    rcomp = role['groups']
    rrights = role['rights']
    rprofile = role['profile']

    role = rights.get_role(rid)

    if not role and not rights.create_role(rid, rprofile):
        raise ws.Error('Impossible to create role')

    rights.update_profile(rid, 'role', rcomp, role)
    rights.update_comp(rid, 'role', rcomp, role)
    rights.update_rights(rid, 'role', rrights, role)

    return role


def save_user(ws, record):
    uid = record.pop('_id')
    urole = record.pop('role')
    ucontact = record.pop('contact')
    urights = record.pop('rights')
    ucomp = record.pop('groups')

    user = rights.get_user(uid)

    if not user:
        user = rights.create_user(
            uid, urole,
            contact=ucontact,
            rights=urights,
            groups=ucomp
        )

        if not user:
            raise ws.Error('Impossible to create user')

    rights.update_comp(uid, 'user', ucomp, user)
    rights.update_rights(uid, 'user', urights, user)
    rights.update_fields(uid, 'user', record)

    if not rights.add_role(uid, urole):
        raise ws.Error('Impossible to add user to role')

    return user


def exports(ws):
    rights = get_manager()

    rights_actions = {
        'delete': {
            'profile': rights.delete_profile,
            'group': rights.delete_group,
            'user': rights.delete_user,
            'role': rights.delete_role,
            'action': rights.delete
        }
    }

    @route(ws.application.get)
    def rights(uid):
        urights = rights.get_user_rights(uid)

        if not urights:
            raise HTTPError(404, 'No rights found for user: {0}'.format(uid))

        else:
            return urights

    @route(ws.application.post, name='account/group', payload=['group'])
    def create_group(group):
        return save_group(ws, group)

    @route(ws.application.put, name='account/group', payload=['group'])
    def update_group(_id, group):
        return save_group(ws, group)

    @route(ws.application.post, name='account/profile', payload=['profile'])
    def create_profile(profile):
        return save_profile(ws, profile)

    @route(ws.application.put, name='account/profile', payload=['profile'])
    def update_profile(_id, profile):
        return save_profile(ws, profile)

    @route(ws.application.post, name='account/role', payload=['role'])
    def create_role(role):
        return save_role(ws, role)

    @route(ws.application.put, name='account/role', payload=['role'])
    def update_role(_id, role):
        return save_role(ws, role)

    @route(ws.application.post, name='account/user', payload=['user'])
    def create_user(user):
        return save_user(ws, user)

    @route(ws.application.put, name='account/user', payload=['user'])
    def update_user(_id, user):
        return save_user(ws, user)

    @route(ws.application.delete, name='account/delete')
    def delete_entity(etype, _id):
        if not etype in rights_actions['delete']:
            raise ws.Error('Unknown entity type: {0}'.format(etype))

        else:
            rights_actions['delete'][etype](_id)
