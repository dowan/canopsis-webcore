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
    'jquery',
    'canopsis/canopsisConfiguration',
    'app/lib/utilityclass'
], function($, conf, Utility) {


    var i18n = Utility.create({

        name: 'i18n',

        todo: [],
        translations: {},
        newTranslations: true,
        _: function(word, noDeprecation) {

            if(Ember && noDeprecation === undefined) {
                Ember.deprecate('You should not use i18n tools directly when ember is loaded. Please consider using Ember.String.loc instead. ', !conf.EmberIsLoaded);
            }

            if (typeof word !== 'string') {
                //This is not an interesting data type
                return word;
            } else if (!isNaN(parseInt(word))) {
                //This is just a number, it is useless to translate it.
                return word;
            } else {
                translated = i18n.translations[i18n.lang][word];

                if (translated) {
                    return i18n.showTranslation(translated);
                } else {
                    var isTranslated = true;
                    //adding translation to todo list
                    if (i18n.todo.indexOf(word) === -1) {

                        i18n.todo.push(word);
                        i18n.newTranslations = true;
                        isTranslated = false;

                    }
                    //returns original not translated string
                    return i18n.showTranslation(word, isTranslated);
                }
            }
        },
        showTranslation: function (word, isTranslated) {
            if (conf.SHOW_TRANSLATIONS) {
                if(isTranslated) {
                    circleColor = 'text-success';
                } else {
                    circleColor = 'text-danger';
                }
                return word + '<span class="fa-stack superscript"><i class="fa fa-circle fa-stack-2x ' + circleColor + '"></i><i class="fa fa-flag fa-stack-1x fa-inverse"></i></span>';
            } else {
                return word;
            }
        },

        uploadDefinitions: function () {

            $.ajax({
                url: '/rest/object/i18n',
                type: 'POST',
                data: JSON.stringify({
                    id: 'translations',
                    todo: i18n.todo,
                    crecord_type: 'i18n'
                }),
                success: function(data) {
                    if (data.success) {
                        console.log('Upload lang upload complete');
                    }
                },
                async: false
            });
        },

        downloadDefinitions: function () {

            $.ajax({
                url: '/i18n/' + i18n.lang,
                success: function(data) {
                    if (data.success) {
                        i18n.translations[i18n.lang] = data.data[0];
                    }
                },
                async: false
            }).fail(function () {
                console.log('initialization case. translation is now ready');
            });

            if (conf.DEBUG && conf.TRANSLATE) {
                $.ajax({
                    url: '/rest/object/i18n',
                    success: function(data) {
                        if (data.success && data.data && data.data.length) {
                            for (var item in data.data[0].todo) {
                                i18n.todo[item] = data.data[0].todo[item];
                            }
                            console.log('Loaded pending translation');
                        }
                    },
                }).fail(function () {
                    console.warn('Error on load pending translation');
                });
            }
        },

        getUserLanguage: function(){
            $.ajax({
                url: '/account/me',
                success: function(data) {
                    if (data.success && data.data && data.data.length && data.data[0].ui_language) {
                        i18n.lang = data.data[0].ui_language;
                        console.log('Lang initialization succeed, default language for application is set to ' + i18n.lang.toUpperCase());
                    } else {
                        console.warn('Lang data fetch failed, default language for application is set to EN', data);
                        i18n.lang = 'en';
                    }
                },
                async: false
            }).fail(function () {
                console.error('Lang initialization failed, default language for application is set to EN');
                i18n.uploadDefinitions();
            });
        }
    });

    window.__ = i18n._;

    i18n.getUserLanguage();
    i18n.downloadDefinitions();

    if (conf.DEBUG && conf.TRANSLATE) {
        setInterval(function () {
            if (i18n.newTranslations) {
                console.log('Uploading new translations');
                i18n.newTranslations = false;
                i18n.uploadDefinitions();
            }

        }, 10000);
    }

    return i18n;
});
