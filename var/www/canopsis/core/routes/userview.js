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

define([
    'app/application',
    'app/routes/authenticated'
], function(Application, AuthenticatedRoute) {
    var set = Ember.set,
        get = Ember.get;

    Application.UserviewRoute = AuthenticatedRoute.extend({
        needs: ['application'],
       actions: {
            error: function(error, transition){
                if (error.status === 0) {
                } else if (error.status == 403) {
                    //go to some default route
                } else if (error.status == 401) {
                    //handle 401
                } else if (error.status == 404) {
                    this.transitionTo('/userview/view.404');
                } else {
                    showErrorDialog(error);
                }
            }
        },
        setupController: function(controller, model) {
            console.log('UserviewRoute setupController', model, controller);
            set(controller, 'controllers.application.currentViewId', get(model, 'id'));

            controller.setProperties( {
                'content': model,
                'isMainView': true
            });

            controller.trigger('refreshView');
        }
    });

    return Application.UserviewIndexRoute;
});