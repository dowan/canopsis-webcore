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
    var get = Ember.get,
        set = Ember.set;

    /**
     * [trimHtml description]
     * @param  {String} html
     * @param  {Object} options
     * @return {Object}
     */
    function trimHtml(html, options){

        options = options || {};

        var limit = options.limit || 100,
            preserveTags = (typeof options.preserveTags !== 'undefined') ? options.preserveTags : true,
            sufix = options.sufix || '';

        var arr = html.replace(/</g, "\n<")
                      .replace(/>/g, ">\n")
                      .replace(/\n\n/g, "\n")
                      .replace(/^\n/g, "")
                      .replace(/\n$/g, "")
                      .split("\n");
        
        var sum = 0,
            row, cut, add,
            tagMatch,
            tagName,
            tagStack = [],
            more = false;
                                                             
        for(var i = 0; i < arr.length; i++){
        
            row = arr[i].replace(/[ ]+/g, ' ');
        
            if(!row.length){
              continue;
            }

            if(row[0] !== "<"){
            
                if(sum >= limit){
                    row = "";   
                }else if((sum + row.length) >= limit) {

                    cut = limit - sum;

                    if(row[cut - 1] === ' '){
                      cut -= 1;
                    }else{

                      add = row.substring(cut).split('').indexOf(' ');

                      if(add !== -1){
                        cut += add;
                      }else{
                        cut = row.length;
                      }
                    }

                    row = row.substring(0, cut) + sufix;
                    sum = limit;
                    more = true;
                }else{
                    sum += row.length;
                }
            }else if(!preserveTags){
                row = '';
            }else if(sum >= limit){

              tagMatch = row.match(/[a-zA-Z]+/);
              tagName = tagMatch ? tagMatch[0]: '';

              if(tagName){
                if(row.substring(0, 2) !== '</'){

                  tagStack.push(tagName);
                  row = '';
                }else{

                  while(tagStack[tagStack.length - 1] !== tagName && tagStack.length){
                    tagStack.pop();
                  }

                  if(tagStack.length){
                    row = '';
                  }

                  tagStack.pop();
                }
              }else{
                row = '';
              }
            }

            arr[i] = row;
        }
        
        return {
          html: arr.join("\n").replace(/\n/g, ""),
          more: more
        };
    }


    var component = Ember.Component.extend({
        tagName: 'span',

        maxLength : 5,

        formattedContent: function() {

            var maxLength = get(this, 'maxLength');
            var text = get(this, 'content');
            if(text === null || text === undefined) {
                return "";
            }
            console.log('format content', text);

            var trimmed = trimHtml(text, {limit : 50000});

            console.log('trimmed:', trimmed);

            if (trimmed.more === true) {
                set(this, 'contentIsTruncated', true);
            } else {
                set(this, 'contentIsTruncated', false);
            }

            return trimmed.html;
        }.property('content')
    });

    Application.ComponentExpandabletextComponent = component;

    return component;
});
