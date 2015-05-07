/*
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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/

define([
    'jquery',
    'ember',
    'app/lib/factories/widget',
    'utils',
    'app/lib/utils/forms',
    'app/lib/utils/routes',
    'canopsis/canopsis-rights/lib/utils/rightsflags',
    'app/lib/wrappers/bootstrap'
], function($, Ember, WidgetFactory, utils, formsUtils, routesUtils, rightsflagsUtils) {

    var get = Ember.get,
        set = Ember.set;


    var widget = WidgetFactory('uimaintabcollection', {
        needs: ['application', 'login'],

        currentViewId: Ember.computed.alias('controllers.application.currentViewId'),

        user: Ember.computed.alias('controllers.login.record._id'),
        rights: Ember.computed.alias('controllers.login.record.rights'),

        tagName: 'span',

        userCanEditView: function() {
            if(get(utils, 'session._id') === "root") {
                return true;
            }

            var rights = get(utils, 'session.rights'),
                viewId = get(this, 'currentViewId');
                viewId = viewId.replace('.', '_');

            if (rightsflagsUtils.canWrite(get(rights, viewId + '.checksum'))) {
                return true;
            }

            return false;
        }.property('currentViewId'),


        preparedTabs: function() {
            var uimaintabcollectionController = this;

            var res = Ember.A();

            get(this, 'tabs').forEach(function(item, index) {
                if(item.value === get(uimaintabcollectionController, 'currentViewId')) {
                    set(item, 'isActive', true);
                } else {
                    set(item, 'isActive', false);
                }

                var user = get(utils, 'session._id'),
                    rights = get(utils, 'session.rights');

                //FIXME stop using utils to store data!
                if(user === "root") {
                    set(item, 'displayable', true);
                } else {
                    viewId = item.value;
                    viewId = viewId.replace('.', '_');
                    if (viewId && rightsflagsUtils.canRead(get(rights, viewId + '.checksum'))) {
                        set(item, 'displayable', true);
                    } else {
                        set(item, 'displayable', false);
                    }
                }

                res.pushObject(item);
            });

            return res;
        }.property('tabs', 'currentViewId'),

        actions: {
            do: function(action, params) {
                if(params === undefined || params === null){
                    params = [];
                }

                this.send(action, params);
            },

            showViewOptions: function() {

                var userviewController = routesUtils.getCurrentRouteController();
                var userview = userviewController.get('model');

                var widgetWizard = formsUtils.showNew('viewtreeform', userview, { title: __('Edit userview') });
                console.log('widgetWizard', widgetWizard);

                var widgetController = this;

                widgetWizard.submit.done(function() {
                    userview.save().then(function(){
                        get(widgetController, 'viewController').send('refresh');
                    });
                });

            }
        }
    });

    return widget;
});
