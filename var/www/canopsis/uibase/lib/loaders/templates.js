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

var templates = [
    { name: 'application', template: 'canopsis/uibase/templates/application.hbs' },
    { name: 'index', template: 'canopsis/uibase/templates/index.hbs' },
    { name: 'formwrapper', template: 'canopsis/uibase/templates/formwrapper.hbs' },
    { name: 'recordinfopopup', template: 'canopsis/uibase/templates/recordinfopopup.hbs' },
    { name: 'widgettitlebar', template: 'canopsis/uibase/templates/widgettitlebar.hbs' },
    { name: 'userview', template: 'canopsis/uibase/templates/userview.hbs' },
    { name: 'widget', template: 'canopsis/uibase/templates/widget.hbs' },
    { name: 'listline', template: 'canopsis/uibase/templates/listline.hbs' },
    { name: 'widgetslot-default', template: 'canopsis/uibase/templates/widgetslot-default.hbs' },
    { name: 'widgetslot-grey', template: 'canopsis/uibase/templates/widgetslot-grey.hbs' },
    { name: 'widgetslot-light', template: 'canopsis/uibase/templates/widgetslot-light.hbs' },
    { name: 'partialslot', template: 'canopsis/uibase/templates/partialslot.hbs' },
    { name: 'pagination', template: 'canopsis/uibase/templates/pagination.hbs' },
    { name: 'pagination-infos', template: 'canopsis/uibase/templates/pagination-infos.hbs' },
    { name: 'itemsperpage', template: 'canopsis/uibase/templates/itemsperpage.hbs' },
    { name: 'search', template: 'canopsis/uibase/templates/search.hbs' },
    { name: 'customfilters', template: 'canopsis/uibase/templates/customfilters.hbs' },

    { name: 'userstatusmenu', template: 'canopsis/uibase/templates/userstatusmenu.hbs' },
    { name: 'screentoolstatusmenu', template: 'canopsis/uibase/templates/screentoolstatusmenu.hbs' },
    { name: 'documentation', template: 'canopsis/uibase/templates/documentation.hbs' },
    { name: 'schemamanagerstatusmenu', template: 'canopsis/uibase/templates/schemamanagerstatusmenu.hbs' },
    { name: 'notificationsstatusmenu', template: 'canopsis/uibase/templates/notificationsstatusmenu.hbs' },
    { name: 'consolemanagerstatusmenu', template: 'canopsis/uibase/templates/consolemanagerstatusmenu.hbs' },
    { name: 'requirejsmockingstatusmenu', template: 'canopsis/uibase/templates/requirejsmockingstatusmenu.hbs' },
    { name: 'promisemanagerstatusmenu', template: 'canopsis/uibase/templates/promisemanagerstatusmenu.hbs' },
    { name: 'presettoolbar', template: 'canopsis/uibase/templates/presettoolbar.hbs' },

    { name: 'actionbutton-edit', template: 'canopsis/uibase/templates/actionbutton-edit.hbs', classes: ["action"], icon : "pencil", label : "Edit"},
    { name: 'actionbutton-duplicate', template: 'canopsis/uibase/templates/actionbutton-duplicate.hbs', classes: ["action"], icon : "pencil", label : "Edit"},
    { name: 'actionbutton-ack', template: 'canopsis/uibase/templates/actionbutton-ack.hbs', classes: ["action", "toolbar"], icon : "ok", label : "Ack"},
    { name: 'actionbutton-ackselection', template: 'canopsis/uibase/templates/actionbutton-ackselection.hbs', classes: ["action", "toolbar"], icon : "ok", label : "Ack selection"},
    { name: 'actionbutton-cancel', template: 'canopsis/uibase/templates/actionbutton-cancel.hbs', classes: ["action", "toolbar"], icon : "ban-circle", label : "Cancel"},
    { name: 'actionbutton-cancelselection', template: 'canopsis/uibase/templates/actionbutton-cancelselection.hbs', classes: ["action", "toolbar"], icon : "ban-circle", label : "Cancel Selection"},
    { name: 'actionbutton-changestate', template: 'canopsis/uibase/templates/actionbutton-changestate.hbs', classes: ["action", "toolbar"],icon : "retweet", label : "Change criticity" },
    { name: 'actionbutton-show', template: 'canopsis/uibase/templates/actionbutton-show.hbs', classes: ["action"], icon : "eye-open",label : "Show" },
    { name: 'actionbutton-info', template: 'canopsis/uibase/templates/actionbutton-info.hbs', classes: ["action"], icon : "info-sign",label : "Info" },
    { name: 'actionbutton-create', template: 'canopsis/uibase/templates/actionbutton-create.hbs', classes: ["action", "toolbar"], icon : "plus-sign", label : "Create" },
    { name: 'actionbutton-removeselection', template: 'canopsis/uibase/templates/actionbutton-removeselection.hbs', classes: ["action", "toolbar"], icon : "trash", label : "Remove selection" },
    { name: 'actionbutton-remove', template: 'canopsis/uibase/templates/actionbutton-remove.hbs', classes: ["action", "toolbar"], icon : "trash", label : "Remove" },
    { name: 'actionbutton-incident', template: 'canopsis/uibase/templates/actionbutton-incident.hbs', classes: ["action", "toolbar"],icon : "ticket", label : "Incident" },
    { name: 'actionbutton-ticketnumber', template: 'canopsis/uibase/templates/actionbutton-ticketnumber.hbs', classes: ["action", "toolbar"],icon : "ticket", label : "Ticket nummber" },

    { name: 'actionbutton-history', template: 'canopsis/uibase/templates/actionbutton-history.hbs', classes: ["action", "toolbar"],icon : "time", label : "History" },
    { name: 'actionbutton-eventnavigation', template: 'canopsis/uibase/templates/actionbutton-eventnavigation.hbs', classes: ["action", "toolbar"],icon : "time", label : "Event navigation" },
    // { name: 'actionbutton-viewrights', template: 'canopsis/uibase/templates/actionbutton-viewrights.hbs', classes: ["action", "toolbar"],icon : "time", label : "View rights" },

    { name: 'formbutton-submit', template: 'canopsis/uibase/templates/formbutton-submit.hbs', classes: ["formbutton"] },
    { name: 'formbutton-cancel', template: 'canopsis/uibase/templates/formbutton-cancel.hbs', classes: ["formbutton"] },
    { name: 'formbutton-ack', template: 'canopsis/uibase/templates/formbutton-ack.hbs', classes: ["formbutton"] },
    { name: 'formbutton-ackandproblem', template: 'canopsis/uibase/templates/formbutton-ackandproblem.hbs', classes: ["formbutton"] },
    { name: 'formbutton-incident', template: 'canopsis/uibase/templates/formbutton-incident.hbs', classes: ["formbutton"] },
    { name: 'formbutton-delete', template: 'canopsis/uibase/templates/formbutton-delete.hbs', classes: ["formbutton"] },
    { name: 'formbutton-previous', template: 'canopsis/uibase/templates/formbutton-previous.hbs', classes: ["formbutton"] },
    { name: 'formbutton-next', template: 'canopsis/uibase/templates/formbutton-next.hbs', classes: ["formbutton"] },
    { name: 'formbutton-inspectform', template: 'canopsis/uibase/templates/formbutton-inspectform.hbs', classes: ["formbutton"] },

    { name: 'titlebarbutton-duplicate', template: 'canopsis/uibase/templates/titlebarbutton-duplicate.hbs', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-moveup', template: 'canopsis/uibase/templates/titlebarbutton-moveup.hbs', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-movedown', template: 'canopsis/uibase/templates/titlebarbutton-movedown.hbs', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-moveleft', template: 'canopsis/uibase/templates/titlebarbutton-moveleft.hbs', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-moveright', template: 'canopsis/uibase/templates/titlebarbutton-moveright.hbs', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-minimize', template: 'canopsis/uibase/templates/titlebarbutton-minimize.hbs', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-widgeterrors', template: 'canopsis/uibase/templates/titlebarbutton-widgeterrors.hbs', classes: ["titlebarbutton"] },

    { name: 'actionbutton-foldable', template: 'canopsis/uibase/templates/actionbutton-foldable.hbs' ,  classes: ["foldable"]},
    { name: 'column-unfold', template: 'canopsis/uibase/templates/column-unfold.hbs' ,  classes: ["foldable"]},
    { name: 'groupedrowslistlayout', template: 'canopsis/uibase/templates/groupedrowslistlayout.hbs' ,  classes: ["foldable"]},
    { name: 'groupedrowslistlinelayout', template: 'canopsis/uibase/templates/groupedrowslistlinelayout.hbs' ,  classes: ["foldable"]},
    { name: 'stackedcolumns', template: 'canopsis/uibase/templates/stackedcolumns.hbs' ,  classes: ["foldable"]},

    { name: 'verticallayout', template: 'canopsis/uibase/templates/verticallayout.hbs' ,  classes: ["layout"]},
    { name: 'horizontallayout', template: 'canopsis/uibase/templates/horizontallayout.hbs' ,  classes: ["layout"]},
    { name: 'gridlayout', template: 'canopsis/uibase/templates/gridlayout.hbs' ,  classes: ["layout"]},
    { name: 'lightlayout', template: 'canopsis/uibase/templates/lightlayout.hbs' ,  classes: ["layout"]},
    { name: 'tablayout', template: 'canopsis/uibase/templates/tablayout.hbs' ,  classes: ["layout"]},
    { name: 'mixineditdropdown', template: 'canopsis/uibase/templates/mixineditdropdown.hbs'},
    { name: 'draggableheaders', template: 'canopsis/uibase/templates/draggableheaders.hbs'},
    { name: 'tabledraggableth', template: 'canopsis/uibase/templates/tabledraggableth.hbs'},
    { name: 'loading', template: 'canopsis/uibase/templates/loading.hbs'},
    { name: 'loadingindicator', template: 'canopsis/uibase/templates/loadingindicator.hbs'}
];

loader.loadWithTemplates(templates);
