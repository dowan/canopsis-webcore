.. _FR__UI_FastACK:

==============
Canopsis Event
==============

This document describes the Fast Ack UI Button

.. contents::
   :depth: 2

----------
References
----------


-------
Updates
-------

.. csv-table::
   :header: "Author(s)", "Date", "Version", "Summary", "Accepted by"

   "Vincent CANDEAU", "2016/04/04", "0.1", "Document creation", ""

--------
Contents
--------

Description
-----------

Fast ack will have the exact same features of Normal ACK :ref:`ACK <FR__Ack>`.

The purpose of this feature is designed to put an acknowlegdement on event without having to fill any form.* to ack an event without filling the popup information. 

The new button isdisplay on the left of the Slow ACK Button

The Fast ACK feature can be acces throught a button near the normal ACK button. 

Like Normal ACK, Fast ACK feature have a right on it. 
Normal ACK et Fast ACK right is both needed if you want to display the Fast ACK Button

An event in Canopsis is the representation of asynchronously incoming data, sent by
a :ref:`connector <FR__Connector>`.

Event Acknowledgment
~~~~~~~~~~~~~~~~~~~~

An ``ack`` event **MUST** contain:

 - an author 
 - a message "auto ACK""
 - a reference to the :ref:`check event <FR__Event__Check>` to acknowledge

.. _FR__Event__Ackremove: