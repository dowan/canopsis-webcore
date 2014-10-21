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
    'ember-data',
    'app/application',
    'app/lib/utils/hash',
    'app/adapters/context'
], function(Ember, DS, Application, hash) {

    var get = Ember.get,
        set = Ember.set;

    Application.ComponentCmetricComponent = Ember.Component.extend({
        selectedMetrics: undefined,
        metricSearch: null,

        valueChanged: function() {
            var metrics = get(this, 'selectedMetrics');
            var ids = [];

            for(var i = 0, l = metrics.length; i < l; i++) {
                var m_id = get(metrics[i], 'id');
                ids.push(m_id);
            }

            set(this, 'content', ids);
        }.observes('selectedMetrics.@each'),

        helpModal: {
            title: 'Syntax',
            content: "<ul>"
                + "<li><code>co:regex</code> : look for a component</li>"
                + "<li><code>re:regex</code> : look for a resource</li>"
                + "<li><code>me:regex</code> : look for a metric (<code>me:</code> isn't needed for this one)</li>"
                + "<li>combine all of them to improve your search : <code>co:regex re:regex me:regex</code></li>"
                + "<li><code>co:</code>, <code>re:</code>, <code>me:</code> : look for non-existant field</li>"
                + "</ul>",

            id: hash.generateId('cmetric-help-modal'),
            label: hash.generateId('cmetric-help-modal-label')
        },

        select_cols: function() {
            return [
                {name: 'component', title: 'Component'},
                {name: 'resource', title: 'Resource'},
                {name: 'cid', title: 'Metric'},
                {
                    action: 'select',
                    actionAll: 'selectAll',
                    title: new Ember.Handlebars.SafeString('<span class="glyphicon glyphicon-plus-sign"></span>'),
                    style: 'text-align: center;'
                }
            ];
        }.property(),

        unselect_cols: function() {
            return [
                {name: 'component', title: 'Component'},
                {name: 'resource', title: 'Resource'},
                {name: 'cid', title: 'Metric'},
                {
                    action: 'unselect',
                    actionAll: 'unselectAll',
                    title: new Ember.Handlebars.SafeString('<span class="glyphicon glyphicon-trash"></span>'),
                    style: 'text-align: center;'
                }
            ];
        }.property(),

        init: function() {
            this._super(arguments);

            var store = DS.Store.create({
                container: this.get('container')
            });

            set(this, 'componentDataStore', store);

            var content = get(this, 'content') || [];
            var me = this;

            var query = {
                filter: {
                    '_id': {'$in': content}
                }
            };

            store.findQuery('ctxmetric', query).then(function(result) {
                var metrics = get(me, 'selectedMetrics') || [];

                var content = get(result, 'content');
                var l = get(result, 'meta.total');

                console.log('Received data:', l, content, metrics);

                for(var i = 0; i < l; i++) {
                    metrics.pushObject(content[i]);
                }

                set(me, 'selectedMetrics', metrics);
            });
        },

        build_filter: function(search) {
            var conditions = search.split(' ');
            var i;

            var patterns = {
                component: [],
                resource: [],
                cid: []
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
                        patterns.cid.push(regex);
                    }
                    else {
                        patterns.cid.push(condition);
                    }
                }
            }

            var mfilter = {'$and': []};
            var filters = {
                component: {'$or': []},
                resource: {'$or': []},
                cid: {'$or': []}
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

                    filters[key].$or.push(filter)
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

        actions: {
            select: function(metric) {
                var selected = get(this, 'selectedMetrics');

                if (selected.indexOf(metric) < 0) {
                    console.log('Select metric:', metric);
                    selected.pushObject(metric);
                }

                set(this, 'selectedMetrics', selected);
            },

            unselect: function(metric) {
                var selected = get(this, 'selectedMetrics');

                var idx = selected.indexOf(metric);

                if (idx >= 0) {
                    console.log('Unselect metric:', metric);
                    selected.removeAt(idx);
                }

                set(this, 'selectedMetrics', selected);
            },

            selectAll: function() {
                var store = get(this, 'componentDataStore');
                var metrics = store.findAll('ctxmetric');

                set(this, 'selectedMetrics', metrics);
            },

            unselectAll: function() {
                set(this, 'selectedMetrics', []);
            },

            search: function(search) {
                if(search) {
                    var mfilter = this.build_filter(search);
                    set(this, 'metricSearch', mfilter);
                }
                else {
                    set(this, 'metricSearch', null);
                }
            }
        },

        didInsertElement: function() {
            $('#' + get(this, 'helpModal.id')).popover({trigger: 'hover'});
        }
    });

    return Application.ComponentMetricselectorComponent;
});
