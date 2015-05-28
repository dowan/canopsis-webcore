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
    'app/lib/factories/mixin'
], function(Ember, Mixin) {

    var get = Ember.get,
        set = Ember.set;

    var viewMixin = Ember.Mixin.create({

        didInsertElement: function() {
            this._super();
            var mixinView = this;

            $("#uploadmib").uploadFile({
                url: '/uploadmib',
                onSuccess:function(files, data, xhr)
                {
                    console.log('On upload succes', files, data, xhr);
                    var controller = get(mixinView, 'controller');
                    var message = new Ember.Handlebars.SafeString(data.data[0].message);
                    set(controller, 'message', message);
                    set(controller, 'filename', files[0]);
                    //hide message ten seconds later
                    setTimeout(function () {
                        set(controller, 'message', '');
                    }, 10000);
                }
            });

        },
    });

    var mixin = Mixin('uploadmib', {
        partials: {
            actionToolbarButtons: ['actionbutton-uploadmib']
        },

        init: function() {
            this._super();
            this.addMixinView(viewMixin);
        }
    });


    return mixin;
});
