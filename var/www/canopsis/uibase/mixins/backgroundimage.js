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
    'app/lib/utils/forms',
    'app/lib/utils/hash',
    'app/lib/factories/mixin',
    'webcore-libs/stacktable/stacktable',
    'link!webcore-libs/stacktable/stacktable.css'
], function(Ember, formsUtils, hashUtils, Mixin) {

    var get = Ember.get,
        set = Ember.set;


    var viewMixin = Ember.Mixin.create({
        didInsertElement: function() {
            var imageUrl = get(this, 'controller.mixinOptions.backgroundimage.imageUrl'),
                position = get(this, 'controller.mixinOptions.backgroundimage.position'),
                repeat = get(this, 'controller.mixinOptions.backgroundimage.repeat'),
                size = get(this, 'controller.mixinOptions.backgroundimage.size'),
                element = this.$();

            if(imageUrl) {
                element.css('background-image', 'url(' + imageUrl + ')');
            }
            if(position) {
                element.css('background-position', position);
            }
            if(size) {
                element.css('background-size', size);
            }
            if(repeat) {
                element.css('background-repeat', repeat);
            }

            this._super();
        }
    });


    var mixin = Mixin('backgroundimage', {
        init: function() {
            this._super();
            this.addMixinView(viewMixin);
        }
    });

    return mixin;
});
