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
    { name: 'application', template: 'canopsis/uibase/templates/application.html' },
    { name: 'index', template: 'canopsis/uibase/templates/index.html' },
    { name: 'formwrapper', template: 'canopsis/uibase/templates/formwrapper.html' },
    { name: 'recordinfopopup', template: 'canopsis/uibase/templates/recordinfopopup.html' },
    { name: 'widgettitlebar', template: 'canopsis/uibase/templates/widgettitlebar.html' },
    { name: 'userview', template: 'canopsis/uibase/templates/userview.html' },
    { name: 'widget', template: 'canopsis/uibase/templates/widget.html' },
    { name: 'listline', template: 'canopsis/uibase/templates/listline.html' },
    { name: 'widgetslot-default', template: 'canopsis/uibase/templates/widgetslot-default.html' },
    { name: 'widgetslot-grey', template: 'canopsis/uibase/templates/widgetslot-grey.html' },
    { name: 'partialslot', template: 'canopsis/uibase/templates/partialslot.html' },
    { name: 'pagination', template: 'canopsis/uibase/templates/pagination.html' },
    { name: 'itemsperpage', template: 'canopsis/uibase/templates/itemsperpage.html' },
    { name: 'search', template: 'canopsis/uibase/templates/search.html' },
    { name: 'customfilters', template: 'canopsis/uibase/templates/customfilters.html' },

    { name: 'timeintervalselection', template: 'canopsis/uibase/templates/timeintervalselection.html' },
    { name: 'userstatusmenu', template: 'canopsis/uibase/templates/userstatusmenu.html' },
    { name: 'schemamanagerstatusmenu', template: 'canopsis/uibase/templates/schemamanagerstatusmenu.html' },
    { name: 'notificationsstatusmenu', template: 'canopsis/uibase/templates/notificationsstatusmenu.html' },
    { name: 'consolemanagerstatusmenu', template: 'canopsis/uibase/templates/consolemanagerstatusmenu.html' },
    { name: 'promisemanagerstatusmenu', template: 'canopsis/uibase/templates/promisemanagerstatusmenu.html' },
    { name: 'presettoolbar', template: 'canopsis/uibase/templates/presettoolbar.html' },
    { name: 'rightschecksumbuttons', template: 'canopsis/uibase/templates/rightschecksumbuttons.html' },

    { name: 'actionbutton-edit', template: 'canopsis/uibase/templates/actionbutton-edit.html', classes: ["action"], icon : "pencil", label : "Edit"},
    { name: 'actionbutton-ack', template: 'canopsis/uibase/templates/actionbutton-ack.html', classes: ["action", "toolbar"], icon : "ok", label : "Ack"},
    { name: 'actionbutton-cancel', template: 'canopsis/uibase/templates/actionbutton-cancel.html', classes: ["action", "toolbar"], icon : "ban-circle", label : "Cancel"},
    { name: 'actionbutton-changestate', template: 'canopsis/uibase/templates/actionbutton-changestate.html', classes: ["action", "toolbar"],icon : "retweet", label : "Change criticity" },
    { name: 'actionbutton-show', template: 'canopsis/uibase/templates/actionbutton-show.html', classes: ["action"], icon : "eye-open",label : "Show" },
    { name: 'actionbutton-info', template: 'canopsis/uibase/templates/actionbutton-info.html', classes: ["action"], icon : "info-sign",label : "Info" },
    { name: 'actionbutton-create', template: 'canopsis/uibase/templates/actionbutton-create.html', classes: ["action", "toolbar"], icon : "plus-sign", label : "Create" },
    { name: 'actionbutton-removeselection', template: 'canopsis/uibase/templates/actionbutton-removeselection.html', classes: ["action", "toolbar"], icon : "trash", label : "Remove selection" },
    { name: 'actionbutton-incident', template: 'canopsis/uibase/templates/actionbutton-incident.html', classes: ["action", "toolbar"],icon : "ticket", label : "Incident" },
    { name: 'actionbutton-ticketnumber', template: 'canopsis/uibase/templates/actionbutton-ticketnumber.html', classes: ["action", "toolbar"],icon : "ticket", label : "Ticket nummber" },

    { name: 'actionbutton-history', template: 'canopsis/uibase/templates/actionbutton-history.html', classes: ["action", "toolbar"],icon : "time", label : "History" },
    { name: 'actionbutton-eventnavigation', template: 'canopsis/uibase/templates/actionbutton-eventnavigation.html', classes: ["action", "toolbar"],icon : "time", label : "Event navigation" },

    { name: 'formbutton-submit', template: 'canopsis/uibase/templates/formbutton-submit.html', classes: ["formbutton"] },
    { name: 'formbutton-cancel', template: 'canopsis/uibase/templates/formbutton-cancel.html', classes: ["formbutton"] },
    { name: 'formbutton-ack', template: 'canopsis/uibase/templates/formbutton-ack.html', classes: ["formbutton"] },
    { name: 'formbutton-ackandproblem', template: 'canopsis/uibase/templates/formbutton-ackandproblem.html', classes: ["formbutton"] },
    { name: 'formbutton-incident', template: 'canopsis/uibase/templates/formbutton-incident.html', classes: ["formbutton"] },
    { name: 'formbutton-delete', template: 'canopsis/uibase/templates/formbutton-delete.html', classes: ["formbutton"] },
    { name: 'formbutton-previous', template: 'canopsis/uibase/templates/formbutton-previous.html', classes: ["formbutton"] },
    { name: 'formbutton-next', template: 'canopsis/uibase/templates/formbutton-next.html', classes: ["formbutton"] },
    { name: 'formbutton-inspectform', template: 'canopsis/uibase/templates/formbutton-inspectform.html', classes: ["formbutton"] },

    { name: 'titlebarbutton-moveup', template: 'canopsis/uibase/templates/titlebarbutton-moveup.html', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-movedown', template: 'canopsis/uibase/templates/titlebarbutton-movedown.html', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-moveleft', template: 'canopsis/uibase/templates/titlebarbutton-moveleft.html', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-moveright', template: 'canopsis/uibase/templates/titlebarbutton-moveright.html', classes: ["titlebarbutton"] },
    { name: 'titlebarbutton-minimize', template: 'canopsis/uibase/templates/titlebarbutton-minimize.html', classes: ["titlebarbutton"] },

    { name: 'actionbutton-foldable', template: 'canopsis/uibase/templates/actionbutton-foldable.html' ,  classes: ["foldable"]},
    { name: 'column-unfold', template: 'canopsis/uibase/templates/column-unfold.html' ,  classes: ["foldable"]},
    { name: 'groupedrowslistlayout', template: 'canopsis/uibase/templates/groupedrowslistlayout.html' ,  classes: ["foldable"]},
    { name: 'groupedrowslistlinelayout', template: 'canopsis/uibase/templates/groupedrowslistlinelayout.html' ,  classes: ["foldable"]},
    { name: 'stackedcolumns', template: 'canopsis/uibase/templates/stackedcolumns.html' ,  classes: ["foldable"]},
    { name: 'configuremixinbutton', template: 'canopsis/uibase/templates/configuremixinbutton.html'}
];

loader.loadWithTemplates(templates);
