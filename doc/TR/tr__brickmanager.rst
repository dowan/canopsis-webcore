.. _FR__brickmanager:

=============
Brick manager
=============

This document describes the brick manager tool.

.. contents::
   :depth: 2

References
==========

Updates
=======

.. csv-table::
   :header: "Author(s)", "Date", "Version", "Summary", "Accepted by"

   "Gwenael Pluchon", "2016/02/26", "0.1", "Document creation", ""

Contents
========

Description
-----------

- The webmodulemanager tool must save its configuration in files, to make the webcore loadable via a static web server if needed (installed bricks in bower.json, enabled bricks in a dedicated json file)
- It must use Bower to install bricks, and store the installed bricks in the bower manifest.
