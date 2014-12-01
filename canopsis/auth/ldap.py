#!/usr/bin/env python
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

from __future__ import absolute_import
from bottle import request, HTTPError
import ldap

from canopsis.auth.base import BaseBackend


class LDAPBackend(BaseBackend):
    name = 'LDAPBackend'

    def get_config(self):
        try:
            record = self.ws.db.get('cservice.ldapconfig')
            return record.dump()

        except KeyError:
            return None

    def apply(self, callback, context):
        self.setup_config(context)

        def decorated(*args, **kwargs):
            s = self.session.get()

            if not s.get('auth_on', False):
                user, record = self.do_auth()

                if user and record and not self.install_account(user, record):
                    return HTTPError(403, 'Forbidden')

            return callback(*args, **kwargs)

        return decorated

    def do_auth(self):

        not_auth = None, None

        self.logger.debug('Fetch LDAP configuration from database')
        mgr = self.rights.get_manager()

        config = self.get_config()

        if not config:
            self.logger.error('LDAP configuration not found')
            return not_auth

        user = request.params.get('username', default=None)
        passwd = request.params.get('password', default=None)

        dn = config.get('user_dn', None)

        if dn:
            try:
                dn = dn % user

            except TypeError:
                pass

        else:
            dn = '{0}@{1}'.format(user, config['domain'])

        self.logger.debug('Connecting to LDAP server: {0}'.format(
            config['uri']
        ))

        conn = ldap.initialize(config['uri'])
        conn.set_option(ldap.OPT_REFERRALS, 0)
        conn.set_option(ldap.OPT_NETWORK_TIMEOUT, ldap.OPT_NETWORK_TIMEOUT)

        try:
            self.logger.info('Authenticate user {0} to LDAP server'.format(
                user
            ))

            conn.simple_bind_s(dn, passwd)

        except ldap.INVALID_CREDENTIALS:
            self.logger.error('Invalid credentials for user {0}'.format(user))

            # Will try with the next backend
            return not_auth

        try:
            self.logger.debug('Ensure user\'s presence in database: {}'.format(
                user
            ))

            record = mgr.get_user(user)

        except KeyError:
            record = None

        if not record:
            self.logger.info(
                'Account {0} not found in database, create it'.format(user)
            )

            attrs = [
                config['firstname'].encode('utf-8'),
                config['lastname'].encode('utf-8'),
                config['mail'].encode('utf-8')
            ]

            ufilter = config['user_filter'] % user

            result = conn.search_s(
                config['base_dn'],
                ldap.SCOPE_SUBTREE,
                ufilter,
                attrs
            )

            # TODO: Replace this with crecord.user
            if result:
                dn, data = result[0]
                info = {
                    '_id': user,
                    'external': True,
                    'enable': True,
                    'contact': {},
                    'role': config.get('default_role')
                }

                for field in ['firstname', 'lastname', 'mail']:
                    val = data.get(config[field], None)

                    if val and isinstance(val, list):
                        val = val[0]

                    info['contact'][field] = val

                account = self.rights.save_user(self.ws, info)

            else:
                info = {
                    '_id': user,
                    'external': True,
                    'enable': True,
                    'contact': {
                        'firstname': user,
                        'lastname': '',
                        'mail': None
                    },
                    'role': config.get('default_role')
                }

                account = mgr.save_user(self.ws, info)

        return user, account


def get_backend(ws):
    return LDAPBackend(ws)
