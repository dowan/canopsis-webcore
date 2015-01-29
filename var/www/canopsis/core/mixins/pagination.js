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
        set = Ember.set,
        isNone = Ember.isNone;


    /**
      Implements pagination in ArrayControllers

      You should define on the ArrayController:
          - the `findOptions` property
          - the `findItems()` method

    */
    var mixin = Mixin('pagination', {
        partials: {
            subHeader: ['pagination', 'itemsperpage'],
            footer: ['pagination', 'pagination-infos']
        },

        init:function () {
            this.itemsPerPagePropositionSelected = get(this, 'content.itemsPerPage');
            this._super.apply(this, arguments);
            if(isNone(get(this, 'itemsPerPagePropositionSelected'))){
                var itemsperpage = this.getItemsPerPage();
                set(this, 'itemsPerPagePropositionSelected', itemsperpage);
            }
        },

        itemsPerPage: function() {
            console.log('itemsperpage CP', this, this.mixinOptions.pagination, get(this, 'mixinOptions.pagination.itemsPerPage'));

            var itemsPerPage = get(this, 'mixinOptions.pagination.itemsPerPage');

            if(!itemsPerPage) {
                itemsPerPage = 5;
            }

            return itemsPerPage;
        }.property('mixinOptions.pagination.itemsPerPage'),

        paginationMixinContent: function() {
            console.warn("paginationMixinContent should be defined on the concrete class");
        },

        paginationMixinFindOptions: function() {
            console.warn("paginationMixinFindOptions should be defined on the concrete class");
        },

        actions: {
            prevPage: function() {
                if (get(this, 'currentPage') > 1) {
                    set(this, 'currentPage', get(this, 'currentPage') - 1);
                }
            },
            nextPage: function() {
                if (get(this, 'currentPage') < get(this, 'totalPages')) {
                    set(this, 'currentPage', get(this, 'currentPage') + 1);
                }
            },
            firstPage: function() {
                this.set('currentPage', 1);
            },
            lastPage: function() {
                if (get(this, 'currentPage') < get(this, 'totalPages')) {
                    set(this, 'currentPage', get(this, 'totalPages'));
                }
            }
        },

        currentPage: 1,

        itemsDivided: function(){
            return get(this, 'itemsTotal') / get(this, 'mixinOptions.pagination.itemsPerPage');
        }.property('itemsTotal', 'mixinOptions.pagination.itemsPerPage'),

        itemsPerPagePropositions : function() {
            var res = Ember.A([5, 10, 20, 50]);
            var itemsPerPagePropositionSelected = get(this, 'itemsPerPagePropositionSelected');
            if( itemsPerPagePropositionSelected !== 5 &&
                itemsPerPagePropositionSelected !== 10 &&
                itemsPerPagePropositionSelected !== 20 &&
                itemsPerPagePropositionSelected !== 50) {
                res.pushObject(itemsPerPagePropositionSelected);
            }
            return res;
        }.property('itemsPerPagePropositionSelected'),

        itemsPerPageChanged : function() {
            if(get(this, 'itemsPerPageChangedInitialLock') !== undefined) {
                set(this, 'currentPage', 1);

                this.refreshContent();
            }
            set(this, 'itemsPerPageChangedInitialLock', true);
        }.observes('mixinOptions.pagination.itemsPerPage'),

        onCurrentPageChanges: function() {
            this.refreshContent();
        }.observes('currentPage'),

        itemsPerPagePropositionSelectedChanged: function() {
            var userSelection = get(this, 'itemsPerPagePropositionSelected');
            if(get(this, 'userParams') !== undefined) {
                set(this, 'userParams.itemsPerPage', userSelection);
                this.saveUserConfiguration();
            }
            //Big dirty hack in order to make it work.
            set(this, 'itemsPerPage', userSelection);
            set(this, 'mixinOptions.pagination.itemsPerPage', userSelection);

        }.observes('itemsPerPagePropositionSelected'),


        refreshContent: function() {
            console.group('paginationMixin refreshContent', get(this, 'mixinOptions.pagination.itemsPerPage'));

            if (get(this, 'paginationMixinFindOptions') === undefined) {
                set(this, 'paginationMixinFindOptions', {});
            }

            var itemsPerPage = this.getItemsPerPage();
            var start = itemsPerPage * (this.currentPage - 1);

            Ember.setProperties(this, {
                'paginationMixinFindOptions.start': start,
                'paginationFirstItemIndex': start + 1,
                'paginationMixinFindOptions.limit': itemsPerPage
            });

            this._super.apply(this, arguments);

            console.groupEnd();
        },

        getItemsPerPage: function() {
            var itemsPerPage = get(this, 'userParams.itemsPerPage') || get(this, 'mixinOptions.pagination.itemsPerPage');

            console.log('itemsPerPage is', itemsPerPage, 'type', typeof itemsPerPage);

            if(itemsPerPage === undefined || itemsPerPage === 0) {
                itemsPerPage = 5;
            }

            //HACK when widget is saved and the app is not refreshed, itemsPerPage is a string!
            if (typeof itemsPerPage === 'string') {
                itemsPerPage = parseInt(itemsPerPage, 10);
            }
            if (itemsPerPage === 0) {
                console.warn("itemsPerPage is 0 in widget", this);
                console.warn("assuming itemsPerPage is 5");
                itemsPerPage = 5;
            }
            if (typeof itemsPerPage !== 'number' || itemsPerPage % 1 !== 0) {
                itemsPerPage = 5;
            }

            return itemsPerPage;
        },

        paginationLastItemIndex: function () {
            var itemsPerPage = this.getItemsPerPage();

            var start = itemsPerPage * (this.currentPage - 1);

            return start + itemsPerPage;
        }.property('widgetData'),

        paginationFirstItemIndex: function () {
            var itemsPerPage = this.getItemsPerPage();

            var start = itemsPerPage * (this.currentPage - 1);

            return start + 1;
        }.property('widgetData'),

        itemsTotal: function() {
            return get(this, 'widgetDataMetas').total;
        }.property('widgetDataMetas', 'widgetData'),

        totalPages: function() {
            if (get(this, 'itemsTotal') === 0) {
                return 0;
            } else {
                var itemsPerPage = this.getItemsPerPage();
                return Math.ceil(get(this, 'itemsTotal') / itemsPerPage);
            }
        }.property('itemsTotal'),

        extractItems: function(queryResult) {
            get(this, 'paginationMixinContent');

            var itemsPerPage = get(this, 'userParams.itemsPerPage') || get(this, 'mixinOptions.pagination.itemsPerPage') || 5;
            if (itemsPerPage === 0) {
                console.warn("itemsPerPage is 0 in widget", this);
                console.warn("assuming itemsPerPage is 5");
                itemsPerPage = 5;
            }

            this._super(queryResult);
        }
    });

    return mixin;
});
