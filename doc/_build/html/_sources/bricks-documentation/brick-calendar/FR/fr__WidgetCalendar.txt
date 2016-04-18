.. _FR__CalendarWidget:

========================
Canopsis Widget Calendar
========================

This document describes the widget calendar feature, from backend to frontend.

.. contents::
   :depth: 3


References
==========

List of referenced functional requirements...

- :ref: `vevent <fr__vevent.rst>`
- :ref: `periodic behaviors <fr__periodic_behaviors.rst>`
- :ref: `events <fr__events_log.rst>`
- :ref: `manager <fr__mananger.rst>`
- :ref: `webservice <fr__webservice.rst>`

Updates
=======

.. csv-table::
   :header: "Author(s)", "Date", "Version", "Summary", "Accepted by"

   "Florent Demeulenaere", "21/10/2015", "0.5", "grammar corrections", ""
   "Florent Demeulenaere", "21/10/2015", "0.4", "update functionnal test", ""
   "Florent Demeulenaere", "2015/10/13", "0.3", "Functional tests", ""
   "Florent Demeulenaere", "2015/10/13", "0.2", "Update contents", ""
   "Florent Demeulenaere", "2015/10/12", "0.1", "Document creation", ""

Contents
========

.. _FR__Title__Desc:

Description
-----------

The widget calendar provides the ability to view several event sources on a calendar. It could be an event log, a pbehavior or a user event created on the calendar.

The user can filter every events on the widget.

The user can select an arbitrary period to display informations. It can be by monthly, by weekly or daily.

If the user edit the widget, he can:

- Create filters for events log
- Resize the calendar
- Choose different event colors and a title.

Once the widget is correctly installed, you *should* have a view like this:

.. figure:: ../_static/images/FR/calendar_overview.png
    :width: 600px
    :align: center
    :height: 400px
    :alt: final view of the widget

Multiple views
--------------

This widget has to display events according to several views.
These views are:
- month
- week
- day

Multiple sources
----------------

The calendar let the user display multiple event sources. Each event source can be filtered. For the event log source, Only the event count per day is displayed. available source are:
- events log
- user events
- periodic behaviors

Backend
-------

The backend is different for each event source.

The user events
^^^^^^^^^^^^^^^

This source needs its own manager who lets the user create, update, delete and read events.
It also need a webservice which will provide a single route with distinct verbs for each method of the manager.
user events inherits vevents that is why the user event manager and webservice inherits vevent manager and webservice. User events are stored in vevent storage.

The periodic behaviors
^^^^^^^^^^^^^^^^^^^^^^

Periodic behaviors have always an implementation so the periodic behavior source uses the existing webservice and manager to get the pbehaviors on the calendar.
However, the calendar widget require to implement a new periodic behavior route in order to get only events related to the selected view (month/week/day).

The events log
^^^^^^^^^^^^^^

Events log are often numerous. The query to database to get all events log could be too long in case of production use. That is why only the event log count per day is return from the backend.
Events log have always an implementation so events log source just require a new event route to get the events log count per day.

Frontend
--------

The widget
^^^^^^^^^^

Of course, this feature requires a frontend widget. The widget is composed of a controller, a template and a view. it has to display a calendar with all options related to requirements.

The different sources
^^^^^^^^^^^^^^^^^^^^^

To implement this widget in a dynamic way, each source is implemented in a mixin. Each mixin has to be independant.

The user events
^^^^^^^^^^^^^^^

User events are a completly new event source in Canopsis, that is why it requires more elements to be usable. As the periodic behaviors, user events can be filtered so a component, an adapter and an editor have to be created for categories creation.
An adapter for user event is also required in order to query the backend for this event source.

On click on the user events, the user can update or delete the event.

The periodic behaviors
^^^^^^^^^^^^^^^^^^^^^^

In addition to the mixins, periodic behaviors need a new route in the existing adapter.

The user can template the display of periodic behaviors on the calendar by editing the calendarsourcepbehavior configuration mixin.

On click on the periodic behaviors, The user can see more information about the event. These information are customizable in the mixin configuration.

The events log
^^^^^^^^^^^^^^

In addition to the mixins, events log need a new route in the existing adapter.

On click on the events log count, the user is redirected on a view which contains all related events log.

Improvements
------------

- Afterwards, the widget calendar will let the user to add external event sources by giving ICS link.
- The user will be able to create recursive events on the calendar by giving an rrule.

Functional tests
----------------

Test environnement
^^^^^^^^^^^^^^^^^^

The widget calendar **has to** be used with these mixins:

- customfilterlist
- calendarsourceuserevents
- calendarsourceeventslog
- calendarsourcepbehavior

User events Tests
^^^^^^^^^^^^^^^^^

Event category creation
~~~~~~~~~~~~~~~~~~~~~~~

On click on the *calendar options* button you should see *Categories* button which gives that form:

.. figure:: ../_static/images/FR/category_creation.png

If you add an additional category to the list, you *should* see the related category button in the calendar options after saving the form.
If you remove a category, you *should* see the related button disappear in the calendar options after saving.

User events CRUD
~~~~~~~~~~~~~~~~

*This section is only available when there is a minimum of one category created.*

You can create an event by clicking on the *Add event* button on the calendar options. You should see the following form:

.. figure:: ../_static/images/FR/userevent_creation.png

You can also create an event by selecting a time range directly on the calendar. In this case, dtstart and dtend *should* be already filled.

Then you need to fill the blank fields and after saving, if you click on the related category on the calendar options (to display the right category), you should see the event displayed on the calendar.

On click on a user event, on the calendar, you can see this window:

.. figure:: ../_static/images/FR/crud_event.png

On click on the *remove* button, the relative event *should* directly be removed from the calendar.

On click on the *update* button you *should* see this forms:

.. figure:: ../_static/images/FR/update_event.png

When you finish modifying one or several fields, save this form and you *should* directly see the modification on the calendar.

Periodic behaviors tests
^^^^^^^^^^^^^^^^^^^^^^^^

*This section is only available if some periodic behaviors are* **correctly** *created thanks to the widget list..*

First of all, if the periodic behaviors are correctly brought on the calendar, you *should* see several filters related to the different behaviors in the calendar options.

On click on one of them, you *should* see related periodic behaviors appear on the calendar.

You can template information displayed in the mixin calendarsourcepbehavior configuration.
If you switch to the edit mode (press ctrl+E) you can access to this configuration and see this form:

.. figure:: ../_static/images/FR/pbehavior_conf.png

Both fields works with the same keywords:

- {{component}} : Entity related to the event
- {{start}}     : Start of the selected event
- {{end}}       : End of the selected event
- {{behavior}}  : Linked behavior

Here you can test the template and save.
Then, on click on a periodic behavior on the calendar, you *should* have something like this:

.. figure:: ../_static/images/FR/recordinfopopup.png

Events log tests
^^^^^^^^^^^^^^^^

*This section is only available if some events log are created before. in order to do that, please refer to* `this repository <https://git.canopsis.net/eregnier/scenario>`_ *and run the event_log scenario following the repository instructions.*

Events log are displayed thanks to the customfilterlist mixin. So if you do not have any filter, you first need to create one in order to display events log on the calendar by clicking on the filter.

On click on one event log on the calendar, the widget *should* redirect the user to a view that let see related events log detail, so you have to get a view like this:

.. figure:: ../_static/images/FR/event_log_view.png

Userpreferences Tests
^^^^^^^^^^^^^^^^^^^^^

In order to have the most comfortable use of this widget, several user preferences are configured.

Testing userprefences is quite simple. you have to create categories, select filters to display (whatever the chosen event source) or create a filter on the customfilterlist mixin and then check if the widget modifications are always in the widget after refreshing Canopsis.

Global Test
^^^^^^^^^^^

There is an existing global test you can do to consolidate the widget use.

For that, you can create several widgets on the same Canopsis view and check all the previous tests.