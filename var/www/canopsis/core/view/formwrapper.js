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
    'app/view/form',
    'app/lib/utils/drag',
], function($, Ember, FormView, drag) {

    var get = Ember.get,
        set = Ember.set,
        isNone =Ember.isNone;

    var view = Ember.View.extend({
        init: function() {
            this._super();
            console.log("formwrapper view init", this, get(this, 'controller'));

            set(this,'controller.widgetwrapperView', this);
        },

        formViewClass : FormView,

        didInsertElement: function () {
            drag.setDraggable(this.$('#formwrapper .modal-header'), this.$('#formwrapper'));
        },

        //Controller -> View Hooks
        registerHooks: function() {
            this.hooksRegistered = true;

            console.log("registerHooks", this);
            this.get("controller").on('validate', this, this.hidePopup);
            this.get("controller").on('hide', this, this.hidePopup);

            var formwrapperView = this;

            $('#formwrapper').on('hidden.bs.modal', function () {
                formwrapperView.onPopupHidden.apply(formwrapperView, arguments);
            });
        },

        unregisterHooks: function() {
            this.get("controller").off('validate', this, this.hidePopup);
            this.get("controller").off('hide', this, this.hidePopup);
        },

        //regular methods
        showPopup: function() {
            console.log("view showPopup");
            if(!this.hooksRegistered) {
                this.registerHooks();
            }

            //show and display centered !
            this.$("#formwrapper").modal('show').css('top',0).css('left',0);

            if(get(this, 'controller.form')) {
                get(this, 'controller.form').send('show');
            }
        },

        hidePopup: function() {
            console.log("view hidePopup");
            $("#formwrapper").modal("hide");
        },

        onPopupHidden: function() {
            console.log("onPopupHidden", arguments);
            var submit = get(this, 'controller.form.submit');
            if (!isNone(submit) && submit.state() === "pending") {
                console.info("rejecting form submission");
                get(this, 'controller.form').send("abort");
            }
        }
    });


    loader.register('view:formwrapper', view);

    return view;
});
