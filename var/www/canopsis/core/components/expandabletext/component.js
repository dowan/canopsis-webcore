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
    'ember',
    'app/application'
], function(Ember, Application) {
    var get = Ember.get,
        set = Ember.set;

    function textAbstract(text, length) {
        if (text === null || text === undefined) {
            return "";
        }
        if (text.length <= length) {
            return text;
        }
        text = text.substring(0, length);
        last = text.lastIndexOf(" ");
        text = text.substring(0, last);
        return text;
    }

    var component = Ember.Component.extend({
        tagName: 'span',

        maxLength : 5,

        formattedContent: function() {

            var maxLength = get(this, 'maxLength');
            var text = get(this, 'content');
            console.log('format content', text);

            if (text.length <= maxLength) {
                set(this, 'contentIsTruncated', false);
            } else {
                set(this, 'contentIsTruncated', true);
            }

            return textAbstract(text, maxLength);
        }.property('content')
    });

    Application.ComponentExpandabletextComponent = component;

    return component;
});
