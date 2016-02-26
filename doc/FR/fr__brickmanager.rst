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

The brickmanager tool provides an API to manage bricks :

It should provides the following commands :

- init : Brings back the original brick configuration
- install : Installs a brick
- uninstall : Uninstalls a brick
- enable : Enables a brick (to make the frontend actually load it)
- disable : Disables a brick (to make the frontend stop loading it)
- list : List enabled bricks