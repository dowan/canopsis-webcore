.. _ED__CalendarWidget:

========================
Canopsis Widget Calendar
========================

This document describes how to use the widget calendar in Canopsis

.. contents::
   :depth: 2

References
==========

List of referenced functional requirements...

- `fr__WidgetCalendar.rst <../FR/fr__WidgetCalendar.rst>`_
- `tr__WidgetCalendar.rst <../TR/tr__WidgetCalendar.rst>`_

Updates
=======

.. csv-table::
   :header: "Author(s)", "Date", "Version", "Summary", "Accepted by"

   "Florent Demeulenaere", "2015/10/23", "0.3", "pbehaviors how to", ""
   "Florent Demeulenaere", "2015/10/22", "0.2", "events log how to", ""
   "Florent Demeulenaere", "2015/10/21", "0.1", "Document creation", ""

Contents
========

.. _ED__Title__Desc:

Installation
------------

Brick installation
~~~~~~~~~~~~~~~~~~

To install the calendar brick in Canopsis, please follow the README instruction `here <https://git.canopsis.net/canopsis-ui-bricks/brick-calendar#installation>`_

To check in the user interface if the brick is fully installed, try to insert a widget in the edition mode (CTRL+E). You should see the widget calendar in the list like this:

.. figure:: ../_static/images/ED/widget_creation.png

Install default view
~~~~~~~~~~~~~~~~~~~~

In order to have a default view for this widget, you have to do these steps:

- In Canopsis environnement open the Mongo database with:

.. code-block:: javascript

	mongo canopsis -u cpsmongo -p canopsis

- execute the commande:

.. code-block:: javascript

	db.object.insert({ "_id" : "view.calendar", "loader_id" : "view.calendar", "enable" : true, "containerwidget" : { "items" : [ { "widget" : { "widgetId" : "widget_calendar_ff094c1d-e8a0-c9b0-099f-d3cf9f971727", "xtype" : "calendar", "title" : "calendar", "bgcolor_eventlog" : "#FFCE74", "mixins" : [ { "default_filter" : "{\"$or\":[{\"$and\":[{\"ack.isAck\":{\"$ne\":true}},{\"state\":{\"$ne\":0}},{\"event_type\":{\"$eq\":\"check\"}}]}]}", "name" : "customfilterlist", "filters" : [ { "filter" : "{\"$or\":[{\"$and\":[{\"event_type\":{\"$eq\":\"check\"}}]}]}", "cfilter" : "", "title" : "Check" }, { "filter" : "{\"$or\":[{}]}", "cfilter" : "", "title" : "All" } ] }, { "name" : "calendarsourcepbehavior" }, { "name" : "calendarsourceeventslog", "EmberClass" : { "mixins" : [ { "properties" : { "actions" : {  } } } ] } }, { "name" : "calendarsourceuserevents", "EmberClass" : { "mixins" : [ { "properties" : { "checkStyleToggle" : { "_dependentKeys" : [ "check" ], "_readOnly" : false, "_cacheable" : true }, "actions" : {  }, "categoryCheckStyleToggle" : { "_dependentKeys" : [ "objectCategories" ], "_readOnly" : false, "_cacheable" : true } } } ] } } ], "calendar_width" : 90, "textcolor_pbehavior" : "#000000", "bgcolor_pbehavior" : "#FA6E69", "id" : "widget_calendar_ff094c1d-e8a0-c9b0-099f-d3cf9f971727", "textcolor_eventlog" : "#000000" }, "xtype" : "widgetwrapper", "title" : "wrapper" } ], "mixins" : [ { "name" : "verticallayout" } ], "xtype" : "widgetcontainer", "title" : "container title vbox services2" }, "crecord_write_time" : 1442907127, "crecord_type" : "view", "id" : "view.calendar", "crecord_name" : "Calendar", "loader_no_update" : false })

- The default view is loaded, refresh now the browser to refresh all available default views

See default view
~~~~~~~~~~~~~~~~

Once the brick is installed you can use the widget calendar. There is two ways to deal with it.
You can just use the brick with the given default view.
To get the default view, click on the "Manage views" field at the bottom of this list:

.. figure:: ../_static/images/ED/settings.png

Then, search the calendar view by typing calendar in the research field

.. figure:: ../_static/images/ED/default_view_list.png

When the calendar view is found, you can access it by clicking on the "eye button"

.. figure:: ../_static/images/ED/default_calendar_found.png

finally, you got the calendar default view:

.. figure:: ../_static/images/ED/final_default_view.png

The naked version
~~~~~~~~~~~~~~~~~

You can also use the calendar without any parameters, just by intanciate it from the edit mode.

Enter the edit mode (CTRL+E) to insert a widget and choose the calendar widget. You should have this:

.. figure:: ../_static/images/ED/calendar_conf.png

In the general tab, you could indicate a title for this widget (optionnal).

.. figure:: ../_static/images/ED/colors.png

In this second tab, you can personalize event colors (for text and background) (optionnal).

.. figure:: ../_static/images/ED/size.png

In this tab, you have the possibility to resize the calendar width (optionnal).

.. figure:: ../_static/images/ED/mixins.png

In the last tab, you **have to** add mixins to the widget. For now, available mixins are:

- customfilterlist
- calendarsourcepbehavior
- calendarsourceeventslog
- calendarsourceuserevents


How to use events log
---------------------

To display events log on the calendar, you have to make filters with the customfilterlist mixin. If you are using the default view, you already have two filters (Check, All). But you can create other filters to match differents events log.

It is important to know that only the events log count is displayed on the calendar. To see more about an event, just click on it and you will be redirected to the related view, you should see sommething like this:

.. figure:: ../_static/images/ED/history_view.png

How to use periodic behaviors
-----------------------------

Periodic behaviors are queried from database and automatically filtered by behaviors. One behavior is one button on the calendar options. This query is always done so if you have periodic behaviors, the related buttons are automatically displayed in the calendar options.

Before displaying these events, it is better to template behaviors title and behavior information when the click is catched. To do that, switch to the edition mode (CTRL+E) and click on the calendarsourcepbehavior mixin to configure it:

.. figure:: ../_static/images/ED/pbehavior_conf.png

You should have a window with two different text areas:

.. figure:: ../_static/images/ED/pbehavior_template.png

The first one describes which text is displayed on the event and the second one describes which text is displayed when a user click on one of these events.

Both fields works with the same keywords:

- {{component}} : Entity related to the event
- {{start}}     : Start of the selected event
- {{end}}       : End of the selected event
- {{behavior}}  : linked behavior

When the configuration is ok, you can select periodic behaviors by clicking on the behaviors buttons on the calendar options. If your configuration is good, you should have something like this:

.. figure:: ../_static/images/ED/pbehavior_display_title.png

and

.. figure:: ../_static/images/ED/pbehavior_display_info.png

How to use user events
----------------------

User events are completely editable by the users. It means that you can create, modify or delete these events.

Create events
~~~~~~~~~~~~~

You can create events in two differents ways. By clicking on the "add event" button in the calendar option or by directly selecting a timerange in the calendar.
both ways bring you this form:

.. figure:: ../_static/images/ED/create_event.png

Here you have to choose a category (to filter events to display), fill a description, and the begin and end date of the event. All fields have to be filled.
After that, you can display events by selecting categories to display in the calendar options.

Delete events
~~~~~~~~~~~~~

Remove event is very simple. You just need to click on it, you should see this window appears:

.. figure:: ../_static/images/ED/update_remove.png

By clicking on the "Remove" button, the selected event is directly removed.

Update events
~~~~~~~~~~~~~

To update events, you also need to click on a event to see the previous window. This time, you need to click on the "Update" button.

You should see a form similar to the creation form:

.. figure:: ../_static/images/ED/update_form.png

Here you can modify fields you want to edit and then saved modifications.