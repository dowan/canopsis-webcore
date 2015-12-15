/*
 * Copyright (c) 2015 'Capensis' [http://www.capensis.com]
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

var templates = [
    { name: 'application', template: 'canopsis/uibase/src/templates/application.html' },
    { name: 'index', template: 'canopsis/uibase/src/templates/index.html' },
    { name: 'formwrapper', template: 'canopsis/uibase/src/templates/formwrapper.html' },
    { name: 'recordinfopopup', template: 'canopsis/uibase/src/templates/recordinfopopup.html' },
    { name: 'widgettitlebar', template: 'canopsis/uibase/src/templates/widgettitlebar.html' },
    { name: 'userview', template: 'canopsis/uibase/src/templates/userview.html' },
    { name: 'widget', template: 'canopsis/uibase/src/templates/widget.html' },
    { name: 'listline', template: 'canopsis/uibase/src/templates/listline.html' },
    { name: 'widgetslot-default', template: 'canopsis/uibase/src/templates/widgetslot-default.html' },
    { name: 'widgetslot-grey', template: 'canopsis/uibase/src/templates/widgetslot-grey.html' },
    { name: 'widgetslot-light', template: 'canopsis/uibase/src/templates/widgetslot-light.html' },
    { name: 'partialslot', template: 'canopsis/uibase/src/templates/partialslot.html' },
    { name: 'pagination', template: 'canopsis/uibase/src/templates/pagination.html' },
    { name: 'pagination-infos', template: 'canopsis/uibase/src/templates/pagination-infos.html' },
    { name: 'itemsperpage', template: 'canopsis/uibase/src/templates/itemsperpage.html' },
    { name: 'search', template: 'canopsis/uibase/src/templates/search.html' },
    { name: 'customfilters', template: 'canopsis/uibase/src/templates/customfilters.html' },

    { name: 'userstatusmenu', template: 'canopsis/uibase/src/templates/userstatusmenu.html' },
    { name: 'screentoolstatusmenu', template: 'canopsis/uibase/src/templates/screentoolstatusmenu.html' },
    { name: 'documentation', template: 'canopsis/uibase/src/templates/documentation.hbs' },
    { name: 'schemamanagerstatusmenu', template: 'canopsis/uibase/src/templates/schemamanagerstatusmenu.html' },
    { name: 'notificationsstatusmenu', template: 'canopsis/uibase/src/templates/notificationsstatusmenu.html' },
    { name: 'consolemanagerstatusmenu', template: 'canopsis/uibase/src/templates/consolemanagerstatusmenu.html' },
    { name: 'requirejsmockingstatusmenu', template: 'canopsis/uibase/src/templates/requirejsmockingstatusmenu.hbs' },
    { name: 'promisemanagerstatusmenu', template: 'canopsis/uibase/src/templates/promisemanagerstatusmenu.html' },
    { name: 'presettoolbar', template: 'canopsis/uibase/src/templates/presettoolbar.html' },

    { name: 'actionbutton-edit', template: 'canopsis/uibase/src/templates/actionbutton-edit.html', classes: ['action'], icon : 'pencil', label : 'Edit'},
    { name: 'actionbutton-duplicate', template: 'canopsis/uibase/src/templates/actionbutton-duplicate.hbs', classes: ['action'], icon : 'pencil', label : 'Edit'},
    { name: 'actionbutton-ack', template: 'canopsis/uibase/src/templates/actionbutton-ack.html', classes: ['action', 'toolbar'], icon : 'ok', label : 'Ack'},
    { name: 'actionbutton-ackselection', template: 'canopsis/uibase/src/templates/actionbutton-ackselection.html', classes: ['action', 'toolbar'], icon : 'ok', label : 'Ack selection'},
    { name: 'actionbutton-cancel', template: 'canopsis/uibase/src/templates/actionbutton-cancel.html', classes: ['action', 'toolbar'], icon : 'ban-circle', label : 'Cancel'},
    { name: 'actionbutton-cancelselection', template: 'canopsis/uibase/src/templates/actionbutton-cancelselection.html', classes: ['action', 'toolbar'], icon : 'ban-circle', label : 'Cancel Selection'},
    { name: 'actionbutton-changestate', template: 'canopsis/uibase/src/templates/actionbutton-changestate.html', classes: ['action', 'toolbar'],icon : 'retweet', label : 'Change criticity' },
    { name: 'actionbutton-show', template: 'canopsis/uibase/src/templates/actionbutton-show.html', classes: ['action'], icon : 'eye-open',label : 'Show' },
    { name: 'actionbutton-info', template: 'canopsis/uibase/src/templates/actionbutton-info.html', classes: ['action'], icon : 'info-sign',label : 'Info' },
    { name: 'actionbutton-create', template: 'canopsis/uibase/src/templates/actionbutton-create.html', classes: ['action', 'toolbar'], icon : 'plus-sign', label : 'Create' },
    { name: 'actionbutton-removeselection', template: 'canopsis/uibase/src/templates/actionbutton-removeselection.html', classes: ['action', 'toolbar'], icon : 'trash', label : 'Remove selection' },
    { name: 'actionbutton-remove', template: 'canopsis/uibase/src/templates/actionbutton-remove.html', classes: ['action', 'toolbar'], icon : 'trash', label : 'Remove' },
    { name: 'actionbutton-incident', template: 'canopsis/uibase/src/templates/actionbutton-incident.html', classes: ['action', 'toolbar'],icon : 'ticket', label : 'Incident' },
    { name: 'actionbutton-ticketnumber', template: 'canopsis/uibase/src/templates/actionbutton-ticketnumber.html', classes: ['action', 'toolbar'],icon : 'ticket', label : 'Ticket nummber' },

    { name: 'actionbutton-history', template: 'canopsis/uibase/src/templates/actionbutton-history.html', classes: ['action', 'toolbar'],icon : 'time', label : 'History' },
    { name: 'actionbutton-eventnavigation', template: 'canopsis/uibase/src/templates/actionbutton-eventnavigation.html', classes: ['action', 'toolbar'],icon : 'time', label : 'Event navigation' },
    // { name: 'actionbutton-viewrights', template: 'canopsis/uibase/src/templates/actionbutton-viewrights.html', classes: ['action', 'toolbar'],icon : 'time', label : 'View rights' },

    { name: 'formbutton-submit', template: 'canopsis/uibase/src/templates/formbutton-submit.html', classes: ['formbutton'] },
    { name: 'formbutton-cancel', template: 'canopsis/uibase/src/templates/formbutton-cancel.html', classes: ['formbutton'] },
    { name: 'formbutton-ack', template: 'canopsis/uibase/src/templates/formbutton-ack.html', classes: ['formbutton'] },
    { name: 'formbutton-ackandproblem', template: 'canopsis/uibase/src/templates/formbutton-ackandproblem.html', classes: ['formbutton'] },
    { name: 'formbutton-incident', template: 'canopsis/uibase/src/templates/formbutton-incident.html', classes: ['formbutton'] },
    { name: 'formbutton-delete', template: 'canopsis/uibase/src/templates/formbutton-delete.html', classes: ['formbutton'] },
    { name: 'formbutton-previous', template: 'canopsis/uibase/src/templates/formbutton-previous.html', classes: ['formbutton'] },
    { name: 'formbutton-next', template: 'canopsis/uibase/src/templates/formbutton-next.html', classes: ['formbutton'] },
    { name: 'formbutton-inspectform', template: 'canopsis/uibase/src/templates/formbutton-inspectform.html', classes: ['formbutton'] },

    { name: 'titlebarbutton-duplicate', template: 'canopsis/uibase/src/templates/titlebarbutton-duplicate.hbs', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-moveup', template: 'canopsis/uibase/src/templates/titlebarbutton-moveup.html', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-movedown', template: 'canopsis/uibase/src/templates/titlebarbutton-movedown.html', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-moveleft', template: 'canopsis/uibase/src/templates/titlebarbutton-moveleft.html', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-moveright', template: 'canopsis/uibase/src/templates/titlebarbutton-moveright.html', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-minimize', template: 'canopsis/uibase/src/templates/titlebarbutton-minimize.html', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-widgeterrors', template: 'canopsis/uibase/src/templates/titlebarbutton-widgeterrors.html', classes: ['titlebarbutton'] },

    { name: 'actionbutton-foldable', template: 'canopsis/uibase/src/templates/actionbutton-foldable.html' ,  classes: ['foldable']},
    { name: 'column-unfold', template: 'canopsis/uibase/src/templates/column-unfold.html' ,  classes: ['foldable']},
    { name: 'groupedrowslistlayout', template: 'canopsis/uibase/src/templates/groupedrowslistlayout.html' ,  classes: ['foldable']},
    { name: 'groupedrowslistlinelayout', template: 'canopsis/uibase/src/templates/groupedrowslistlinelayout.html' ,  classes: ['foldable']},
    { name: 'stackedcolumns', template: 'canopsis/uibase/src/templates/stackedcolumns.html' ,  classes: ['foldable']},

    { name: 'verticallayout', template: 'canopsis/uibase/src/templates/verticallayout.html' ,  classes: ['layout']},
    { name: 'horizontallayout', template: 'canopsis/uibase/src/templates/horizontallayout.html' ,  classes: ['layout']},
    { name: 'gridlayout', template: 'canopsis/uibase/src/templates/gridlayout.html' ,  classes: ['layout']},
    { name: 'lightlayout', template: 'canopsis/uibase/src/templates/lightlayout.html' ,  classes: ['layout']},
    { name: 'tablayout', template: 'canopsis/uibase/src/templates/tablayout.html' ,  classes: ['layout']},
    { name: 'mixineditdropdown', template: 'canopsis/uibase/src/templates/mixineditdropdown.html'},
    { name: 'draggableheaders', template: 'canopsis/uibase/src/templates/draggableheaders.html'},
    { name: 'tabledraggableth', template: 'canopsis/uibase/src/templates/tabledraggableth.html'},
    { name: 'loading', template: 'canopsis/uibase/src/templates/loading.html'},
    { name: 'loadingindicator', template: 'canopsis/uibase/src/templates/loadingindicator.hbs'}
];

loader.loadWithTemplates(templates);
