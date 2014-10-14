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

    var set = Ember.set,
        get = Ember.get,
        isNone = Ember.isNone;

    var component = Ember.Component.extend({
        init: function() {
            this._super();

            if(!isNone(get(this, 'content'))) {

                console.debug('filter content is not none', get(this, 'content'));

                var content = JSON.parse(get(this, 'content'));

                set(this,'domain', content.domain);
                set(this,'perimeter', content.perimeter);
                if(content['ack.isAck']) {
                    //not both value
                    //isAck filter can be "true" or "{$ne: true}"
                    set(this,'ack', content['ack.isAck'] === true);
                }

            } else {

                set(this, 'errorMessage', 'Filter remains incomplete');

            }

        },


        actions: {
            setAck : function (acktype) {
                set(this, 'ack', acktype);
            }
        },

        isackboth: function () {
            return get(this, 'ack') === 'both' || get(this, 'ack') === undefined;
        }.property('ack'),

        isacktrue: function () {
            return get(this, 'ack') === true;
        }.property('ack'),

        isackfalse: function () {
            return get(this, 'ack') === false;
        }.property('ack'),

        isEmpty: function (value) {
            return isNone(value) || value === '';
        },

        updateContent: function () {

            var ack = get(this, 'ack');
            var perimeter = get(this, 'perimeter');
            var domain = get(this, 'domain');

            if(this.isEmpty(perimeter) || this.isEmpty(domain)) {
                set(this, 'errorMessage', 'Filter remains incomplete');
                set(this, 'content', undefined);
            } else {
                set(this, 'errorMessage', undefined);

                var filter = {
                    perimeter: perimeter,
                    domain: domain
                };
                if (ack === true) {
                    filter['ack.isAck'] = ack;
                } else if (ack === false) {
                    filter['ack.isAck'] = {'$ne' : true};
                }
                set(this, 'content', JSON.stringify(filter));
            }

        }.observes('ack', 'domain', 'perimeter')

    });

    Application.ComponentCfilter3Component = component;

    return component;
});
