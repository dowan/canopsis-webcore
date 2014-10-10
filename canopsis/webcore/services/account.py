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

import logging
from json import loads

from bottle import request, HTTPError, response, redirect, get, put, delete, \
    post

# Canopsis
from canopsis.old.account import Account
from canopsis.old.storage import get_storage
from canopsis.old.record import Record
from canopsis.old.group import Group
from canopsis.organisation.rights import Rights

#import protection function
from canopsis.webcore.services.auth import get_account, delete_session, \
    reload_account, check_group_rights


logger = logging.getLogger('Account')
logger.setLevel(logging.INFO)

#group who have right to access
group_managing_access = ['group.CPS_account_admin']
root_account = Account(user="root", group="root")
right_module = Rights()

ROUTE_FAIL = {
    'total': 1,
    'success': False,
    'data': []
}

ROUTE_SUCCESS = {
    'total': 1,
    'success': True,
    'data': []
}

rights_module_actions = {
    'remove': {
        'profile': right_module.remove_profile,
        'group': right_module.remove_group,
    },
    'add': {
        'profile': right_module.add_profile,
        'group': right_module.add_group,
    }
}


def update_field(e_id, e_type, new_elems, elem_type, entity):
    if entity and elem_type in entity:
        to_remove = entity[elem_type]
        if new_elems:
            to_remove = set(entity[elem_type]) - set(new_elems)
        for elem in to_remove:
            if not rights_module_actions['remove'][elem_type](e_id, e_type, elem):
                return False
    if new_elems:
        for elem in new_elems:
            if not rights_module_actions['add'][elem_type](e_id, e_type, elem):
                return False
    return True


def update_rights(e_id, e_type, e_rights, entity):
    if entity and 'rights' in entity:
        to_remove = entity['rights']
        if e_rights:
            to_remove = set(entity['rights']) - set(e_rights)
        logger.error(to_remove)
        for right in to_remove:
            if not right_module.remove_right(
                e_id, e_type, right, to_remove[right]['checksum']
                ):
                return False
    if e_rights:
        for right in e_rights:
            if not right_module.add_right(
                e_id, e_type, right, e_rights[right]['checksum']
                ):
                return False
    return True


def update_profile(e_id, e_type, profiles, entity):
    update_field(e_id, e_type, profiles, 'profile', entity)


def update_comp(e_id, e_type, groups, entity):
    update_field(e_id, e_type, groups, 'group', entity)


@put('/account/group/:_id')
@post('/account/group/:_id')  # the id param is only here to make a quick hack
def create_group(_id=None):

    items = request.body.readline()

    try:
        items = loads(items)
    except Exception as err:
        logger.error("PUT: Impossible to parse data ({})".format(err))
        return HTTPError(500, "Impossible to parse data")

    item = items[0]

    c_name = _id
    c_rights = item.get('rights')

    group = right_module.get_group(c_name)

    if not group and not right_module.create_group(c_name, c_rights):
        return ROUTE_FAIL

    update_rights(c_name, 'group', c_rights, group)

    return ROUTE_SUCCESS


@delete('/account/group')
def delete_group():
    c_name = request.params.get('group_name')

    return {'total': 1,
            'success': right_module.delete_group(c_name),
            'data': []}


@put('/account/profile/:_id')
@post('/account/profile/:_id')  # the id param is only here to make a quick hack
def post_profile(_id=None):
    items = request.body.readline()

    try:
        items = loads(items)
    except Exception as err:
        logger.error("POST: Impossible to parse data ({})".format(err))
        return HTTPError(500, "Impossible to parse data")

    item = items[0]

    p_id = _id

    p_comp = item.get('profile_groups')
    p_rights = item.get('profile_rights')

    profile = right_module.get_profile(p_id)

    if not profile and not right_module.create_profile(p_id, p_comp):
        return ROUTE_FAIL

    update_comp(p_id, 'profile', p_comp, profile)
    update_rights(p_id, 'profile', p_rights, profile)

    return ROUTE_SUCCESS


@delete('/account/profile')
def delete_profile():
    p_name = request.params.get('profile_name')

    return {'total': 1,
            'success': right_module.delete_profile(p_name),
            'data': []}


@put('/account/role')
@post('/account/role')
def update_role():

    items = request.body.readline()

    try:
        items = loads(items)
    except Exception as err:
        logger.error("POST: Impossible to parse data ({})".format(err))
        return HTTPError(500, "Impossible to parse data")

    if type(items) == dict:
        item = items
    else:
        item = items[0]

    r_id = item.get('role_name')
    r_comp = item.get('role_groups')
    r_rights = item.get('role_rights')
    r_profile = item.get('role_profile')

    role = right_module.get_role(r_id)

    if not role and not right_module.create_role(r_id, r_profile):
        return ROUTE_FAIL

    update_profile(r_id, 'role', r_comp, role)
    update_comp(r_id, 'role', r_comp, role)
    update_rights(r_id, 'role', r_rights, role)

    return ROUTE_SUCCESS


@delete('/account/role')
def delete_role():
    r_name = request.params.get('role_name')

    return {'total': 1,
            'success': right_module.delete_role(r_name),
            'data': []}


@put('/account/user/:_id')
@post('/account/user/:_id')
def create_user(_id=None):

    items = request.body.readline()

    try:
        items = loads(items)
    except Exception as err:
        logger.error("PUT: Impossible to parse data ({})".format(err))
        return HTTPError(500, "Impossible to parse data")

    if type(items) == dict:
        item = items
    else:
        item = items[0]

    u_id = _id
    u_role = item.get('user_role')
    u_contact = item.get('user_contact')
    u_rights = item.get('rights')
    u_comp = item.get('user_groups')

    user = right_module.get_user(u_id)

    if not user and not right_module.create_user(u_id, u_role,
                                                 contact=u_contact,
                                                 rights=u_rights,
                                                 groups=u_comp):
        return ROUTE_FAIL

    update_comp(u_id, 'user', u_comp, user)
    update_rights(u_id, 'user', u_rights, user)

    if not right_module.add_role(u_id, u_role):
        return ROUTE_FAIL

    return ROUTE_SUCCESS


@get('/account/user/rights')
def get_user_rights():
    u_id = request.params.get('user_id')
    u_rights = right_module.get_user_rights(u_id)

    if not u_rights:
        return {'total': 1,
                'success': False,
                'data': []}

    return {'total': len(u_rights),
            'success': True,
            'data': [u_rights]}


@put('/account/action')
@post('/account/action')
def create_action():

    items = request.body.readline()

    try:
        items = loads(items)
    except Exception as err:
        logger.error("PUT: Impossible to parse data ({})".format(err))
        return HTTPError(500, "Impossible to parse data")

    item = items[0]

    a_id = item.get('action_id')
    a_desc = item.get('action_desc')

    if not right_module.add(a_id, a_desc):
        return ROUTE_FAIL

    return ROUTE_SUCCESS


#### GET Me
@get('/account/me')
def account_get_me():

    #get the session (security)
    account = get_account()

    storage = get_storage(namespace='object')

    #try:
    logger.debug(" + Try to get '%s' ... " % account._id)

    try:
        record = storage.get(account._id, account=account)
    except:
        return HTTPError(404, 'Impossible to find account')

    #logger.debug("   + Result: '%s'" % record)
    #except Exception, err:
    #   self.logger.error("Exception !\nReason: %s" % err)
    #   return HTTPError(404, _id+" Not Found")

    if record:
        data = record.dump(json=True)
        data['id'] = data['_id']
        if '.' in data['id']:
            data['rights'] = right_module.get_user_rights(
                data['id'].split('.')[1]
                )
        else:
            data['rights'] = right_module.get_user_rights(data['id'])

        output = [data]
        reload_account(account._id)

    output = {'total': 1, 'success': True, 'data': output}

    logger.debug(" + Output: " + str(output))

    logger.debug('Response status: %s' % response.status)

    return output


@get('/account/getAvatar/:_id')
@get('/account/getAvatar')
def account_get_avatar(_id=None):
    account = get_account()
    storage = get_storage(namespace='object', account=account)

    if not _id:
        _id = account._id

    logger.debug('getAvatar of: %s' % _id)

    record = storage.get(_id, account=Account(user="root", group="root"))

    if not record or not record.data.get('avatar_id', None):
        redirect("/static/canopsis/widgets/stream/logo/ui.png")

    avatar_id = record.data.get('avatar_id')

    logger.debug(' + avatar_id: %s' % avatar_id)

    redirect("/files/%s" % avatar_id)


@post('/account/setConfig/:_id')
def account_setConfig(_id):
    account = get_account()
    storage = get_storage(namespace='object')

    value = request.params.get('value', default=None)

    logger.debug(" + setConfig '%s' => '%s'" % (_id, value))

    if account.external:
        message = "Unable to update account because \
user uses an external account management"
        logger.warning(message)
        return {'total': 0, 'success': False, 'data': [{'message': message}]}

    if value:
        if _id == "shadowpasswd":
            account.shadowpasswd = value
        else:
            account.data[_id] = value

        storage.put(account, account=account)
        output = {'total': 0, 'success': True, 'data': []}
    else:
        output = {'total': 0, 'success': False, 'data': []}

    return output


@get('/account/getAuthKey/:dest_account')
def account_getAuthKey(dest_account):
    if not dest_account:
        return HTTPError(404, 'No account specified')

    #------------------------get accounts----------------------
    account = get_account()
    storage = get_storage(namespace='object', account=account)

    _id = 'account.%s' % dest_account

    try:
        aim_account = Account(storage.get(_id, account=account))

        return {'total': 1, 'success': True, 'data':
        {'authkey': aim_account.get_authkey()}}
    except Exception as err:
        logger.debug('Error while fetching account : %s' % err)
        return {'total': 0, 'success': False, 'data': {'output': str(err)}}


@get('/account/getNewAuthKey/:dest_account',
    checkAuthPlugin={'authorized_grp': 'group.CPS_authkey'})
def account_newAuthKey(dest_account):
    if not dest_account:
        return HTTPError(404, 'No account specified')

    #------------------------get accounts----------------------
    account = get_account()
    storage = get_storage(namespace='object', account=account)

    _id = 'account.%s' % dest_account

    try:
        aim_account = Account(storage.get(_id, account=account))
    except:
        logger.debug('aimed account not found')
        return HTTPError(404, 'Wrong account name or no enough rights')

    #---------------------generate new key-------------------
    logger.debug('Change AuthKey for : %s' % aim_account.user)

    try:
        aim_account.generate_new_authkey()
        storage.put(aim_account, account=account)
        logger.debug('New auth key is : %s' % aim_account.get_authkey())
        return {'total': 0, 'success': True, 'data':
        {'authkey': aim_account.get_authkey(), 'account': aim_account.user}}
    except Exception as err:
        logger.error('Error while updating auth key : %s' % err)
        return {'total': 0, 'success': False, 'data': {}}


@get('/account/:_id')
@get('/account/')
def account_get(_id=None):

    ctype = 'account'

    namespace = 'object'

    #get the session (security)
    account = get_account()

    if not check_group_rights(account, 'group.account_managing'):
        return HTTPError(403, 'Insufficient rights')

    limit = int(request.params.get('limit', default=20))
    #page =  int(request.params.get('page', default=0))
    start = int(request.params.get('start', default=0))
    #groups = request.params.get('groups', default=None)
    search = request.params.get('search', default=None)

    logger.debug("GET:")
    logger.debug(" + User: " + str(account.user))
    logger.debug(" + Group(s): " + str(account.groups))
    logger.debug(" + namespace: " + str(namespace))
    logger.debug(" + Ctype: " + str(ctype))
    logger.debug(" + _id: " + str(_id))
    logger.debug(" + Limit: " + str(limit))
    #logger.debug(" + Page: " + str(page))
    logger.debug(" + Start: " + str(start))
    #logger.debug(" + Groups: " + str(groups))
    logger.debug(" + Search: " + str(search))

    storage = get_storage(namespace=namespace)

    total = 0
    mfilter = {}
    if ctype:
        mfilter = {'crecord_type': ctype}
    if _id:
        try:
            records = [storage.get(_id, account=account)]
            total = 1
        except Exception as err:
            logger.error("Exception !\nReason: %s" % err)
            return HTTPError(404, _id + " Not Found")

    else:
        records, total = storage.find(mfilter, limit=limit, offset=start, account=account, with_total=True)

    output = []
    for record in records:
        if record:
            data = record.dump(json=True)
            data['id'] = data['_id']
            output.append(data)

    output = {'total': total, 'success': True, 'data': output}

    #logger.debug(" + Output: "+str(output))

    return output


@post('/account/', checkAuthPlugin={'authorized_grp': group_managing_access})
def account_post():
    #get the session (security)
    account = get_account()
    storage = get_storage(namespace='object', account=account)

    logger.debug("POST:")

    data = request.body.readline()
    if not data:
        return HTTPError(400, "No data received")

    data = loads(data)

    ## Clean data
    try:
        del data['_id']
        del data['id']
        del data['crecord_type']
    except:
        pass

    if data['user']:
        #check if already exist
        already_exist = False
        _id = "account.%s" % data['user']
        try:
            storage.get(_id, account=account)
            logger.debug('Update account %s' % _id)
            already_exist = True
        except:
            logger.debug('Create account %s' % _id)

        if already_exist:
            return HTTPError(405,
                "Account already exist, use put method for update !")

        #----------------------------CREATION--------------------------
        create_account(data)

    else:
        logger.warning('WARNING : no user specified ...')


@put('/account/', checkAuthPlugin={'authorized_grp': group_managing_access})
@put('/account/:_id', checkAuthPlugin={'authorized_grp': group_managing_access})
def account_update(_id=None):
    account = get_account()
    storage = get_storage(namespace='object', account=account)

    logger.debug("PUT:")

    data = request.body.readline()
    if not data:
        return HTTPError(400, "No data received")
    data = loads(data)

    if not isinstance(data, list):
        data = [data]

    for item in data:
        logger.debug(item)
        if '_id' in item:
            _id = item['_id']
            del item['_id']
        if 'id' in item:
            _id = item['id']
            del item['id']

        if not _id:
            return HTTPError(400, "No id recieved")

        try:
            record = Account(storage.get(_id, account=account))
            logger.debug('Update account %s' % _id)
        except:
            logger.debug('Account %s not found' % _id)
            return HTTPError(404, "Account to update not found")

        #Get password
        if 'passwd' in item:
            logger.debug(' + Update password ...')
            record.passwd(str(item['passwd']))
            del item['passwd']

        #Get group
        if 'aaa_group' in item:
            logger.debug(' + Update group ...')
            record.chgrp(str(item['aaa_group']))
            del item['aaa_group']

        #get secondary groups
        if 'groups' in item:
            groups = []
            for group in item['groups']:
                if group.find('group.') == -1:
                    groups.append('group.%s' % group)
                else:
                    groups.append(group)

            logger.debug(' + Update groups ...')
            logger.debug(' + Old groups : %s' % str(record.groups))
            logger.debug(' + New groups : %s' % str(groups))
            record.groups = groups
            del item['groups']

        for _key in item:
            logger.debug('Update %s with %s' % (str(_key), item[_key]))
            setattr(record, _key, item[_key])

        storage.put(record, account=account)
        reload_account(record._id)


@delete('/account/', checkAuthPlugin={'authorized_grp': group_managing_access})
@delete('/account/:_id',
    checkAuthPlugin={'authorized_grp': group_managing_access})
def account_delete(_id=None):
    account = get_account()
    storage = get_storage(namespace='object')

    logger.debug("DELETE:")

    data = request.body.readline()
    if data:
        try:
            data = loads(data)
        except:
            logger.warning('Invalid data in request payload')
            data = None

    if data:
        logger.debug(" + Data: %s" % data)

        if isinstance(data, list):
            logger.debug(" + Attempt to remove %i item from db" % len(data))
            _id = []

            for item in data:
                if isinstance(item, str):
                    _id.append(item)

                if isinstance(item, dict):
                    item_id = item.get('_id', item.get('id', None))
                    if item_id:
                        _id.append(item_id)

        if isinstance(data, str):
            _id = data

        if isinstance(data, dict):
            _id = data.get('_id', data.get('id', None))

    if not _id:
        return HTTPError(404, "No '_id' field in header ...")

    logger.debug(" + _id: %s " % _id)
    try:
        storage.remove(_id, account=account)
        delete_session(_id)
    except:
        return HTTPError(404, _id + " Not Found")

    #delete all object
    if not isinstance(_id, list):
        _id = [_id]

    mfilter = {'aaa_owner': {'$in': _id}}
    record_list = storage.find(mfilter=mfilter, account=account)
    record_id_list = [record._id for record in record_list]

    try:
        storage.remove(record_id_list, account=account)
    except Exception as err:
        logger.error('Error While suppressing account items: %s' % err)

    logger.debug('account removed')


@post('/account/addToGroup/:group_id/:account_id', checkAuthPlugin={'authorized_grp':group_managing_access})
def add_account_to_group(group_id=None, account_id=None):
    session_account = get_account()
    storage = get_storage(namespace='object', account=session_account)

    if not group_id or not account_id:
        return HTTPError(400, 'Bad request, must specified group and account')

    #get group && account
    if group_id.find('group.') == -1:
        group_id = 'group.%s' % group_id

    if account_id.find('account.') == -1:
        account_id = 'account.%s' % account_id

    logger.debug('Try to get %s and %s' % (account_id, group_id))

    try:
        account_record = storage.get(account_id, account=session_account)
        account = Account(account_record)
        group_record = storage.get(group_id, account=session_account)
        group = Group(group_record)

    except Exception as err:
        logger.error('error while fetching %s and %s : %s' % (
            account_id, group_id, err))
        return HTTPError(403, 'Record not found or insufficient rights')

    #put in group
    group.add_accounts(account)

    try:
        storage.put([group, account])
    except:
        logger.error('Put group/account in db goes wrong')
        return HTTPError(500, 'Put group/account in db goes wrong')

    return {'total': 1, 'success': True, 'data': []}


@post('/account/removeFromGroup/:group_id/:account_id',
    checkAuthPlugin={'authorized_grp': group_managing_access})
def remove_account_from_group(group_id=None, account_id=None):
    session_account = get_account()
    storage = get_storage(namespace='object', account=session_account)

    if not group_id or not account_id:
        return HTTPError(400, 'Bad request, must specified group and account')

    #get group && account
    if group_id.find('group.') == -1:
        group_id = 'group.%s' % group_id

    if account_id.find('account.') == -1:
        account_id = 'account.%s' % account_id

    logger.debug('Try to get %s and %s' % (account_id, group_id))

    try:
        account_record = storage.get(account_id, account=session_account)
        account = Account(account_record)
        group_record = storage.get(group_id, account=session_account)
        group = Group(group_record)

    except Exception as err:
        logger.error('error while fetching %s and %s : %s' % (
            account_id, group_id, err))
        return HTTPError(403, 'Record not found or insufficient rights')

    #remove in group

    group.remove_accounts(account)

    try:
        storage.put([group, account])
    except:
        logger.error('Put group/account in db goes wrong')
        return HTTPError(500, 'Put group/account in db goes wrong')

    return {'total': 1, 'success': True, 'data': []}


def create_account(data):
    logger.debug(' + New account')
    new_account = Account(
        user=data['user'],
        group=data.get('aaa_group', None),
        lastname=data['lastname'],
        firstname=data['firstname'],
        mail=data['mail']
    )

    new_account.external = data.get('external', False)

    #passwd
    passwd = data['passwd']
    new_account.passwd(passwd)
    logger.debug("   + Passwd: '%s'" % passwd)

    #secondary groups
    groups = []
    for group in data.get('groups', []):
        if group.find('group.') == -1:
            groups.append('group.%s' % group)
        else:
            groups.append(group)
    new_account.groups = groups

    storage = get_storage(namespace='object')

    #put record
    logger.debug(' + Save new account')
    new_account.chown(new_account._id)
    storage.put(new_account, account=root_account)

    #get rootdir
    logger.debug(' + Create view directory')
    rootdir = storage.get('directory.root', account=root_account)

    if rootdir:
        userdir = Record(
            {'_id': 'directory.root.%s' % new_account.user,
            'id': 'directory.root.%s' % new_account.user,
            'expanded': 'true'},
            type='view_directory', name=new_account.user)
        userdir.chown(new_account._id)
        userdir.chgrp(new_account.group)
        userdir.chmod('g-w')
        userdir.chmod('g-r')

        rootdir.add_children(userdir)
        storage.put([rootdir, userdir], account=root_account)
    else:
        logger.error('Impossible to get rootdir')

    return new_account
