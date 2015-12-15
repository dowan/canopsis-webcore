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
    { name: 'application', template: 'canopsis/uibase/src/templates/application.hbs' },
    { name: 'index', template: 'canopsis/uibase/src/templates/index.hbs' },
    { name: 'formwrapper', template: 'canopsis/uibase/src/templates/formwrapper.hbs' },
    { name: 'recordinfopopup', template: 'canopsis/uibase/src/templates/recordinfopopup.hbs' },
    { name: 'widgettitlebar', template: 'canopsis/uibase/src/templates/widgettitlebar.hbs' },
    { name: 'userview', template: 'canopsis/uibase/src/templates/userview.hbs' },
    { name: 'widget', template: 'canopsis/uibase/src/templates/widget.hbs' },
    { name: 'listline', template: 'canopsis/uibase/src/templates/listline.hbs' },
    { name: 'widgetslot-default', template: 'canopsis/uibase/src/templates/widgetslot-default.hbs' },
    { name: 'widgetslot-grey', template: 'canopsis/uibase/src/templates/widgetslot-grey.hbs' },
    { name: 'widgetslot-light', template: 'canopsis/uibase/src/templates/widgetslot-light.hbs' },
    { name: 'partialslot', template: 'canopsis/uibase/src/templates/partialslot.hbs' },
    { name: 'pagination', template: 'canopsis/uibase/src/templates/pagination.hbs' },
    { name: 'pagination-infos', template: 'canopsis/uibase/src/templates/pagination-infos.hbs' },
    { name: 'itemsperpage', template: 'canopsis/uibase/src/templates/itemsperpage.hbs' },
    { name: 'search', template: 'canopsis/uibase/src/templates/search.hbs' },
    { name: 'customfilters', template: 'canopsis/uibase/src/templates/customfilters.hbs' },

    { name: 'userstatusmenu', template: 'canopsis/uibase/src/templates/userstatusmenu.hbs' },
    { name: 'screentoolstatusmenu', template: 'canopsis/uibase/src/templates/screentoolstatusmenu.hbs' },
    { name: 'documentation', template: 'canopsis/uibase/src/templates/documentation.hbs' },
    { name: 'schemamanagerstatusmenu', template: 'canopsis/uibase/src/templates/schemamanagerstatusmenu.hbs' },
    { name: 'notificationsstatusmenu', template: 'canopsis/uibase/src/templates/notificationsstatusmenu.hbs' },
    { name: 'consolemanagerstatusmenu', template: 'canopsis/uibase/src/templates/consolemanagerstatusmenu.hbs' },
    { name: 'requirejsmockingstatusmenu', template: 'canopsis/uibase/src/templates/requirejsmockingstatusmenu.hbs' },
    { name: 'promisemanagerstatusmenu', template: 'canopsis/uibase/src/templates/promisemanagerstatusmenu.hbs' },
    { name: 'presettoolbar', template: 'canopsis/uibase/src/templates/presettoolbar.hbs' },

    { name: 'actionbutton-edit', template: 'canopsis/uibase/src/templates/actionbutton-edit.hbs', classes: ['action'], icon : 'pencil', label : 'Edit'},
    { name: 'actionbutton-duplicate', template: 'canopsis/uibase/src/templates/actionbutton-duplicate.hbs', classes: ['action'], icon : 'pencil', label : 'Edit'},
    { name: 'actionbutton-ack', template: 'canopsis/uibase/src/templates/actionbutton-ack.hbs', classes: ['action', 'toolbar'], icon : 'ok', label : 'Ack'},
    { name: 'actionbutton-ackselection', template: 'canopsis/uibase/src/templates/actionbutton-ackselection.hbs', classes: ['action', 'toolbar'], icon : 'ok', label : 'Ack selection'},
    { name: 'actionbutton-cancel', template: 'canopsis/uibase/src/templates/actionbutton-cancel.hbs', classes: ['action', 'toolbar'], icon : 'ban-circle', label : 'Cancel'},
    { name: 'actionbutton-cancelselection', template: 'canopsis/uibase/src/templates/actionbutton-cancelselection.hbs', classes: ['action', 'toolbar'], icon : 'ban-circle', label : 'Cancel Selection'},
    { name: 'actionbutton-changestate', template: 'canopsis/uibase/src/templates/actionbutton-changestate.hbs', classes: ['action', 'toolbar'],icon : 'retweet', label : 'Change criticity' },
    { name: 'actionbutton-show', template: 'canopsis/uibase/src/templates/actionbutton-show.hbs', classes: ['action'], icon : 'eye-open',label : 'Show' },
    { name: 'actionbutton-info', template: 'canopsis/uibase/src/templates/actionbutton-info.hbs', classes: ['action'], icon : 'info-sign',label : 'Info' },
    { name: 'actionbutton-create', template: 'canopsis/uibase/src/templates/actionbutton-create.hbs', classes: ['action', 'toolbar'], icon : 'plus-sign', label : 'Create' },
    { name: 'actionbutton-removeselection', template: 'canopsis/uibase/src/templates/actionbutton-removeselection.hbs', classes: ['action', 'toolbar'], icon : 'trash', label : 'Remove selection' },
    { name: 'actionbutton-remove', template: 'canopsis/uibase/src/templates/actionbutton-remove.hbs', classes: ['action', 'toolbar'], icon : 'trash', label : 'Remove' },
    { name: 'actionbutton-incident', template: 'canopsis/uibase/src/templates/actionbutton-incident.hbs', classes: ['action', 'toolbar'],icon : 'ticket', label : 'Incident' },
    { name: 'actionbutton-ticketnumber', template: 'canopsis/uibase/src/templates/actionbutton-ticketnumber.hbs', classes: ['action', 'toolbar'],icon : 'ticket', label : 'Ticket nummber' },

    { name: 'actionbutton-history', template: 'canopsis/uibase/src/templates/actionbutton-history.hbs', classes: ['action', 'toolbar'],icon : 'time', label : 'History' },
    { name: 'actionbutton-eventnavigation', template: 'canopsis/uibase/src/templates/actionbutton-eventnavigation.hbs', classes: ['action', 'toolbar'],icon : 'time', label : 'Event navigation' },
    // { name: 'actionbutton-viewrights', template: 'canopsis/uibase/src/templates/actionbutton-viewrights.hbs', classes: ['action', 'toolbar'],icon : 'time', label : 'View rights' },

    { name: 'formbutton-submit', template: 'canopsis/uibase/src/templates/formbutton-submit.hbs', classes: ['formbutton'] },
    { name: 'formbutton-cancel', template: 'canopsis/uibase/src/templates/formbutton-cancel.hbs', classes: ['formbutton'] },
    { name: 'formbutton-ack', template: 'canopsis/uibase/src/templates/formbutton-ack.hbs', classes: ['formbutton'] },
    { name: 'formbutton-ackandproblem', template: 'canopsis/uibase/src/templates/formbutton-ackandproblem.hbs', classes: ['formbutton'] },
    { name: 'formbutton-incident', template: 'canopsis/uibase/src/templates/formbutton-incident.hbs', classes: ['formbutton'] },
    { name: 'formbutton-delete', template: 'canopsis/uibase/src/templates/formbutton-delete.hbs', classes: ['formbutton'] },
    { name: 'formbutton-previous', template: 'canopsis/uibase/src/templates/formbutton-previous.hbs', classes: ['formbutton'] },
    { name: 'formbutton-next', template: 'canopsis/uibase/src/templates/formbutton-next.hbs', classes: ['formbutton'] },
    { name: 'formbutton-inspectform', template: 'canopsis/uibase/src/templates/formbutton-inspectform.hbs', classes: ['formbutton'] },

    { name: 'titlebarbutton-duplicate', template: 'canopsis/uibase/src/templates/titlebarbutton-duplicate.hbs', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-moveup', template: 'canopsis/uibase/src/templates/titlebarbutton-moveup.hbs', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-movedown', template: 'canopsis/uibase/src/templates/titlebarbutton-movedown.hbs', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-moveleft', template: 'canopsis/uibase/src/templates/titlebarbutton-moveleft.hbs', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-moveright', template: 'canopsis/uibase/src/templates/titlebarbutton-moveright.hbs', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-minimize', template: 'canopsis/uibase/src/templates/titlebarbutton-minimize.hbs', classes: ['titlebarbutton'] },
    { name: 'titlebarbutton-widgeterrors', template: 'canopsis/uibase/src/templates/titlebarbutton-widgeterrors.hbs', classes: ['titlebarbutton'] },

    { name: 'actionbutton-foldable', template: 'canopsis/uibase/src/templates/actionbutton-foldable.hbs' ,  classes: ['foldable']},
    { name: 'column-unfold', template: 'canopsis/uibase/src/templates/column-unfold.hbs' ,  classes: ['foldable']},
    { name: 'groupedrowslistlayout', template: 'canopsis/uibase/src/templates/groupedrowslistlayout.hbs' ,  classes: ['foldable']},
    { name: 'groupedrowslistlinelayout', template: 'canopsis/uibase/src/templates/groupedrowslistlinelayout.hbs' ,  classes: ['foldable']},
    { name: 'stackedcolumns', template: 'canopsis/uibase/src/templates/stackedcolumns.hbs' ,  classes: ['foldable']},

    { name: 'verticallayout', template: 'canopsis/uibase/src/templates/verticallayout.hbs' ,  classes: ['layout']},
    { name: 'horizontallayout', template: 'canopsis/uibase/src/templates/horizontallayout.hbs' ,  classes: ['layout']},
    { name: 'gridlayout', template: 'canopsis/uibase/src/templates/gridlayout.hbs' ,  classes: ['layout']},
    { name: 'lightlayout', template: 'canopsis/uibase/src/templates/lightlayout.hbs' ,  classes: ['layout']},
    { name: 'tablayout', template: 'canopsis/uibase/src/templates/tablayout.hbs' ,  classes: ['layout']},
    { name: 'mixineditdropdown', template: 'canopsis/uibase/src/templates/mixineditdropdown.hbs'},
    { name: 'draggableheaders', template: 'canopsis/uibase/src/templates/draggableheaders.hbs'},
    { name: 'tabledraggableth', template: 'canopsis/uibase/src/templates/tabledraggableth.hbs'},
    { name: 'loading', template: 'canopsis/uibase/src/templates/loading.hbs'},
    { name: 'loadingindicator', template: 'canopsis/uibase/src/templates/loadingindicator.hbs'}
];

loader.loadWithTemplates(templates);
