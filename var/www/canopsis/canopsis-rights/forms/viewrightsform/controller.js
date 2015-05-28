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
    'app/lib/utils/forms',
    'app/lib/utils/hash',
    'app/lib/widgetsregistry'
], function(Ember, DS, FormFactory, formsUtils, hashUtils, widgets) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var form = FormFactory('viewrightsform', {
        isLoading: true,

        checksums: [{
            value: undefined,
            label: __('Nothing')
        },{
            value: 15,
            label: __('Can view')
        }],

        rolesChanged: function() {
            var viewrightname = get(this, 'formContext.id').replace('.', '_'),
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
        },

        onRightChecksumChange: function(right) {
            console.log('onRightChecksumChange', right, this);

            var viewrightsform = this;
            var rightId = get(right, 'role');
            var viewrightname = get(this, 'formContext.id').replace('.', '_');
            var currentRole = get(this, 'roles').findBy('crecord_name',rightId);

            set(currentRole, 'rights.' + viewrightname + '.checksum' , get(right, 'checksum'));

            currentRole.save().then(function () {
                viewrightsform.rolesChanged();
            }).fail(function() {
                console.error('fail', arguments);
            });
        },

        computeRolesWithoutRights: function() {
            var roles = get(this, 'roles'),
                rolesWithoutRights = Ember.A(),
                viewrightname = get(this, 'formContext.id').replace('.', '_');


            for (var i = 0, l = roles.length; i < l; i++) {
                var currentRole = roles[i];
                var checksum = get(currentRole, 'rights.' + viewrightname + '.checksum');

                if(isNone(checksum) || checksum === -1) {
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

            addNewRight: function () {
                var roles = get(this, 'roles');
                var viewrightsform = this;

                var addedRole = roles.findBy('_id', get(this, 'addedRole')),
                    viewrightname = get(this, 'formContext.id').replace('.', '_');

                console.log('addNewRight', addedRole, roles);
                if(isNone(get(addedRole, 'rights'))) {
                    set(addedRole, 'rights', {});
                }
                if(isNone(get(addedRole, 'rights.' + viewrightname))) {
                    set(addedRole, 'rights.' + viewrightname, {checksum: 4});
                }

                // alert('role added 1');

                set(addedRole, 'rights.' + viewrightname + '.checksum', 4);

                set(this, 'isLoading', false);

                console.log("addedRole", JSON.stringify(addedRole));
                var promise = addedRole.save();

                promise.then(function() {
                    viewrightsform.rolesChanged();
                });
            },

            deleteRight: function (right) {
                console.log('deleteRight', right);
                var viewrightsform = this;
                var rightId = get(right, 'role');
                var viewrightname = get(this, 'formContext.id').replace('.', '_');
                var currentRole = get(this, 'roles').findBy('crecord_name',rightId);

                set(currentRole, 'rights.' + viewrightname + '.checksum' , -1);

                currentRole.save().then(function () {
                    viewrightsform.rolesChanged();
                }).fail(function() {
                    console.error('fail', arguments);
                });
            }
        }
    });

    return form;
});
