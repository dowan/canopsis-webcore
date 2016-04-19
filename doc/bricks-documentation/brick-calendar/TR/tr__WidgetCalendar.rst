.. _TR__CalendarWidget:

========================
Canopsis Widget Calendar
========================

.. contents::
   :depth: 2

References
==========

List of referenced functional and technical requirements.

- `FR::WidgetCalendar.rst <FR__WidgetCalendar>`_
- ref: tr__vevent.rst
- ref: tr__periodic_behaviors.rst
- ref: tr__eventlog.rst

Updates
=======

.. csv-table::
   :header: "Author(s)", "Date", "Version", "Summary", "Accepted by"

   "Florent Demeulenaere", "21/10/2015", "0.4", "update technical test", ""
   "Florent Demeulenaere", "14/10/2015", "0.3", "format template, update contents", ""
   "Florent Demeulenaere", "23/09/2015", "0.2", "widget calendar TR", ""
   "Florent Demeulenaere", "18/08/2015", "0.1", "Document creation", ""


Description
===========

The calendar widget provides the ability to view several event sources on a calendar. It could be an event log, a pbehavior or a user event created on the calendar.

The user can filter events on the widget by creating and selecting filters thanks to a mixin on the top of the widget, or thanks to the calendar options menu.

Contents
========

The frontend calendar part is implemented thanks to the JQuery plugin `fullcalendar <http://fullcalendar.io//>`_

Widget main description
-----------------------

The widget is composed of a controller, a template and a view.

The controller loads the view, and the needful mixins (Userconfiguration, Recordinfopopup, ..). The controller has methods used in several event sources and methods that let the user configure the entire widget (change the calendar width).

The view creates the calendar thanks to the fullcalendar plugin. It triggers javascript events in order to use view methods directly in the related event sources mixins.

The template renders the view, mainly composed of the calendar options (in a dropdown-component) an a calendar.

A event source mixin plugable to the widget calendar
----------------------------------------------------

Several points are always implemented for a new event source's mixin:

- Some instructions could be inserted in the setEventcategories method in order to execute code related to the event source before the user interaction.
- A render method to render event after a refresh or after a view change
- A remove method to remove selected events (by a category, a behavior, etc.)
- A reDraw method to draw events on the calendar
- A load method to query event information
- A get method to format events for fullcalendar


Events log mixin
----------------

The widget can display events log. The user can select several events by filtering them thanks to the customfilterlist mixin. On click on one of them, the user is redirected to the related view.

Software architecture
>>>>>>>>>>>>>>>>>>>>>

The widget has to display counts of events log. But there are numerous. That's why there are filtered before transmit them on the widget. To do that, the widget will query the API with two filters: the view timezone of the calendar, and the filter created by the user and selected on the widget. This query let us get several events log to display on the calendar.
The filters are managed thanks to the customfilterlist mixin which already have labels, useful for the user selection on the widget.

The aim is only to get the count of events log displayed on the calendar, and then, on clic on the count, the user is redirected on a description of the event.

Technical guide
>>>>>>>>>>>>>>>

The API lets you get events log with the query made by the two filters descripted above. So it can be possible to filter events log with a period of time and with a user filter created thanks to the customfilterlist mixin.

Periodic behaviors mixin
------------------------

Software architecture
>>>>>>>>>>>>>>>>>>>>>

On click on a button, the user can show/hide pbehaviors on the calendar. Pbehaviors are filtered by behaviors which are buttons on the calendar options.

During the widget calendar load, pbehaviors are query (with the calendar view filter, ie: only this month). there are formated for the fullcalendar and set in one button by behavior. the templatable display of these events are headed by some keys in the related schema and actions described in the event source mixin.

Technical guide
>>>>>>>>>>>>>>>

The pbehavior's API related to the calendar let filters events by a chosen timerange. It could be a month, a week or a day.

User events (vevent.calendar)
-----------------------------

Software architecture
>>>>>>>>>>>>>>>>>>>>>

In this widget, users can create their own events, but they can also update and remove these events. a user event is attached to a category also created by the user.

Categories need their own schema, editors and even a component for display the list on a Ember select list. They are query at the beginning of the mixin load in order to render each related button. There is an object in the mixin that link categories and their events.

user event are stored in vevent collection, mainly because user events inherits from vevents.

Technical guide
>>>>>>>>>>>>>>>

The user events API lets you get events filtered by a time period (month/week/day).

This also lets you filter events by categories when you want to display them. Categories are an other filter applied to the query to get user events.

Technical Tests
===============

Frontend
--------

widget.controller
>>>>>>>>>>>>>>>>>

.. code-block:: javascript

    /**
     * Set the reload to true in order to redraw events
     * extend the native refreshContent method
     * @method refreshContent
     */
    refreshContent: function () {}

    /**
     * If refreshContent and DidInsertElement are done, gotoDate is called
     * @method isReadyWidget
     * @param {string} action done method: This method will be set to ready
     */
    isReadyWidget: function(action) {}

	/**
	 * Synchronize selected calendar width to the widget
	 * @method getCalendarWidth
	 */
	getCalendarWidth: function () {}

	/**
     * Set date view with the actual month if undefined
     * @method getDateCalendarView
     */
	getDateCalendarView: function () {}

	/**
     * Call all methods in parameters when promises given are done (query to the backend are finished)
     * @method onSourceLoad
     * @param {promise} promises Array of promises
     * @param {array} methods Array of methods
     * @param {string} category could be et userEvent category or a behavior (optional)
     */
    onSourceLoad: function (promises, methods, category) {}

    /**
     * inform the user about the last action made
     * @method showUserMessage
     * @param {string} message information about the action to inform
     * @param {string} level indicate the information level (for Bootstrap color element)
     */
    showUserMessage: function (message, level) {}

widget.view
>>>>>>>>>>>

.. code-block:: javascript

    /**
     * call the fullcalendar gotoDate method with the given date
     * @method goToDate
     * @param {number} date timestamp which represents the date to switch on
     */
    goToDate: function (date) {}

    /**
     * Add a new fullcalendar eventSource
     * @method addEventCalendar
     * @param {array} calendarTab eventSource as an array formated for fullCalendar
     */
    addEventCalendar: function(calendarTab) {}

    /**
     * remove a old fullcalendar eventSource
     * @method removeEventCalendar
     * @param {array} calendarTab eventSource as an array formated for fullCalendar
     */
    removeEventCalendar: function (calendarTab) {}

    /**
     * Remove only one selected event from the fullcalendar, getting it from the controller
     * @method removeUserEvent
     */
    removeUserEvent: function () {}

    /**
     * Create the fullcalendar at the beginning and catch every changed view
     * @method didInsertElement
     */
    didInsertElement: function () {}

    /**
     * Let the user to create an event by selecting a time range on the calendar
     * @method select
     * @param {date} start started date given by the selection
     * @param {date} end ended date given by the selection
     */
    select: function(start, end) {}

    /**
     * Refresh each source event after
     * @method viewRender
     * @param {CalendarView} month current view to refresh
     * @param {calendar} calendar the concerned calendar element
     */
    viewRender: function(month, calendar) {}

    /**
     * Describes actions to do when a user click is handled on an event
     * @method eventClick
     * @param {object} calEvent Event catched by the click
     * @param {object} jsEvent Javascript event catched by the click
     */
    eventClick: function (calEvent, jsEvent) {}

    /**
     * Disable all triggered actions and destroy all view's objects
     * @method willDestroyElement
     */
    willDestroyElement: function() {}

components.eventcategories.component
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

.. code-block:: javascript

	/**
	 * build url to query database
	 * @method buildURL
	 * @param {string} type unused
	 * @param {string} id unused
	 * @param {object} record unused
	 * @return {string} url
	 */
	buildURL: function(type, id, record) {}

	/**
     * Ember method to query database
     * @method findQuery
     * @param {string} type used for buildURL
     * @param {string} store store to query
     * @param {object} query mongoDB query
     * @return {array} list of events
     */
    findQuery: function(store, type, query) {}

    /**
     * Ember method to query database
     * @method findQuery
     * @param {string} type used for buildURL
     * @param {string} store store to query
     * @param {object} record record to create
     * @return {boolean} success or fail
     */
    createRecord: function(store, type, record) {}

mixins.calendarsourceeventslog
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

.. code-block:: javascript

	/**
     * Rerender events log when the calendar view is refreshed
     * @method renderEventLog
     */
    renderEventLog: function () {}

	/**
     * Give a formated filter to apply to the redirection
     * @method formatFilterForWidgetList
     * @param {number} start timestamp
     * @return {string} filter
     */
    formatFilterForWidgetList: function (start) {}

    /**
     * Redirect to the event-history view, with given eventlog and filter
     * @method goToInfo
     * @param {String} filter selected filter
     * @param {Object} element element concerned by the filter
     */
    goToInfo: function (filter, element) {}

    /**
     * This method is called every time the selected filter is changed.
     * Get the user filter created thanks to the customfilterlist mixin (method computeFilterFragmentList).
     * Then, call loadEventsLog method to query events related to this filter.
     * @method getMixinFilter
     */
    getMixinFilter: function() {}

    /**
     * Remove eventlog from calendar
     * @method removeEventLog
     */
    removeEventLog: function () {}

    /**
     * Display current eventlog on the fullcalendar
     * @method reDrawEventLog
     * @param {controller} controller
     */
    reDrawEventLog: function (controller) {}

    /**
     * Get eventlog from calendarday collection
     * @method loadEventsLog
     * @return {promise} promise
     */
    loadEventsLog: function() {}

    /**
     * Override the mixin's computeFilterFragmentsList method
     * @method computeFilterFragmentsList
     * @return {Array}
     */
    computeFilterFragmentsList: function() {}

    /**
     * Format the eventLog count for fullCalendar
     * @method getEventsLogCount
     * @param {number} count: integer that represents the count of events log relative to the given
     * @param {object} date: object that contains a 'begin' timestamp attribute and a 'end' timestamp attribute
     * @return {object}
     */
    getEventsLogCount: function (count, date) {}

    /**
     * Redirect on the description view with relative event and filter
     * @method onClickeventlog
     * @param {object} calEvent fullcalendar event
     * @param {object} jsEvent Javascript catched event
     */
    onClickeventlog: function (calEvent, jsEvent) {}

mixins.calendarsourcepbehavior
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

.. code-block:: javascript

	/**
     * Call methods after the mixins load
     * @method mixinsOptionsReady
     */
    mixinsOptionsReady: function () {}

    /**
     * Rerender periodic behaviors when the calendar view is refreshed
     * @method renderBehaviors
     */
    renderBehaviors: function () {}

    /**
     * Synchronize selected pbehavior colors to the relatives button
     * @method pBehaviorColor
     * @return {string} background style used in the template
     */
    pBehaviorColor: function () {}

    /**
     * Remove the event source relative to the given behavior
     * @method removePbehavior
     * @param {string/object} behavior could be a string or an object containing fields relative to the event source
     */
    removePbehavior: function (behavior) {}

    /**
     * Display on the fullcalendar an event source just loaded from database
     * @method reDrawPbehavior
     * @param {class} controller widget controller
     * @param {string/object} behavior could be a string or an object containing fields relative to the event source
     */
    reDrawPbehavior: function (controller, behavior) {}

    /**
     * Load behaviors in order to display button on the calendar options and set user preferences
     * @method loadBehaviors
     */
    loadBehaviors: function () {}

    /**
     * Get pbehavior relative to the given behavior from default_pbehavior collection
     * @method loadPbehavior
     * @param {string/object} behavior could be a string or an object containing fields relative to the event source
     * @return {promise}
     */
    loadPbehavior: function (behavior) {}

    /**
     * Get a list of dates relatives to a given rrule
     * if no rrule, it is a list of one date
     * @method getDatesFromRrule
     * @param {string} rrule
     * @param {number} dtstart
     * @return {array}
     */
    getDatesFromRrule: function(rrule, dtstart) {}

    /**
     * Format pbehaviors for fullcalendar
     * @method getPBehavior
     * @param {number} eventStart Number pbehavior's beginning
     * @param {number} duration Number pbehavior's duration
     * @param {string} source String component's name concern by the pbehavior
     * @param {string} behavior String of behavior(s)
     */
    getPBehavior: function(eventStart, duration, source, behavior) {}

    /**
     * Display the recordinfopopup relative to the selected event
     * @method onClickpbehavior
     * @param {object} calEvent selected fullcalendar event
     * @param {object} jsEvent Javascript catched event
     */
    onClickpbehavior: function (calEvent, jsEvent) {}

    /**
     * Show/hide pbehaviors in the calendar
     * @method showPbehavior
     * @param {object} behavior selected behavior
     */
    showBehavior: function (behavior) {}

mixins.calendarsourceuserevents
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

.. code-block:: javascript

	/**
     * Call methods after the mixins load
     * @method mixinsOptionsReady
     */
    mixinsOptionsReady: function () {}

    /**
     * Rerender user events when the calendar view is refreshed
     * @method renderUserEvents
     */
    renderUserEvents: function () {}

    /**
     * get categories from database and set them on the controller
     * @method setEventCategories
     * @param {controller} caller controller scope if needful
     */
    setEventcategories: function(caller) {}

    /**
     * Remove the event source relative to the given category
     * @method removeUserEvents
     * @param {string/object} category could be a string or an object containing fields relative to the event source
     */
    removeUserEvents: function (category) {}

    /**
     * Display on the fullcalendar an event source just loaded from database
     * @method reDrawUserEvents
     * @param {class} controller widget controller
     * @param {string/object} category could be a string or an object containing fields relative to the event source
     */
    reDrawUserEvents: function (controller, category) {}

    /**
     * Get user events from calendardata collection
     * @method loadUserEvents
     * @param {string} category category to load
     */
    loadUserEvents: function(category) {}

    /**
     * Format the calendar event for fullCalendar
     * @method getCalendarEvent
     * @param {object} cevent object that contains event to format
     * @return {object}
     */
    getCalendarEvent: function (cevent) {}

    /**
     * Create an user event from the selected time range in the calendar
     * @method createSelectedEvent
     * @param {Number} start started timestamp given by the user selection
     * @param {Number} end ended timestamp given by the user selection
     */
    createSelectedEvent: function(start, end) {}

    /**
     * Set selected event and display edition choice
     * @method onClickuserevent
     * @param {object} calEvent fullcalendar event
     * @param {object} jsEvent Javascript catched event
     * @param {view} view view scope
     */
    onClickuserevent: function (calEvent, jsEvent, view) {}

    /**
     * Create an user event from the "add event" form in the widget
     * @method createEvent
     */
    createEvent: function() {}

    /**
     * Remove the selected event
     * @method removeEvent
     */
    removeEvent: function () {}

    /**
     * Update one or several field(s) of the selected event
     * @method updateEvent
     */
    updateEvent: function () {}

    /**
     * Show/hide user events by clicking on the relatives category
     * @method showUserEvents
     */
    showUserEvents: function (category) {}

    /**
     * open a form to edit eventcategories
     * @method editCategories
     */
    editCategories: function () {}

Backend
-------

ccalendar.manager
>>>>>>>>>>>>>>>>>

.. code-block:: python

	def _get_vevent_properties(self, vevent, *args, **kwargs):
		"""Get information from a vevent.

		:param Event vevent: vevent from where get information
		:return: vevent information in a dictionary
		:rtype: dict
		"""

	def _get_document_properties(self, document):
        """Get properties from a document.

        :param dict document: document from where get properties.
        :return: document properties in a dictionary.
        :rtype: dict
        """

webcore.services.calendar
>>>>>>>>>>>>>>>>>>>>>>>>>

.. code-block:: python

	@route(ws.application.get, name='calendar')
	def get_by_uids(
	        uids, limit=0, skip=0, sort=None, projection=None, with_count=False
	    ):
	        """Get documents by uids.

	        :param list uids: list of document uids.
	        :param int limit: max number of elements to get.
	        :param int skip: first element index among searched list.
	        :param sort: contains a list of couples of field (name, ASC/DESC)
	            or field name which denots an implicitelly ASC order.
	        :type sort: list of {(str, {ASC, DESC}}), or str}
	        :param dict projection: key names to keep from elements.
	        :param bool with_count: If True (False by default), add count to the
	            result.
	        :return: documents where uids are in uids.
	        :rtype: list
	        """

	@route(
        ws.application.post, name='calendar',
        payload=['eventcategories', 'output', 'dtstart', 'dtend']
    )
    @route(
        ws.application.put, name='calendar',
        payload=['eventcategories', 'output', 'dtstart', 'dtend', 'uid']
    )
    def put(
        eventcategories,
        output,
        dtstart,
        dtend,
        uid=None,
        source=None,
        info=None
    ):
        """Add calendar events (and optionally data) related to input source.

        :param str source: calendardata source if not None.
        :param dict info: calendar event info.
        :param str eventcategories: eventcategories of the event.
        :param str output: description of the event.
        :param int dtstart: beginning date.
        :param int dtend: ending date.
        :return: new documents.
        :rtype: list
        """

    @route(ws.application.delete, payload=['ids'])
    def calendar(ids):
    	"""Delete a event with the id. We can delete several events with an array of ids

    	:param list ids: list of ids to delete
    	:return: True if the remove is ok
    	:rtype: boolean
    	"""

    @route(
        ws.application.get, name='calendar/values',
        payload=['query', 'source', 'dtstart', 'dtend']
    )
    def values(
        query=None, sources=None, dtstart=None, dtend=None
    ):
        """Get source vevent document values.

        :param list sources: sources from where get values. If None, use all
            sources.
        :param int dtstart: vevent dtstart (default 0).
        :param int dtend: vevent dtend (default sys.maxsize).
        :param dict query: vevent information if given.
        :param int limit: max number of elements to get.
        :param int skip: first element index among searched list.
        :param sort: contains a list of couples of field (name, ASC/DESC)
            or field name which denots an implicitelly ASC order.
        :type sort: list of {(str, {ASC, DESC}}), or str}
        :param dict projection: key names to keep from elements.
        :param bool with_count: If True (False by default), add count to the
            result.
        :return: matchable documents.
        :rtype: list
        """

webcore.services.pbehavior
>>>>>>>>>>>>>>>>>>>>>>>>>>

.. code-block:: python

	@route(
        ws.application.get,
        payload=['behaviors', 'start', 'end'],
        name='pbehavior/calendar'
    )
    def find_pbehavior(behaviors=None, start=None, end=None):
        """Get pbehavior which are between a starting and a ending date. They are filtered by behavior

        :param string behaviors: behavior to filter the query (optionnal)
        :param timestamp start: begin of the filtered period
        :param timestamp end: end of the filtered period
        :return: matchable events
        :rtype: list
        """

webcore.services.event
>>>>>>>>>>>>>>>>>>>>>>

.. code-block:: python

    @route(ws.application.get,
           name='eventslog/count',
           payload=['tstart', 'tstop', 'limit', 'select']
           )
    def get_event_count_per_day(tstart, tstop, limit=100, select={}):
        """ get eventslog log count for each days in a given period
            :param tstart: timestamp of the begin period
            :param tstop: timestamp of the end period
            :param limit: limit the count number per day
            :param select: filter for eventslog collection
            :return: list in which each item contains an interval and the
            related count
            :rtype: list
        """

event.eventslogmanager
>>>>>>>>>>>>>>>>>>>>>>

.. code-block:: python

	def get_eventlog_count_by_period(
        self, tstart, tstop, limit=100, query={}
    ):
        """Get an eventlog count for each interval found in the given period and
           with a given filter.
           This period is given by tstart and tstop.
           Counts can be limited thanks to the 'limit' parameter.

           :param start: begin interval timestamp
           :param stop: end interval timestamp
           :param limit: number that limits the max count returned
           :param query: filter for events_log collection
           :return: list in which each item contains an interval and the
           related count
           :rtype: list
        """