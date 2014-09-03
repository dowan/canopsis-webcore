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
	'jquery',
	'ember',
	'app/application'
], function($, Ember, Application) {
	var get = Ember.get,
		set = Ember.set;

	Application.ComponentCfilterComponent = Ember.Component.extend({
		init:function() {
			var cfilter_serialized = this.get('cfilter_serialized');

			set(this, 'onlyAllowRegisteredIndexes', get(Canopsis.conf.frontendConfig, 'cfilter_allow_only_optimized_filters'));

			set(Canopsis, "tooltips.unlockIndexes", 'Unlock indexes. This might lead to huge performance issues!');
			set(Canopsis, "tooltips.lockIndexes", 'Lock indexes');

			if(get(this, 'content') !== null && get(this, 'content') !== undefined) {
				this.set('cfilter_serialized', get(this, 'content'));
			} else if(cfilter_serialized === undefined || cfilter_serialized === null) {
				this.set('cfilter_serialized', '{}');
			}

			this._super.apply(this, arguments);
		},

		currentClauseIndex: -1,

		cfilter_serialized : Ember.computed.alias('content'),
		viewTabColumns: [{ name:"component", title:"component"},{ name:"resource", title:"resource"}],

		clauses: function() {
			var cfilter_serialized = this.get('cfilter_serialized');
			var clauses = Ember.A();
			var mfilter = JSON.parse(cfilter_serialized);

			console.log('deserializeCfilter', cfilter_serialized, clauses.length);
			console.log('mfilter', mfilter);

			if(mfilter.$or === undefined) {
				return clauses;
			}

			for (var i = 0; i < mfilter.$or.length; i++) {
				var currentMfilterOr = mfilter.$or[i];
				var currentOr = Ember.Object.create({
					and: Ember.A()
				});

				if (currentMfilterOr.$and !== undefined) {
					for (var j = 0; j < currentMfilterOr.$and.length; j++) {
						var currentMfilterAnd = currentMfilterOr.$and[j];

						var clauseKey = Ember.keys(currentMfilterAnd)[0];
						var clauseOperator = Ember.keys(currentMfilterAnd[clauseKey])[0];
						console.log(currentMfilterAnd[clauseKey][clauseOperator]);
						var clauseValue = currentMfilterAnd[clauseKey][clauseOperator];

						//deserialize in array value to a string with comma separator
						if ((clauseOperator === 'not in' || clauseOperator === 'in') && typeof clauseValue === 'object') {
							clauseValue = clauseValue.join(',');
						}


						var keys = this.getIndexesForNewAndClause(currentOr);

						var field = {
							isFirst : (j === 0),
							keyId: this.get('cfilterEditId') + '-keys-' + (j + 1),
							options: {
								'available_indexes' : keys
							},
							key: clauseKey,
							value: clauseValue,
							operator: this.getLabelForMongoOperator(clauseOperator),
							lastOfList : true,
							filling: false,
							finalized: true
						};

						var currentField = Ember.Object.create(field);

						console.log('field:', currentField);
						// currentAnd.pushObject(currentField);
						currentOr.and.pushObject(currentField);
					}
					clauses.pushObject(currentOr);
				}
			}
			console.log('clause deserialized', clauses);

			return clauses;

		}.property(),

		classNames: ["cfilter"],

		indexesTree: {
			'component': {
				'_metas': {
					'name': "Component"
				},
				'resource': {
					'_metas': {
						'name': "Resource",
						'final':true
					}
				}
			},
			'connector': {
				'_metas': {
					'name': "connector"
				},
				'component': {
					'_metas': {
						'name': "Component"
					},
					'resource': {
						'_metas': {
							'name': "Resource",
							'final':true
						}
					}
				}
			}
		},

		operators: [
			{
				label: '=',
				value: '$eq'
			},
			{
				label: "!=",
				value: '$ne'
			},
			{
				label: "<",
				value: '$lt'
			},
			{
				label: ">",
				value: '$gt'
			},
			{
				label: "in",
				value: '$in'
			},
			{
				label: "not in",
				value: '$nin'
			},
			{
				label: "regex",
				value: '$regex'
			},
			{
				label: "!regex",
				value: '$notregex'
			}
		],

		orButtonHidden: false,

		//initialized in this class' constructor
		onlyAllowRegisteredIndexes: true,

		serializeCfilter: function() {
			var clauses = this.get('clauses');

			var mfilter = {
				'$or': []
			};


			for (var i = 0, l_clauses = clauses.length; i < l_clauses; i++) {
				var clause = clauses[i];

				var subfilter = {
					'$and': []
				};

				if (clause.and[0] !== undefined) {
					set(clause.and[0], 'isFirst', true);
				}

				for (var j = 0, l_and = clause.and.length; j < l_and; j++) {
					var field = clause.and[j];

					if(j === 0) {
						set(field, 'isFirst', true);
					} else {
						set(field, 'isFirst', false);
					}

					set(field, 'finalized', true);

					if (j === clause.and.length -1) {
						set(clause.and[j], 'isLast', true);
					} else {
						set(clause.and[j], 'isLast', false);
					}

					if (clause.and[j].operator === 'in' || clause.and[j].operator === 'not in') {
						console.log('Operator in detected');
						try {
							clause.and[j].value = clause.and[j].value.split(',');
						} catch (err) {
							console.warn('Malformed list for in operator');
							clause.and[j].value = [clause.and[j].value];
						}
					} else {
						//manage numbers inputs and cast them to number if numeric.
						if (typeof clause.and[j].value === 'string' && $.isNumeric(clause.and[j].value)) {
							clause.and[j].value = parseFloat(clause.and[j].value);
						}
					}

					if (field.key !== undefined) {
						var item = {};
						console.log("field", field);
						var operator = "$eq";

						if (field.operator !== undefined) {
							operator = this.getMongoOperatorForLabel(field.operator);
						}

						item[field.key] = {};
						item[field.key][operator] = field.value;

						subfilter.$and.push(item);
					}

				}

				if (subfilter.$and.length > 0) {
					if (subfilter.$and.length === 1) {
						subfilter = subfilter.$and[0];
					}

					mfilter.$or.push(subfilter);
				}
			}

			mfilter = JSON.stringify(mfilter, null, '    ');
			return mfilter;
		},

		getMongoOperatorForLabel: function(label) {
			for (var i = 0; i < this.operators.length; i++) {
				if (this.operators[i].label === label) {
					return this.operators[i].value;
				}
			}

			return undefined;
		},

		getLabelForMongoOperator: function(mongoOperator) {
			for (var i = 0; i < this.operators.length; i++) {
				if (this.operators[i].value === mongoOperator) {
					return this.operators[i].label;
				}
			}

			return undefined;
		},

		checkIfNewAndClauseDisplayed : function() {

			var currentClauseIndex = this.get('currentClauseIndex');
			if (currentClauseIndex >= 0) {
				var clauses = this.get('clauses');
				var currentClause = clauses.objectAt(currentClauseIndex);

				var lastAndOfClause = currentClause.and[currentClause.and.length - 1];

				var isEmpty = function(value) {
					if (value === undefined || value === '') {
						return true;
					} else {
						return false;
					}
				};

				if (lastAndOfClause !== undefined && isEmpty(lastAndOfClause.key) && isEmpty(lastAndOfClause.value)) {
					this.set('newAndClauseDisplayed', false);
					return;
				}

				this.set('newAndClauseDisplayed', true);

				return;
			} else {
				this.set('newAndClauseDisplayed', false);
				return;
			}
		}.observes('currentClauseIndex'),

		clausesChanged: function() {
			var clauses = this.get('clauses');

			console.log('clausesChanged', clauses, this.get('cfilter_serialized'));

			//detect if we have to display the addOrClause button
			if (clauses.length === 0) {
				this.set('orButtonHidden', false);
			} else {
				var lastOrClause = clauses[clauses.length -1];
				console.log('last and length', clauses);
				console.log('last and length', lastOrClause);
				console.log('last and length', lastOrClause.and.length);
				if (lastOrClause.and.length <= 1) {
					this.set('orButtonHidden', true);
				} else {
					this.set('orButtonHidden', false);
				}
			}

			var mfilter = this.serializeCfilter();
			console.log('generated mfilter', mfilter);
			this.set('cfilter_serialized', mfilter);
		},

		cfilterId: function() {
			return this.get('elementId') + '-cfilter';
		}.property('elementId'),

		cfilter: function() {
			return $('#' + this.get('cfilterId'));
		},

		cfilterEditId: function() {
			return this.get('cfilterId') + '-edit';
		}.property('cfilterId'),

		cfilterEditTabId: function() {
			return '#' + this.get('cfilterEditId');
		}.property('cfilterEditId'),

		cfilterEdit: function() {
			return $(this.get('cfilterEditTabId'));
		},

		cfilterRawId: function() {
			return this.get('cfilterId') + '-raw';
		}.property('cfilterId'),

		cfilterRawTabId: function() {
			return '#' + this.get('cfilterRawId');
		}.property('cfilterRawId'),

		cfilterRaw: function() {
			return $(this.get('cfilterRawTabId'));
		},

		cfilterViewId: function() {
			return this.get('cfilterId') + '-view';
		}.property('cfilterId'),

		cfilterViewTabId: function() {
			return '#' + this.get('cfilterViewId');
		}.property('cfilterViewId'),

		cfilterView: function() {
			return $(this.get('cfilterViewTabId'));
		},

		getIndexesForNewAndClause: function(currentClause) {
			console.group('getIndexesForNewAndClause useIndexesOptions : ', get(this, 'onlyAllowRegisteredIndexes'), currentClause);

			if(get(this, 'onlyAllowRegisteredIndexes') === true) {

				console.group('getIndexesForNewAndClause', currentClause);

				var indexesTreeCursor = this.get('indexesTree');

				for (var i = 0; i < currentClause.and.length; i++) {
					var currentAnd = currentClause.and[i];
					console.log('currentAnd', currentAnd);
					indexesTreeCursor = indexesTreeCursor[currentAnd.key];
					if (indexesTreeCursor === undefined) {
						console.error('bad index management', currentAnd.key);
					}
					console.log('indexesTreeCursor', indexesTreeCursor);
				}

				console.info('available indexes', indexesTreeCursor);

				var available_indexes = [];

				for (var key in indexesTreeCursor) {
					console.log('iter', key, indexesTreeCursor[key]);
					if (key !== '_metas') {
						available_indexes.push({name: indexesTreeCursor[key]._metas.name, value: key, _metas: indexesTreeCursor[key]._metas});
					}
				}

				console.groupEnd();
				return available_indexes;
			}

			console.log('no index available because "use indexes" option is disabled');
			console.groupEnd();
		},

		pushEmptyClause: function(currentClause) {
			console.group('pushEmptyAndClause');

			var keys = this.getIndexesForNewAndClause(currentClause);

			console.log('available_indexes', keys);

			var field = {
				keyId: this.get('cfilterEditId') + '-keys-' + (currentClause.and.length + 1),

				options: {
					'available_indexes' : keys
				},
				key: undefined,
				value: undefined,
				operator: '=',
				lastOfList : true,
				filling: false,
				finalized: false
			};

			var lastAndClauseOfList = currentClause.and[currentClause.and.length - 2];
			console.log('and array', currentClause.and);
			console.log('lastAndClauseOfList', lastAndClauseOfList);

			if (lastAndClauseOfList !== undefined) {
				set(lastAndClauseOfList, 'lastOfList', false);
			}

			if (get(this, 'onlyAllowRegisteredIndexes') === false || field.options.available_indexes.length > 0) {
				currentClause.and.pushObject(Ember.Object.create(field));
			}

			console.groupEnd('pushEmptyClause');
		},

		actions: {
			unlockIndexes: function() {
				set(this, 'onlyAllowRegisteredIndexes', false);
			},
			lockIndexes: function() {
				set(this, 'onlyAllowRegisteredIndexes', true);
			},
			addAndClause: function(wasFinalized) {
				console.log('Add AND clause');

				var clauses = this.get('clauses');
				var currentClauseIndex = this.get('currentClauseIndex');

				if (currentClauseIndex >= 0) {
					var currentClause = clauses.objectAt(currentClauseIndex);
					var useIndexes = get(this, 'onlyAllowRegisteredIndexes');
					
					//console.log(' + current clause was bidule', wasFinalized, 'use index', useIndexes);
					//if (useIndexes || !wasFinalized) {
						this.pushEmptyClause(currentClause);
					//}
				}

				console.log('clauses addAndClause', clauses);
				this.set('clauses', clauses);
				this.clausesChanged();
			},

			addOrClause: function() {
				var clauses = this.get('clauses');
				console.group('Add OR clause', clauses);

				var currentClauseIndex = this.get('currentClauseIndex');
				var currentClause;

				if (currentClauseIndex >= 0) {
					currentClause = clauses.objectAt(currentClauseIndex);
					currentClause.set('current', false);
				}

				currentClause = clauses.pushObject(
					Ember.Object.create({
						current: true,
						and: []
					})
				);

				this.set('currentClauseIndex', clauses.length - 1);

				this.send('addAndClause');
				this.send('activate', currentClause);

				console.groupEnd();
			},

			activate: function(clause) {
				var clauses = this.get('clauses');
				var currentClauseIndex = this.get('currentClauseIndex');

				var newCurrentClauseIndex = clauses.indexOf(clause);

				if (currentClauseIndex !== newCurrentClauseIndex) {
					console.log('Activate clause:', clause);

					if (currentClauseIndex >= 0) {
						clauses.objectAt(currentClauseIndex).set('current', false);
					}

					clause.set('current', true);

					console.log('changing currentClauseIndex');

					this.set('currentClauseIndex', newCurrentClauseIndex);
				}
			},

			removeAndClause: function(selectedClause, removedAnd) {
				console.log('removeAndClause');

				var currentClause;
				var deletedClauseIndex;
				var clauses = this.get('clauses');
				var eraseSuccessors = false;

				for (var i = 0; i < selectedClause.and.length; i++) {
					var currentAnd = selectedClause.and.objectAt(i);
					console.log('currentAnd', currentAnd);
					if (eraseSuccessors === true) {
						selectedClause.and.removeAt(i);
						i--;
					}

					if (currentAnd === removedAnd) {
						selectedClause.and.removeAt(i);
						console.log('processing delete', selectedClause.and, selectedClause.and.objectAt(i - 1));
						var lastClauseOfList = selectedClause.and.objectAt(i - 1);
						if(lastClauseOfList !== undefined) {
							set(lastClauseOfList, 'lastOfList', true);
						}
						i--;

						if (this.get('onlyAllowRegisteredIndexes') === true) {
							eraseSuccessors = true;
							if (i === -1) {

								console.log('the clause will be empty, drop it and quit');

								var removedClause = selectedClause;

								for (var j = 0; j < clauses.length; j++) {
									currentClause = clauses[j];
									if (currentClause === removedClause) {
										clauses.removeAt(j);

										if (this.get('currentClauseIndex') >= j) {
											this.set('currentClauseIndex', this.get('currentClauseIndex') - 1);
										}

										this.clausesChanged();
										return;
									}
								}
							}
						}
					}
				}

				if (selectedClause !== undefined && get(this, 'onlyAllowRegisteredIndexes') === true) {
					this.pushEmptyClause(selectedClause);
				}

				this.clausesChanged();
			}
		}
	});

	return Application.ComponentCfilterComponent;
});