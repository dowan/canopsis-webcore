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

from canopsis.migration.base import Migration
from canopsis.old.storage import get_storage
from canopsis.old.account import Account

from copy import deepcopy
from time import time


class ViewMigration(Migration):
    """
    Migrate views from Canopsis V1 to V2.
    """

    def __init__(self, *args, **kwargs):
        st = get_storage(
            namespace='object',
            account=Account(user='root', group='root')
        ).get_backend()

        selection = {
            'crecord_type': 'view'
        }

        super(ViewMigration, self).__init__(st, selection, *args, **kwargs)

    def process_record(self, record):
        view = deepcopy(record)

        if 'items' in view:
            widgets = view.pop('items')
            name = view.get('crecord_name', '')

            view['containerwidget'] = {
                '_id': 'root_vertical_container',
                'xtype': 'verticalbox',
                'title': name,
                'items': [
                    self.migrate_widget(w)
                    for w in widgets
                ]
            }

        view.pop('view_options', None)
        view['view_migration_date'] = time()

        return view

    def migrate_widget(self, widget):
        wtype = widget.get('data', {}).get('xtype', None).lower()

        if wtype:
            method = 'migrate_widget_{0}'.format(wtype)

            if hasattr(self, method):
                func = getattr(self, method)
                return func(widget)

        return widget

    def migrate_widget_weather(self, widget):
        data = widget['data']
        title = data['title']
        refreshInterval = data['refreshInterval']
        rks = [
            '{0}.engine.{0}.component.{0}.{1}'.format(
                node['connector'],
                node['component']
            )
            for node in data['nodes']
        ]

        pattern = '''{{#if isSelector}}
            {{{selector_filter}}}
        {{else}}
            { "rk" : "{{rk}}" }
        {{/if}}
        '''

        new_widget = {
            'widget': {
                'widgetId': 'widget_weather_{0}'.format(title),
                'refreshableWidget': True,
                'xtype': 'weather',
                'title': title,
                'event_selection': rks,
                'destination_view': 'view.event',
                'filter_pattern': pattern,
                'tagName': None,
                'refreshInterval': refreshInterval,
                'show_output': True,
                'cssClass': None
            },
            'xtype': 'widgetwrapper',
            'title': 'wrapper'
        }

        return new_widget

    def migrate_widget_text(self, widget):
        data = widget['data']
        title = widget['title']
        text = data['text']

        new_widget = {
            'widget': {
                'html': text,
                'xtype': 'text',
                'title': title
            },
            'xtype': 'widgetwrapper',
            'title': 'wrapper'
        }

        return new_widget
