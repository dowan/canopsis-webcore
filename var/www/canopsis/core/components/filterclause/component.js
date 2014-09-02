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

	Application.ComponentFilterclauseComponent = Ember.Component.extend({
		tagName: 'span',
		classNames: 'filterclause',

		editionMode: false,

		init: function() {
			this._super(arguments);
			console.log('ComponentFilterclauseComponent init');
			console.log(this.get('content'));
			console.log(this.get('content.operator'));
			if(! this.get('content.key')) {
				this.finalized = false;
			} else {
				this.finalized = true;
			}
		},

		finalized: false,

		actions: {
			editAndClause: function() {
				this.set('editionMode', true);
			},

			startEditClause: function() {
				this.get('content').set('filling', true);
			},

			removeAndClause: function(parentClause, clauseToRemove) {
				this.get('parent').send('removeAndClause', parentClause, clauseToRemove);
			},

			onAddKey: function(inputValue) {
				console.log("onAddKey", inputValue);
				var clauses = this.get('clauses');
				var currentClauseIndex = this.get('currentClauseIndex');

				if (currentClauseIndex >= 0) {
					var currentClause = clauses.objectAt(currentClauseIndex);
					var lastAndOfClause = currentClause.and[currentClause.and.length -1];
					console.log('focusOutInput', currentClause, lastAndOfClause.options.available_indexes);

					if (this.get('onlyAllowRegisteredIndexes') === true) {
						//detect if inputValue is in available_indexes
						console.group('onlyAllowRegisteredIndexes check');
						for (var i = 0; i < lastAndOfClause.options.available_indexes.length; i++) {
							var currentIndex = lastAndOfClause.options.available_indexes[i];
							console.log('currentIndex', currentIndex);

							if (currentIndex.value === inputValue) {
								console.log('currentIndex validated', currentIndex, inputValue);
								lastAndOfClause.set('key', inputValue);
							}
						}
						console.groupEnd();
					}
					else {
						lastAndOfClause.set('key', inputValue);
					}
				}
				return true;
			},

			focusOutKeyInput: function() {
				console.log("focusOutInput", arguments);
			},

			validateClause: function(thisElement) {
				var inputValue = this.get('content.value');
				var inputKey = this.get('content.key');

				var andClausePart = thisElement.templateData.keywords.andClausePart;

				console.log("focusOutInput", arguments);
				if (inputValue !== undefined && inputValue !== null && inputValue !== '') {
					var clauses = this.get('clauses');
					var currentClauseIndex = this.get('currentClauseIndex');

					if (currentClauseIndex >= 0 && this.keyIsValid(inputKey, andClausePart)) {
						var currentClause = clauses.objectAt(currentClauseIndex);
						console.log('focusOutInput', currentClause);
						this.set('content.value', inputValue);
						this.set('content.finalized', true);
						this.set('finalized', true);
						this.set('content.filling', false);

						if (/*this.get('editionMode') === false &&*/ this.get('onlyAllowRegisteredIndexes') === false) {
							this.get('parent').send('addAndClause');
						}

						this.set('editionMode', false);
					}
				}
			}
		},

		keyIsValid: function(inputValue, andClausePart) {
			var currentClauseIndex = this.get('currentClauseIndex');

			var clauses = this.get('clauses');
			var currentClause = clauses.objectAt(currentClauseIndex);

			console.log("keyIsValid", inputValue, currentClauseIndex, currentClause, andClausePart);

			if (this.get('onlyAllowRegisteredIndexes') === true && andClausePart.options.available_indexes !== undefined) {
				//detect if inputValue is in available_indexes
				console.group('onlyAllowRegisteredIndexes check');
				for (var i = 0; i < andClausePart.options.available_indexes.length; i++) {
					var currentIndex = andClausePart.options.available_indexes[i];
					console.log('currentIndex', currentIndex);

					if (currentIndex.value === inputValue) {
						console.log('currentIndex validated', currentIndex, inputValue);
						andClausePart.set('key', inputValue);
						return true;
					}
				}
				console.groupEnd();
			} else {
				return true;
			}
			return false;
		}
	});

	return Application.ComponentFilterclauseComponent;
});