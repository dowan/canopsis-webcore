/*
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

 require.config({
    paths: {
        'actionbutton-ack': 'canopsis/uibase/dist/templates/actionbutton-ack',
        'actionbutton-ackselection': 'canopsis/uibase/dist/templates/actionbutton-ackselection',
        'actionbutton-cancel': 'canopsis/uibase/dist/templates/actionbutton-cancel',
        'actionbutton-cancelselection': 'canopsis/uibase/dist/templates/actionbutton-cancelselection',
        'actionbutton-changestate': 'canopsis/uibase/dist/templates/actionbutton-changestate',
        'actionbutton-create': 'canopsis/uibase/dist/templates/actionbutton-create',
        'actionbutton-duplicate': 'canopsis/uibase/dist/templates/actionbutton-duplicate',
        'actionbutton-edit': 'canopsis/uibase/dist/templates/actionbutton-edit',
        'actionbutton-eventnavigation': 'canopsis/uibase/dist/templates/actionbutton-eventnavigation',
        'actionbutton-foldable': 'canopsis/uibase/dist/templates/actionbutton-foldable',
        'actionbutton-history': 'canopsis/uibase/dist/templates/actionbutton-history',
        'actionbutton-incident': 'canopsis/uibase/dist/templates/actionbutton-incident',
        'actionbutton-info': 'canopsis/uibase/dist/templates/actionbutton-info',
        'actionbutton-remove': 'canopsis/uibase/dist/templates/actionbutton-remove',
        'actionbutton-removeselection': 'canopsis/uibase/dist/templates/actionbutton-removeselection',
        'actionbutton-show': 'canopsis/uibase/dist/templates/actionbutton-show',
        'actionbutton-ticketnumber': 'canopsis/uibase/dist/templates/actionbutton-ticketnumber',
        'application': 'canopsis/uibase/dist/templates/application',
        'column-unfold': 'canopsis/uibase/dist/templates/column-unfold',
        'components/component-actionbutton': 'canopsis/uibase/dist/templates/components/component-actionbutton',
        'components/component-actionfilter': 'canopsis/uibase/dist/templates/components/component-actionfilter',
        'components/component-arrayclassifiedcrecordselector': 'canopsis/uibase/dist/templates/components/component-arrayclassifiedcrecordselector',
        'components/component-arrayeditor': 'canopsis/uibase/dist/templates/components/component-arrayeditor',
        'components/component-classifiedcrecordselector': 'canopsis/uibase/dist/templates/components/component-classifiedcrecordselector',
        'components/component-classifieditemselector': 'canopsis/uibase/dist/templates/components/component-classifieditemselector',
        'components/component-colorchooser': 'canopsis/uibase/dist/templates/components/component-colorchooser',
        'components/component-colpick': 'canopsis/uibase/dist/templates/components/component-colpick',
        'components/component-contextselector': 'canopsis/uibase/dist/templates/components/component-contextselector',
        'components/component-dateinterval': 'canopsis/uibase/dist/templates/components/component-dateinterval',
        'components/component-dictclassifiedcrecordselector': 'canopsis/uibase/dist/templates/components/component-dictclassifiedcrecordselector',
        'components/component-draggablebutton': 'canopsis/uibase/dist/templates/components/component-draggablebutton',
        'components/component-dropdownbutton': 'canopsis/uibase/dist/templates/components/component-dropdownbutton',
        'components/component-dropdownbuttoncontent': 'canopsis/uibase/dist/templates/components/component-dropdownbuttoncontent',
        'components/component-dropdownbuttonheader': 'canopsis/uibase/dist/templates/components/component-dropdownbuttonheader',
        'components/component-dropdownbuttonoverview': 'canopsis/uibase/dist/templates/components/component-dropdownbuttonoverview',
        'components/component-dropdownbuttontitle': 'canopsis/uibase/dist/templates/components/component-dropdownbuttontitle',
        'components/component-elementidselectorwithoptions': 'canopsis/uibase/dist/templates/components/component-elementidselectorwithoptions',
        'components/component-eventkey': 'canopsis/uibase/dist/templates/components/component-eventkey',
        'components/component-expandableaddbutton': 'canopsis/uibase/dist/templates/components/component-expandableaddbutton',
        'components/component-filefield': 'canopsis/uibase/dist/templates/components/component-filefield',
        'components/component-filterclause': 'canopsis/uibase/dist/templates/components/component-filterclause',
        'components/component-formulaeditor': 'canopsis/uibase/dist/templates/components/component-formulaeditor',
        'components/component-ical': 'canopsis/uibase/dist/templates/components/component-ical',
        'components/component-labelledlink': 'canopsis/uibase/dist/templates/components/component-labelledlink',
        'components/component-linklist': 'canopsis/uibase/dist/templates/components/component-linklist',
        'components/component-listtree': 'canopsis/uibase/dist/templates/components/component-listtree',
        'components/component-miniform': 'canopsis/uibase/dist/templates/components/component-miniform',
        'components/component-miniformcontent': 'canopsis/uibase/dist/templates/components/component-miniformcontent',
        'components/component-miniformheader': 'canopsis/uibase/dist/templates/components/component-miniformheader',
        'components/component-miniformheaderbuttons': 'canopsis/uibase/dist/templates/components/component-miniformheaderbuttons',
        'components/component-miniformtitle': 'canopsis/uibase/dist/templates/components/component-miniformtitle',
        'components/component-mixinselector': 'canopsis/uibase/dist/templates/components/component-mixinselector',
        'components/component-modelselect': 'canopsis/uibase/dist/templates/components/component-modelselect',
        'components/component-password': 'canopsis/uibase/dist/templates/components/component-password',
        'components/component-propertiestopopup': 'canopsis/uibase/dist/templates/components/component-propertiestopopup',
        'components/component-restobjectcombo': 'canopsis/uibase/dist/templates/components/component-restobjectcombo',
        'components/component-rrule': 'canopsis/uibase/dist/templates/components/component-rrule',
        'components/component-searchbar': 'canopsis/uibase/dist/templates/components/component-searchbar',
        'components/component-sessioneditor': 'canopsis/uibase/dist/templates/components/component-sessioneditor',
        'components/component-simpledicteditor': 'canopsis/uibase/dist/templates/components/component-simpledicteditor',
        'components/component-slider': 'canopsis/uibase/dist/templates/components/component-slider',
        'components/component-stringclassifiedcrecordselector': 'canopsis/uibase/dist/templates/components/component-stringclassifiedcrecordselector',
        'components/component-tabcontent': 'canopsis/uibase/dist/templates/components/component-tabcontent',
        'components/component-tabheader': 'canopsis/uibase/dist/templates/components/component-tabheader',
        'components/component-table': 'canopsis/uibase/dist/templates/components/component-table',
        'components/component-tabs': 'canopsis/uibase/dist/templates/components/component-tabs',
        'components/component-tabscontentgroup': 'canopsis/uibase/dist/templates/components/component-tabscontentgroup',
        'components/component-tabsheadergroup': 'canopsis/uibase/dist/templates/components/component-tabsheadergroup',
        'components/component-templateselector': 'canopsis/uibase/dist/templates/components/component-templateselector',
        'components/component-textwithsortoption': 'canopsis/uibase/dist/templates/components/component-textwithsortoption',
        'components/component-timestamptooltiped': 'canopsis/uibase/dist/templates/components/component-timestamptooltiped',
        'components/component-typedvalue': 'canopsis/uibase/dist/templates/components/component-typedvalue',
        'consolemanagerstatusmenu': 'canopsis/uibase/dist/templates/consolemanagerstatusmenu',
        'crecordform': 'canopsis/uibase/dist/templates/crecordform',
        'customfilters': 'canopsis/uibase/dist/templates/customfilters',
        'documentation': 'canopsis/uibase/dist/templates/documentation',
        'draggableheaders': 'canopsis/uibase/dist/templates/draggableheaders',
        'editor-actionfilter': 'canopsis/uibase/dist/templates/editor-actionfilter',
        'editor-array': 'canopsis/uibase/dist/templates/editor-array',
        'editor-arrayclassifiedcrecordselector': 'canopsis/uibase/dist/templates/editor-arrayclassifiedcrecordselector',
        'editor-boolean': 'canopsis/uibase/dist/templates/editor-boolean',
        'editor-cfilter': 'canopsis/uibase/dist/templates/editor-cfilter',
        'editor-cfilterwithproperties': 'canopsis/uibase/dist/templates/editor-cfilterwithproperties',
        'editor-cmetric': 'canopsis/uibase/dist/templates/editor-cmetric',
        'editor-color': 'canopsis/uibase/dist/templates/editor-color',
        'editor-contextselector': 'canopsis/uibase/dist/templates/editor-contextselector',
        'editor-dateinterval': 'canopsis/uibase/dist/templates/editor-dateinterval',
        'editor-defaultpropertyeditor': 'canopsis/uibase/dist/templates/editor-defaultpropertyeditor',
        'editor-dictclassifiedcrecordselector': 'canopsis/uibase/dist/templates/editor-dictclassifiedcrecordselector',
        'editor-duration': 'canopsis/uibase/dist/templates/editor-duration',
        'editor-durationWithUnits': 'canopsis/uibase/dist/templates/editor-durationWithUnits',
        'editor-elementidselectorwithoptions': 'canopsis/uibase/dist/templates/editor-elementidselectorwithoptions',
        'editor-error': 'canopsis/uibase/dist/templates/editor-error',
        'editor-eventkey': 'canopsis/uibase/dist/templates/editor-eventkey',
        'editor-eventselector': 'canopsis/uibase/dist/templates/editor-eventselector',
        'editor-integer': 'canopsis/uibase/dist/templates/editor-integer',
        'editor-json': 'canopsis/uibase/dist/templates/editor-json',
        'editor-labelandviewid': 'canopsis/uibase/dist/templates/editor-labelandviewid',
        'editor-labelledlink': 'canopsis/uibase/dist/templates/editor-labelledlink',
        'editor-mail': 'canopsis/uibase/dist/templates/editor-mail',
        'editor-mixins': 'canopsis/uibase/dist/templates/editor-mixins',
        'editor-modelselect': 'canopsis/uibase/dist/templates/editor-modelselect',
        'editor-password': 'canopsis/uibase/dist/templates/editor-password',
        'editor-passwordmd5': 'canopsis/uibase/dist/templates/editor-passwordmd5',
        'editor-passwordsha1': 'canopsis/uibase/dist/templates/editor-passwordsha1',
        'editor-restobject': 'canopsis/uibase/dist/templates/editor-restobject',
        'editor-richtext': 'canopsis/uibase/dist/templates/editor-richtext',
        'editor-rrule': 'canopsis/uibase/dist/templates/editor-rrule',
        'editor-separator': 'canopsis/uibase/dist/templates/editor-separator',
        'editor-serieformula': 'canopsis/uibase/dist/templates/editor-serieformula',
        'editor-session': 'canopsis/uibase/dist/templates/editor-session',
        'editor-simpledict': 'canopsis/uibase/dist/templates/editor-simpledict',
        'editor-simplelist': 'canopsis/uibase/dist/templates/editor-simplelist',
        'editor-slider': 'canopsis/uibase/dist/templates/editor-slider',
        'editor-sortable': 'canopsis/uibase/dist/templates/editor-sortable',
        'editor-source': 'canopsis/uibase/dist/templates/editor-source',
        'editor-state': 'canopsis/uibase/dist/templates/editor-state',
        'editor-stringclassifiedcrecordselector': 'canopsis/uibase/dist/templates/editor-stringclassifiedcrecordselector',
        'editor-stringpair': 'canopsis/uibase/dist/templates/editor-stringpair',
        'editor-tags': 'canopsis/uibase/dist/templates/editor-tags',
        'editor-templateselector': 'canopsis/uibase/dist/templates/editor-templateselector',
        'editor-textarea': 'canopsis/uibase/dist/templates/editor-textarea',
        'editor-timestamp': 'canopsis/uibase/dist/templates/editor-timestamp',
        'editor-typedvalue': 'canopsis/uibase/dist/templates/editor-typedvalue',
        'editor-userpreference': 'canopsis/uibase/dist/templates/editor-userpreference',
        'editor-widgetstree': 'canopsis/uibase/dist/templates/editor-widgetstree',
        'formbutton-ack': 'canopsis/uibase/dist/templates/formbutton-ack',
        'formbutton-ackandproblem': 'canopsis/uibase/dist/templates/formbutton-ackandproblem',
        'formbutton-cancel': 'canopsis/uibase/dist/templates/formbutton-cancel',
        'formbutton-delete': 'canopsis/uibase/dist/templates/formbutton-delete',
        'formbutton-incident': 'canopsis/uibase/dist/templates/formbutton-incident',
        'formbutton-inspectform': 'canopsis/uibase/dist/templates/formbutton-inspectform',
        'formbutton-next': 'canopsis/uibase/dist/templates/formbutton-next',
        'formbutton-previous': 'canopsis/uibase/dist/templates/formbutton-previous',
        'formbutton-submit': 'canopsis/uibase/dist/templates/formbutton-submit',
        'formwrapper': 'canopsis/uibase/dist/templates/formwrapper',
        'gridlayout': 'canopsis/uibase/dist/templates/gridlayout',
        'groupedrowslistlayout': 'canopsis/uibase/dist/templates/groupedrowslistlayout',
        'groupedrowslistlinelayout': 'canopsis/uibase/dist/templates/groupedrowslistlinelayout',
        'horizontallayout': 'canopsis/uibase/dist/templates/horizontallayout',
        'index': 'canopsis/uibase/dist/templates/index',
        'itemsperpage': 'canopsis/uibase/dist/templates/itemsperpage',
        'lightlayout': 'canopsis/uibase/dist/templates/lightlayout',
        'list': 'canopsis/uibase/dist/templates/list',
        'listline': 'canopsis/uibase/dist/templates/listline',
        'loading': 'canopsis/uibase/dist/templates/loading',
        'loadingindicator': 'canopsis/uibase/dist/templates/loadingindicator',
        'menu': 'canopsis/uibase/dist/templates/menu',
        'mixineditdropdown': 'canopsis/uibase/dist/templates/mixineditdropdown',
        'notificationsstatusmenu': 'canopsis/uibase/dist/templates/notificationsstatusmenu',
        'pagination-infos': 'canopsis/uibase/dist/templates/pagination-infos',
        'pagination': 'canopsis/uibase/dist/templates/pagination',
        'partialslot': 'canopsis/uibase/dist/templates/partialslot',
        'presettoolbar': 'canopsis/uibase/dist/templates/presettoolbar',
        'promisemanagerstatusmenu': 'canopsis/uibase/dist/templates/promisemanagerstatusmenu',
        'recordinfopopup': 'canopsis/uibase/dist/templates/recordinfopopup',
        'renderer-actionfilter': 'canopsis/uibase/dist/templates/renderer-actionfilter',
        'renderer-boolean': 'canopsis/uibase/dist/templates/renderer-boolean',
        'renderer-cfilter': 'canopsis/uibase/dist/templates/renderer-cfilter',
        'renderer-cfilterwithproperties': 'canopsis/uibase/dist/templates/renderer-cfilterwithproperties',
        'renderer-color': 'canopsis/uibase/dist/templates/renderer-color',
        'renderer-conf': 'canopsis/uibase/dist/templates/renderer-conf',
        'renderer-labelledlink': 'canopsis/uibase/dist/templates/renderer-labelledlink',
        'renderer-mail': 'canopsis/uibase/dist/templates/renderer-mail',
        'renderer-object': 'canopsis/uibase/dist/templates/renderer-object',
        'renderer-percent': 'canopsis/uibase/dist/templates/renderer-percent',
        'renderer-recordinfopopup': 'canopsis/uibase/dist/templates/renderer-recordinfopopup',
        'renderer-richtext': 'canopsis/uibase/dist/templates/renderer-richtext',
        'renderer-source': 'canopsis/uibase/dist/templates/renderer-source',
        'renderer-subprocess': 'canopsis/uibase/dist/templates/renderer-subprocess',
        'renderer-tags': 'canopsis/uibase/dist/templates/renderer-tags',
        'renderer-timestamp': 'canopsis/uibase/dist/templates/renderer-timestamp',
        'renderer-translator': 'canopsis/uibase/dist/templates/renderer-translator',
        'requirejsmockingstatusmenu': 'canopsis/uibase/dist/templates/requirejsmockingstatusmenu',
        'schemamanagerstatusmenu': 'canopsis/uibase/dist/templates/schemamanagerstatusmenu',
        'screentoolstatusmenu': 'canopsis/uibase/dist/templates/screentoolstatusmenu',
        'search': 'canopsis/uibase/dist/templates/search',
        'stackedcolumns': 'canopsis/uibase/dist/templates/stackedcolumns',
        'tablayout': 'canopsis/uibase/dist/templates/tablayout',
        'tabledraggableth': 'canopsis/uibase/dist/templates/tabledraggableth',
        'textwidget': 'canopsis/uibase/dist/templates/textwidget',
        'titlebarbutton-duplicate': 'canopsis/uibase/dist/templates/titlebarbutton-duplicate',
        'titlebarbutton-minimize': 'canopsis/uibase/dist/templates/titlebarbutton-minimize',
        'titlebarbutton-movedown': 'canopsis/uibase/dist/templates/titlebarbutton-movedown',
        'titlebarbutton-moveleft': 'canopsis/uibase/dist/templates/titlebarbutton-moveleft',
        'titlebarbutton-moveright': 'canopsis/uibase/dist/templates/titlebarbutton-moveright',
        'titlebarbutton-moveup': 'canopsis/uibase/dist/templates/titlebarbutton-moveup',
        'titlebarbutton-widgeterrors': 'canopsis/uibase/dist/templates/titlebarbutton-widgeterrors',
        'topology': 'canopsis/uibase/dist/templates/topology',
        'uiactionbutton': 'canopsis/uibase/dist/templates/uiactionbutton',
        'uimaintabcollection': 'canopsis/uibase/dist/templates/uimaintabcollection',
        'userstatusmenu': 'canopsis/uibase/dist/templates/userstatusmenu',
        'userview': 'canopsis/uibase/dist/templates/userview',
        'verticallayout': 'canopsis/uibase/dist/templates/verticallayout',
        'widget': 'canopsis/uibase/dist/templates/widget',
        'widgetcontainer': 'canopsis/uibase/dist/templates/widgetcontainer',
        'widgetslot-default': 'canopsis/uibase/dist/templates/widgetslot-default',
        'widgetslot-grey': 'canopsis/uibase/dist/templates/widgetslot-grey',
        'widgetslot-light': 'canopsis/uibase/dist/templates/widgetslot-light',
        'widgettitlebar': 'canopsis/uibase/dist/templates/widgettitlebar',

    }
});

 define([
    'link!canopsis/uibase/dist/brick.min.css',
    'ehbs!actionbutton-ack',
    'ehbs!actionbutton-ackselection',
    'ehbs!actionbutton-cancel',
    'ehbs!actionbutton-cancelselection',
    'ehbs!actionbutton-changestate',
    'ehbs!actionbutton-create',
    'ehbs!actionbutton-duplicate',
    'ehbs!actionbutton-edit',
    'ehbs!actionbutton-eventnavigation',
    'ehbs!actionbutton-foldable',
    'ehbs!actionbutton-history',
    'ehbs!actionbutton-incident',
    'ehbs!actionbutton-info',
    'ehbs!actionbutton-remove',
    'ehbs!actionbutton-removeselection',
    'ehbs!actionbutton-show',
    'ehbs!actionbutton-ticketnumber',
    'ehbs!application',
    'ehbs!column-unfold',
    'ehbs!components/component-actionbutton',
    'ehbs!components/component-actionfilter',
    'ehbs!components/component-arrayclassifiedcrecordselector',
    'ehbs!components/component-arrayeditor',
    'ehbs!components/component-classifiedcrecordselector',
    'ehbs!components/component-classifieditemselector',
    'ehbs!components/component-colorchooser',
    'ehbs!components/component-colpick',
    'ehbs!components/component-contextselector',
    'ehbs!components/component-dateinterval',
    'ehbs!components/component-dictclassifiedcrecordselector',
    'ehbs!components/component-draggablebutton',
    'ehbs!components/component-dropdownbutton',
    'ehbs!components/component-dropdownbuttoncontent',
    'ehbs!components/component-dropdownbuttonheader',
    'ehbs!components/component-dropdownbuttonoverview',
    'ehbs!components/component-dropdownbuttontitle',
    'ehbs!components/component-elementidselectorwithoptions',
    'ehbs!components/component-eventkey',
    'ehbs!components/component-expandableaddbutton',
    'ehbs!components/component-filefield',
    'ehbs!components/component-filterclause',
    'ehbs!components/component-formulaeditor',
    'ehbs!components/component-ical',
    'ehbs!components/component-labelledlink',
    'ehbs!components/component-linklist',
    'ehbs!components/component-listtree',
    'ehbs!components/component-miniform',
    'ehbs!components/component-miniformcontent',
    'ehbs!components/component-miniformheader',
    'ehbs!components/component-miniformheaderbuttons',
    'ehbs!components/component-miniformtitle',
    'ehbs!components/component-mixinselector',
    'ehbs!components/component-modelselect',
    'ehbs!components/component-password',
    'ehbs!components/component-propertiestopopup',
    'ehbs!components/component-restobjectcombo',
    'ehbs!components/component-rrule',
    'ehbs!components/component-searchbar',
    'ehbs!components/component-sessioneditor',
    'ehbs!components/component-simpledicteditor',
    'ehbs!components/component-slider',
    'ehbs!components/component-stringclassifiedcrecordselector',
    'ehbs!components/component-tabcontent',
    'ehbs!components/component-tabheader',
    'ehbs!components/component-table',
    'ehbs!components/component-tabs',
    'ehbs!components/component-tabscontentgroup',
    'ehbs!components/component-tabsheadergroup',
    'ehbs!components/component-templateselector',
    'ehbs!components/component-textwithsortoption',
    'ehbs!components/component-timestamptooltiped',
    'ehbs!components/component-typedvalue',
    'ehbs!consolemanagerstatusmenu',
    'ehbs!crecordform',
    'ehbs!customfilters',
    'ehbs!documentation',
    'ehbs!draggableheaders',
    'ehbs!editor-actionfilter',
    'ehbs!editor-array',
    'ehbs!editor-arrayclassifiedcrecordselector',
    'ehbs!editor-boolean',
    'ehbs!editor-cfilter',
    'ehbs!editor-cfilterwithproperties',
    'ehbs!editor-cmetric',
    'ehbs!editor-color',
    'ehbs!editor-contextselector',
    'ehbs!editor-dateinterval',
    'ehbs!editor-defaultpropertyeditor',
    'ehbs!editor-dictclassifiedcrecordselector',
    'ehbs!editor-duration',
    'ehbs!editor-durationWithUnits',
    'ehbs!editor-elementidselectorwithoptions',
    'ehbs!editor-error',
    'ehbs!editor-eventkey',
    'ehbs!editor-eventselector',
    'ehbs!editor-integer',
    'ehbs!editor-json',
    'ehbs!editor-labelandviewid',
    'ehbs!editor-labelledlink',
    'ehbs!editor-mail',
    'ehbs!editor-mixins',
    'ehbs!editor-modelselect',
    'ehbs!editor-password',
    'ehbs!editor-passwordmd5',
    'ehbs!editor-passwordsha1',
    'ehbs!editor-restobject',
    'ehbs!editor-richtext',
    'ehbs!editor-rrule',
    'ehbs!editor-separator',
    'ehbs!editor-serieformula',
    'ehbs!editor-session',
    'ehbs!editor-simpledict',
    'ehbs!editor-simplelist',
    'ehbs!editor-slider',
    'ehbs!editor-sortable',
    'ehbs!editor-source',
    'ehbs!editor-state',
    'ehbs!editor-stringclassifiedcrecordselector',
    'ehbs!editor-stringpair',
    'ehbs!editor-tags',
    'ehbs!editor-templateselector',
    'ehbs!editor-textarea',
    'ehbs!editor-timestamp',
    'ehbs!editor-typedvalue',
    'ehbs!editor-userpreference',
    'ehbs!editor-widgetstree',
    'ehbs!formbutton-ack',
    'ehbs!formbutton-ackandproblem',
    'ehbs!formbutton-cancel',
    'ehbs!formbutton-delete',
    'ehbs!formbutton-incident',
    'ehbs!formbutton-inspectform',
    'ehbs!formbutton-next',
    'ehbs!formbutton-previous',
    'ehbs!formbutton-submit',
    'ehbs!formwrapper',
    'ehbs!gridlayout',
    'ehbs!groupedrowslistlayout',
    'ehbs!groupedrowslistlinelayout',
    'ehbs!horizontallayout',
    'ehbs!index',
    'ehbs!itemsperpage',
    'ehbs!lightlayout',
    'ehbs!list',
    'ehbs!listline',
    'ehbs!loading',
    'ehbs!loadingindicator',
    'ehbs!menu',
    'ehbs!mixineditdropdown',
    'ehbs!notificationsstatusmenu',
    'ehbs!pagination-infos',
    'ehbs!pagination',
    'ehbs!partialslot',
    'ehbs!presettoolbar',
    'ehbs!promisemanagerstatusmenu',
    'ehbs!recordinfopopup',
    'ehbs!renderer-actionfilter',
    'ehbs!renderer-boolean',
    'ehbs!renderer-cfilter',
    'ehbs!renderer-cfilterwithproperties',
    'ehbs!renderer-color',
    'ehbs!renderer-conf',
    'ehbs!renderer-labelledlink',
    'ehbs!renderer-mail',
    'ehbs!renderer-object',
    'ehbs!renderer-percent',
    'ehbs!renderer-recordinfopopup',
    'ehbs!renderer-richtext',
    'ehbs!renderer-source',
    'ehbs!renderer-subprocess',
    'ehbs!renderer-tags',
    'ehbs!renderer-timestamp',
    'ehbs!renderer-translator',
    'ehbs!requirejsmockingstatusmenu',
    'ehbs!schemamanagerstatusmenu',
    'ehbs!screentoolstatusmenu',
    'ehbs!search',
    'ehbs!stackedcolumns',
    'ehbs!tablayout',
    'ehbs!tabledraggableth',
    'ehbs!textwidget',
    'ehbs!titlebarbutton-duplicate',
    'ehbs!titlebarbutton-minimize',
    'ehbs!titlebarbutton-movedown',
    'ehbs!titlebarbutton-moveleft',
    'ehbs!titlebarbutton-moveright',
    'ehbs!titlebarbutton-moveup',
    'ehbs!titlebarbutton-widgeterrors',
    'ehbs!topology',
    'ehbs!uiactionbutton',
    'ehbs!uimaintabcollection',
    'ehbs!userstatusmenu',
    'ehbs!userview',
    'ehbs!verticallayout',
    'ehbs!widget',
    'ehbs!widgetcontainer',
    'ehbs!widgetslot-default',
    'ehbs!widgetslot-grey',
    'ehbs!widgetslot-light',
    'ehbs!widgettitlebar',
    'canopsis/uibase/requirejs-modules/externals.conf',
    'canopsis/uibase/dist/brick.min'
], function () {});
