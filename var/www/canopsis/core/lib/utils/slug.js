/**
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 *
 * @module canopsis-frontend-core
 */

define(['app/lib/utilityclass'], function(Utility) {

    //TODO delete this, seems to be unused
    var slugify = Utility.create({

        name: 'slug',

        slug: function(value) {
            var rExps = [
                { re: /[\xC0-\xC6]/g, ch: 'A' },
                { re: /[\xE0-\xE6]/g, ch: 'a' },
                { re: /[\xC8-\xCB]/g, ch: 'E' },
                { re: /[\xE8-\xEB]/g, ch: 'e' },
                { re: /[\xCC-\xCF]/g, ch: 'I' },
                { re: /[\xEC-\xEF]/g, ch: 'i' },
                { re: /[\xD2-\xD6]/g, ch: 'O' },
                { re: /[\xF2-\xF6]/g, ch: 'o' },
                { re: /[\xD9-\xDC]/g, ch: 'U' },
                { re: /[\xF9-\xFC]/g, ch: 'u' },
                { re: /[\xC7-\xE7]/g, ch: 'c' },
                { re: /[\xD1]/g, ch: 'N' },
                { re: /[\xF1]/g, ch:'n'}
            ];

            for(var i = 0, l = rExps.length; i < l; i++) {
                value = value.replace(rExps[i].re, rExps[i].ch);
            }

            value = value.toLowerCase();
            value = value.replace(/\s+/g, '-');
            value = value.replace(/[^a-z0-9-]/g, '');
            value = value.replace(/\-{2,}/g,'-');

            return value;
        }
    });

    return slugify;
});
