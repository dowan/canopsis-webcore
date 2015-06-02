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
    'ember',
    'ember-data',
    'app/lib/factories/form',
    'canopsis/canopsis-rights/objects/rightsregistry',
    'app/lib/utils/forms',
    'app/lib/utils/hash',
    'app/lib/utils/data',
    'app/lib/widgetsregistry'
], function(Ember, DS, FormFactory, rightsregistry, formsUtils, hashUtils, dataUtils, widgets) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    /**
     * @class ViewrightsForm
     * @extends Form
     * @constructor
     * @description Form allowing to edit view rights directly from the views list.
     */
    var form = FormFactory('viewrightsform', {
        isLoading: true,

        checksums: [{
            value: undefined,
            label: __('Nothing')
        },{
            value: 15,
            label: __('Can view')
        }],

        /**
         * @property formattedViewName
         * @type string
         * @description View id with dots replaced by underscores
         */
        formattedViewName: function() {
            return get(this, 'formContext.id').replace('.', '_');
        }.property('formContext.id'),

        /**
         * @property viewAction
         * @type Action
         * @description Action tied to the edited view
         */
        viewAction: function() {
            return rightsregistry.getByName(get(this, 'formattedViewName'));
        }.property('formattedViewName'),

        rolesChanged: function() {
            var viewrightname = get(this, 'formattedViewName'),
                rightsArray = Ember.A(),
                roles = get(this, 'roles');

            for (var i = 0, l = roles.length; i < l; i++) {
                var currentRole = roles[i];
                var checksum = currentRole.get('rights.' + viewrightname + '.checksum');

                if(checksum === -1) {
                    checksum = 0;
                }

                console.log('rolesChanged', currentRole, checksum);
                rightsArray.pushObject({
                    role: currentRole.id,
                    checksum: checksum,
                    name: viewrightname
                });
            }
            Ember.setProperties(this, {
                rightsArray: rightsArray,
            });

            this.computeRolesWithoutRights();

            set(this, 'addedRole', get(this, 'rolesWithoutRights').objectAt(0).get('_id'));
        },

        onRightChecksumChange: function(right) {
            console.log('onRightChecksumChange', right, this);

            var viewrightsform = this;
            var rightId = get(right, 'role');
            var viewrightname = get(this, 'formattedViewName');
            var currentRole = get(this, 'roles').findBy('crecord_name',rightId);

            set(currentRole, 'rights.' + viewrightname + '.checksum' , get(right, 'checksum'));

            viewrightsform.rolesChanged();

            currentRole.save();
        },

        computeRolesWithoutRights: function() {
            var roles = get(this, 'roles'),
                rolesWithoutRights = Ember.A(),
                viewrightname = get(this, 'formattedViewName');


            for (var i = 0, l = roles.length; i < l; i++) {
                var currentRole = roles[i];
                var checksum = get(currentRole, 'rights.' + viewrightname + '.checksum');

                if(isNone(checksum) || checksum === 0 || checksum === -1) {
                    rolesWithoutRights.pushObject(currentRole);
                }
            }

            set(this, 'rolesWithoutRights', rolesWithoutRights);
        },

        actions: {
            show: function() {

                var profilesStore = DS.Store.create({ container: get(this, "container") }),
                    formController = this;

                profilesStore.findQuery('role', {}).then(function(queryResults) {
                    set(formController, 'roles', get(queryResults, 'content'));

                    formController.rolesChanged();

                    Ember.setProperties(formController, {
                        isLoading: false,
                        roles: get(queryResults, 'content')
                    });
                });
            },

            initializeViewAction: function() {
                var viewrightname = get(this, 'formattedViewName'),
                    formController = this;

                var right = dataUtils.getStore().createRecord('action', {
                      enable: true,
                      crecord_type: 'action',
                      type: 'RW',
                      _id: viewrightname,
                      id: viewrightname,
                      crecord_name: viewrightname,
                      desc: 'Rights on view : ' + get(this, 'formContext.id')
                });
                right.save();

                rightsregistry.add(right, get(right, 'crecord_name'));
                set(this, 'viewAction', right);
            },

            addNewRight: function () {
                var roles = get(this, 'roles');
                var viewrightsform = this;

                var addedRole = get(this, 'addedRole');

                if(addedRole === undefined) {
                    addedRole = get(this, 'rolesWithoutRights').objectAt(0).get('_id');
                }

                addedRole = roles.findBy('_id', get(this, 'addedRole'));
                var viewrightname = get(this, 'formattedViewName');

                if(isNone(get(addedRole, 'rights'))) {
                    set(addedRole, 'rights', {});
                }
                if(isNone(get(addedRole, 'rights.' + viewrightname))) {
                    set(addedRole, 'rights.' + viewrightname, {checksum: 4});
                }

                set(addedRole, 'rights.' + viewrightname + '.checksum', 4);

                set(this, 'isLoading', false);

                viewrightsform.rolesChanged();

                addedRole.save();
            }
        }
    });

    return form;
});
