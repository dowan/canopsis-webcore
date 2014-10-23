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


//TODO implement auto check for mvct file existence and require them automatically

var components = [
    { name: 'actionbutton', url: 'canopsis/uibase/components/actionbutton' },
    { name: 'actionfilter', url: 'canopsis/uibase/components/actionfilter' },
    { name: 'arrayeditor', url: 'canopsis/uibase/components/arrayeditor' },
    { name: 'arrayclassifiedcrecordselector', url: 'canopsis/uibase/components/arrayclassifiedcrecordselector' },
    { name: 'checkbox', url: 'canopsis/uibase/components/checkbox' },
    { name: 'classifiedcrecordselector', url: 'canopsis/uibase/components/classifiedcrecordselector' },
    { name: 'classifieditemselector', url: 'canopsis/uibase/components/classifieditemselector' },
    { name: 'criticity', url: 'canopsis/uibase/components/criticity' },
    { name: 'dateinterval', url: 'canopsis/uibase/components/dateinterval' },
    { name: 'datetimepicker', url: 'canopsis/uibase/components/datetimepicker' },
    { name: 'dictclassifiedcrecordselector', url: 'canopsis/uibase/components/dictclassifiedcrecordselector' },
    { name: 'durationcombo', url: 'canopsis/uibase/components/durationcombo' },
    { name: 'eventkey', url: 'canopsis/uibase/components/eventkey' },
    { name: 'expandableaddbutton', url: 'canopsis/uibase/components/expandableaddbutton' },
    { name: 'expandabletext', url: 'canopsis/uibase/components/expandabletext' },
    { name: 'filterclause', url: 'canopsis/uibase/components/filterclause' },
    { name: 'filterclause', url: 'canopsis/uibase/components/filterclause' },
    { name: 'flotchart', url: 'canopsis/uibase/components/flotchart' },
    { name: 'listtree', url: 'canopsis/uibase/components/listtree' },
    { name: 'modelselect', url: 'canopsis/uibase/components/modelselect' },
    { name: 'progressbar', url: 'canopsis/uibase/components/progressbar' },
    { name: 'richtext', url: 'canopsis/uibase/components/richtext' },
    { name: 'rightsselector', url: 'canopsis/uibase/components/rightsselector' },
    { name: 'searchbar', url: 'canopsis/uibase/components/searchbar' },
    { name: 'stateeditor', url: 'canopsis/uibase/components/stateeditor' },
    { name: 'eventselector', url: 'canopsis/uibase/components/eventselector' },
    { name: 'metricselector', url: 'canopsis/uibase/components/metricselector' },
    { name: 'timeintervalselector', url: 'canopsis/uibase/components/timeintervalselector' },
    { name: 'simpledicteditor', url: 'canopsis/uibase/components/simpledicteditor' },
    { name: 'stringclassifiedcrecordselector', url: 'canopsis/uibase/components/stringclassifiedcrecordselector' },
    { name: 'table', url: 'canopsis/uibase/components/table' },
    { name: 'templateselector', url: 'canopsis/uibase/components/templateselector' },
    { name: 'tagsselector', url: 'canopsis/uibase/components/tagsselector' },
    { name: 'serieitemeditor', url: 'canopsis/uibase/components/serieitemeditor' },
    { name: 'sessioneditor', url: 'canopsis/uibase/components/sessioneditor' },
    { name: 'cfiltereditor', url: 'canopsis/uibase/components/cfiltereditor' },
    { name: 'cfilter2editor', url: 'canopsis/uibase/components/cfilter2editor' },
    { name: 'cfilter3editor', url: 'canopsis/uibase/components/cfilter3editor' },
    { name: 'mixinselector', url: 'canopsis/uibase/components/mixinselector' },
    { name: 'textwithsortoption', url: 'canopsis/uibase/components/textwithsortoption' },
    { name: 'tooltip', url: 'canopsis/uibase/components/tooltip' },
    { name: 'typedvalue', url: 'canopsis/uibase/components/typedvalue' },
    { name: 'userpreferencesmanager', url: 'canopsis/uibase/components/userpreferencesmanager' },
];

loader.loadComponents(components);
