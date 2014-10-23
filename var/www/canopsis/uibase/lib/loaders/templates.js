/*
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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/

var templates = [
    { name: 'application', url: 'canopsis/uibase/templates/application' },
    { name: 'index', url: 'canopsis/uibase/templates/index' },
    { name: 'formwrapper', url: 'canopsis/uibase/templates/formwrapper' },
    { name: 'recordinfopopup', url: 'canopsis/uibase/templates/recordinfopopup' },
    { name: 'widgettitlebar', url: 'canopsis/uibase/templates/widgettitlebar' },
    { name: 'userview', url: 'canopsis/uibase/templates/userview' },
    { name: 'widget', url: 'canopsis/uibase/templates/widget' },
    { name: 'listline', url: 'canopsis/uibase/templates/listline' },
    { name: 'widgetslot-default', url: 'canopsis/uibase/templates/widgetslot-default' },
    { name: 'widgetslot-grey', url: 'canopsis/uibase/templates/widgetslot-grey' },
    { name: 'partialslot', url: 'canopsis/uibase/templates/partialslot' },
    { name: 'pagination', url: 'canopsis/uibase/templates/pagination' },
    { name: 'itemsperpage', url: 'canopsis/uibase/templates/itemsperpage' },
    { name: 'search', url: 'canopsis/uibase/templates/search' },
    { name: 'customfilters', url: 'canopsis/uibase/templates/customfilters' },

    { name: 'timeintervalselection', url: 'canopsis/uibase/templates/timeintervalselection' },
    { name: 'userstatusmenu', url: 'canopsis/uibase/templates/userstatusmenu' },
    { name: 'schemamanagerstatusmenu', url: 'canopsis/uibase/templates/schemamanagerstatusmenu' },
    { name: 'notificationsstatusmenu', url: 'canopsis/uibase/templates/notificationsstatusmenu' },
    { name: 'consolemanagerstatusmenu', url: 'canopsis/uibase/templates/consolemanagerstatusmenu' },
    { name: 'promisemanagerstatusmenu', url: 'canopsis/uibase/templates/promisemanagerstatusmenu' },
    { name: 'presettoolbar', url: 'canopsis/uibase/templates/presettoolbar' },
    { name: 'rightschecksumbuttons', url: 'canopsis/uibase/templates/rightschecksumbuttons' },

    { name: 'actionbutton-edit', url: 'canopsis/uibase/templates/actionbutton-edit', classes: ["action"], icon : "pencil", label : "Edit"},
    { name: 'actionbutton-ack', url: 'canopsis/uibase/templates/actionbutton-ack', classes: ["action", "toolbar"], icon : "ok", label : "Ack"},
    { name: 'actionbutton-cancel', url: 'canopsis/uibase/templates/actionbutton-cancel', classes: ["action", "toolbar"], icon : "ban-circle", label : "Cancel"},
    { name: 'actionbutton-changestate', url: 'canopsis/uibase/templates/actionbutton-changestate', classes: ["action", "toolbar"],icon : "retweet", label : "Change criticity" },
    { name: 'actionbutton-show', url: 'canopsis/uibase/templates/actionbutton-show', classes: ["action"], icon : "eye-open",label : "Show" },
    { name: 'actionbutton-info', url: 'canopsis/uibase/templates/actionbutton-info', classes: ["action"], icon : "info-sign",label : "Info" },
    { name: 'actionbutton-create', url: 'canopsis/uibase/templates/actionbutton-create', classes: ["action", "toolbar"], icon : "plus-sign", label : "Create" },
    { name: 'actionbutton-removeselection', url: 'canopsis/uibase/templates/actionbutton-removeselection', classes: ["action", "toolbar"], icon : "trash", label : "Remove selection" },
    { name: 'actionbutton-incident', url: 'canopsis/uibase/templates/actionbutton-incident', classes: ["action", "toolbar"],icon : "ticket", label : "Incident" },
    { name: 'actionbutton-ticketnumber', url: 'canopsis/uibase/templates/actionbutton-ticketnumber', classes: ["action", "toolbar"],icon : "ticket", label : "Ticket nummber" },

    { name: 'actionbutton-history', url: 'canopsis/uibase/templates/actionbutton-history', classes: ["action", "toolbar"],icon : "time", label : "History" },
    { name: 'actionbutton-eventnavigation', url: 'canopsis/uibase/templates/actionbutton-eventnavigation', classes: ["action", "toolbar"],icon : "time", label : "Event navigation" },

    { name: 'formbutton-submit', url: 'canopsis/uibase/templates/formbutton-submit', classes: ["formbutton"] },
    { name: 'formbutton-cancel', url: 'canopsis/uibase/templates/formbutton-cancel', classes: ["formbutton"] },
    { name: 'formbutton-ack', url: 'canopsis/uibase/templates/formbutton-ack', classes: ["formbutton"] },
    { name: 'formbutton-ackandproblem', url: 'canopsis/uibase/templates/formbutton-ackandproblem', classes: ["formbutton"] },
    { name: 'formbutton-incident', url: 'canopsis/uibase/templates/formbutton-incident', classes: ["formbutton"] },
    { name: 'formbutton-delete', url: 'canopsis/uibase/templates/formbutton-delete', classes: ["formbutton"] },
    { name: 'formbutton-previous', url: 'canopsis/uibase/templates/formbutton-previous', classes: ["formbutton"] },
    { name: 'formbutton-next', url: 'canopsis/uibase/templates/formbutton-next', classes: ["formbutton"] },
    { name: 'formbutton-inspectform', url: 'canopsis/uibase/templates/formbutton-inspectform', classes: ["formbutton"] },

    { name: 'titlebarbutton-moveup', url: 'canopsis/uibase/templates/titlebarbutton-moveup', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-movedown', url: 'canopsis/uibase/templates/titlebarbutton-movedown', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-moveleft', url: 'canopsis/uibase/templates/titlebarbutton-moveleft', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-moveright', url: 'canopsis/uibase/templates/titlebarbutton-moveright', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-minimize', url: 'canopsis/uibase/templates/titlebarbutton-minimize', classes: ["titlebarbutton"] },

    { name: 'actionbutton-foldable', url: 'canopsis/uibase/templates/actionbutton-foldable' ,  classes: ["foldable"]},
    { name: 'column-unfold', url: 'canopsis/uibase/templates/column-unfold' ,  classes: ["foldable"]}
];

loader.loadTemplates(templates);
