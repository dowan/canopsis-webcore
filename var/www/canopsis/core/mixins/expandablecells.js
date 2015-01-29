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
    'jquery'
], function(Ember, $) {

    var get = Ember.get,
        set = Ember.set;


    var mixin = Ember.Mixin.create({
        classNames: ['list'],

        didInsertElement: function() {
            //reactivate this for table overflow
            // this.$('table').tableOverflow();

            var list = this;

            this.$('td').resize(function(){
                var td = $(this);
                var element = td.children('.renderer');

                if(element === undefined) {
                    return;
                }

                td.removeClass('overflowed');
                td.unbind('mouseover');
                var $divs = td.children('.placeddiv');
                if($divs.length) {
                    $divs.remove();
                }

                var el_w = element.width(), td_w = td.width();

                if(el_w > td_w) {

                    td.addClass('overflowed');
                    td.mouseenter(function(){
                        var $divs = td.children('.placeddiv');
                        if($divs.length) {
                            return;
                        }

                        var newDiv = $('<div class="placeddiv">content</div>');

                        td.append(newDiv);

                        var offset = td.offset();

                        newDiv.css('padding', td.css('padding'));
                        newDiv.css('backgroundColor', td.css('backgroundColor'));
                        newDiv.css('position', 'absolute');

                        newDiv.offset(offset);
                        newDiv.html(element.html());

                        var tdHeight = td.parent().height(),
                            divHeight = newDiv.height();

                        if(tdHeight > divHeight) {
                            newDiv.css('height', tdHeight);
                        } else {
                            newDiv.css('height', divHeight);
                        }

                        td.on('mouseleave', function(e) {
                            newDiv.remove();
                        });
                   });
                }
            });

            this.$('td').resize();
            this._super.apply(this, arguments);
        }
    });

    return mixin;
});
