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
    'app/lib/contextsregistry',
    'app/lib/utils/hash'
], function(Ember, contextsregistry, hashUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;


    var component = Ember.Component.extend({
        contexts: contextsregistry.all,

        init: function () {
            this._super();

            this.set('store', DS.Store.create({
                container: this.get('container')
            }));
        },

        destroy: function() {
            this._super();

            this.get('store').destroy();
        },

        helpModal: {
            title: __('Syntax'),
            content: ['<ul>',
                '<li><code>co:regex</code> : ', __('look for a component'), '</li>',
                '<li><code>re:regex</code> : ', __('look for a resource'), '</li>' ,
                '<li><code>me:regex</code> : ' , __('look for a metric') , '(<code>me:</code>' , __(' isn\'t needed for this one') , ')</li>' ,
                '<li>', __('combine all of them to improve your search'),' : <code>co:regex re:regex me:regex</code></li>' ,
                '<li><code>co:</code>, <code>re:</code>, <code>me:</code> : ', __('look for non-existant field') , '</li>' ,
                '</ul>'].join(''),

            id: hashUtils.generateId('cmetric-help-modal'),
            label: hashUtils.generateId('cmetric-help-modal-label')
        },

        actions: {
            select: function(item) {
                set(this, 'content', get(item, '_id'));
            },

            search: function(search) {
                if(search) {
                    var mfilter = this.build_filter(search);
                    set(this, 'contextSearch', mfilter);
                }
                else {
                    set(this, 'contextSearch', null);
                }
            },

            clearselection: function() {
                set(this, 'content', undefined);
            }
        },

        build_filter: function(search) {
            var conditions = search.split(' ');
            var i;

            var patterns = {
                component: [],
                resource: [],
                id: []
            };

            for(i = 0; i < conditions.length; i++) {
                var condition = conditions[i];

                if(condition !== '') {
                    var regex = condition.slice(3) || null;

                    if(condition.indexOf('co:') === 0) {
                        patterns.component.push(regex);
                    }
                    else if(condition.indexOf('re:') === 0) {
                        patterns.resource.push(regex);
                    }
                    else if(condition.indexOf('me:') === 0) {
                        patterns.id.push(regex);
                    }
                    else {
                        patterns.id.push(condition);
                    }
                }
            }

            var mfilter = {'$and': []};
            var filters = {
                component: {'$or': []},
                resource: {'$or': []},
                id: {'$or': []}
            };

            for(var key in filters) {
                for(i = 0; i < patterns[key].length; i++) {
                    var filter = {};
                    var value = patterns[key][i];

                    if(value !== null) {
                        filter[key] = {'$regex': value};
                    }
                    else {
                        filter[key] = null;
                    }

                    filters[key].$or.push(filter);
                }

                var len = filters[key].$or.length;

                if(len === 1) {
                    filters[key] = filters[key].$or[0];
                }

                if(len > 0) {
                    mfilter.$and.push(filters[key]);
                }
            }

            if(mfilter.$and.length === 1) {
                mfilter = mfilter.$and[0];
            }

            return mfilter;
        },

        columns: function() {
            var contextType = get(this, 'contextType');

            switch(contextType) {
                case 'ctxcomponent':
                    return [
                        {name: 'id', title: __('Component')},
                        {
                            action: 'select',
                            actionAll: (get(this, 'multiselect') === true ? 'selectAll' : undefined),
                            title: new Ember.Handlebars.SafeString('<span class="glyphicon glyphicon-plus-sign"></span>'),
                            style: 'text-align: center;'
                        }
                    ];
                case 'ctxresource':
                    return [
                        {name: 'component', title: __('Component')},
                        {name: 'id', title: __('Resource')},
                        {
                            action: 'select',
                            actionAll: (get(this, 'multiselect') === true ? 'selectAll' : undefined),
                            title: new Ember.Handlebars.SafeString('<span class="glyphicon glyphicon-plus-sign"></span>'),
                            style: 'text-align: center;'
                        }
                    ];
                default:
                    return [
                        {name: 'component', title: __('Component')},
                        {name: 'resource', title: __('Resource')},
                        {name: 'id', title: __('Metric')},
                        {
                            action: 'select',
                            actionAll: (get(this, 'multiselect') === true ? 'selectAll' : undefined),
                            title: new Ember.Handlebars.SafeString('<span class="glyphicon glyphicon-plus-sign"></span>'),
                            style: 'text-align: center;'
                        }
                    ];
            }
        }.property('contextType')
    });


    Ember.Application.initializer({
        name:"component-contextselector",
        initialize: function(container, application) {
            application.register('component:component-contextselector', component);
        }
    });

    return component;
});
