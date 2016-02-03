.. _FR__Alarm:

================
webmodulemanager
================

This document describes the webmodulemanager tool, that aims to handle frontend bricks installation, activation, listing, and removal.

.. contents::
   :depth: 3

References
==========

Updates
=======

.. csv-table::
   :header: "Author(s)", "Date", "Version", "Summary", "Accepted by"

   "Gwenael Pluchon", "2016/02/03", "0.1", "Document creation", ""

Contents
========

Description
-----------

The webmodulemanager tool must provide the following subcommands :

- ```enable``` : To activate a frontend brick. An activated brick is loaded by the frontend, at load time.
- ```disable```: To desactivate a brick
- ```list``` : To list enabled bricks. An option should be provided to list all bricks installed, whether they are enabled or not
- ```init``` : Reinitialize the default bricks configuration
- ```install``` : to install a distant brick

The tool must be completely independant of the backend, and store the list of enabled bricks into a json file, accessible via the frontend.

It should also be available as a command into the canopsis shell environment.

Functional test
---------------
