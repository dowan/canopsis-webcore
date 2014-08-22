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
	'canopsis/canopsisConfiguration',
	'app/application'
], function(conf) {

	var i18n = {
		lang: 'fr',
		todo: {},
		translations: {},
		newTranslations: true,
		_: function(word) {
			if (i18n.translations[i18n.lang] && i18n.translations[i18n.lang][word]) {
				return i18n.translations[i18n.lang][word];
			} else {
				alert('add')
				//adding translation to todo list
				if (typeof(word) === 'string' && !i18n.todo[word]) {
					alert('yep' + word)

					i18n.todo[word] = 1;
					i18n.newTranslations = true;
				}
				//returns original not translated string
				return word;
			}
		},

		uploadDefinitions: function () {

			$.ajax({
				url: '/rest/misc/i18n',
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
				url: '/files/i18n/' + i18n.lang,
				success: function(data) {
					if (data.success) {
						i18n.translations[i18n.lang] = data.data;
					}
				},
				async: false
			}).fail(function () {
				console.log('initialization case. translation is now ready');
				i18n.uploadDefinitions();
			});

			if (conf.DEBUG && conf.TRANSLATE) {
				$.ajax({
					url: '/rest/misc/i18n',
					success: function(data) {
						if (data.success) {
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

	};

	window.__ = i18n._;

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