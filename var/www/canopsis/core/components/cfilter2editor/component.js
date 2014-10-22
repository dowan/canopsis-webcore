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
    'app/application',
    'app/lib/business/cfilter2clause',
    'app/lib/business/cfilter2condition',
], function(Ember, Application, Clause, Condition) {

    var set = Ember.set,
        get = Ember.get;


    var component = Ember.Component.extend({


        operations: [
            {
                label: __('equal'),
                value: '$eq',
                symbol : '='
            },
            {
                label: __('not equal'),
                value: '$ne',
                symbol : '!='
            },
            {
                label: __('lower than'),
                value: '$lt',
                symbol : '<='
            },
            {
                label: __('greater than'),
                value: '$gt',
                symbol : '>='

            },
            {
                label: __('is in'),
                value: '$in',
                symbol : 'in'

            },
            {
                label: __('not in'),
                value: '$nin',
                symbol : 'not in'

            },
            {
                label: __('regex'),
                value: '$regex',
                symbol : 'regex'
            },
            {
                label: __(' not regex'),
                value: '$notregex',
                symbol : 'not regex'
            }
        ],

        query: {'$and': [
            {'plop': 1 },
            {'$or': [1,2,3]}
        ]},


        init: function() {
            this._super();


            //if (!Ember.isNone(this.get('content'))) {
                this.initializeEditor();
            //}


        },

        initializeEditor: function () {
            //TEMP TO REMOVE MOCK VALUES
            var condition = Condition.create({
                label: 'AND',
                value: '$and',
            });

            for (var i = 0; i < 2; i++) {
                var clause = Clause.create({
                    'property': 'property' + i,
                    'operation': {label:'operation' + i},
                    'value': 'value' + i,
                });
                get(condition, 'clauses').pushObject(clause);
            }


            var condition1 = Condition.create({
                label: 'OR',
                value: '$or',
            });
            get(condition, 'conditions').pushObject(condition1);


            set(this, 'query', condition);

        },


        actions: {

            setProperty: function (property) {
                set(this, 'selectedProperty', property);
            },

            setOperation: function (operation) {
                set(this, 'selectedOperation', operation);
            },

            addClause: function () {
                if ( Ember.isNone(get(this, 'selectedProperty')) ||
                    Ember.isNone(get(this, 'selectedOperation')) ||
                    Ember.isNone(get(this, 'propertyValue'))) {

                    set(this, 'errorMessage', __('Property is not well defined'));

                } else {
                    set(this, 'errorMessage', undefined);
                    var cfilterController = this;

                    var clause = Clause.create({
                        'property': get(cfilterController, 'selectedProperty'),
                        'operation': get(cfilterController, 'selectedOperation'),
                        'value': get(cfilterController, 'propertyValue'),
                    });
                    get(this, 'clauses').pushObject(clause);
                    console.log(clause);
                }
            },

            removeClause: function (clause) {
                console.log('clause to delete', clause);
                get(this, 'clauses').removeObject(clause);
            }


        }

    });

    Application.ComponentCfilter2editorComponent = component;

    return component;
});
