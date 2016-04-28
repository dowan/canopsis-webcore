.. _ED__editors:

===========================
Editors
===========================

This document describes how editors are implemented and usable throughout the frontend.

.. contents::
   :depth: 3


References
==========

Updates
=======

.. csv-table::
   :header: "Author(s)", "Date", "Version", "Summary", "Accepted by"

   "Gwenael Pluchon", "2016/04/26", "0.1", "Document creation", ""

Contents
========

.. _FR__Title__Desc:

Description
-----------

An editor is a simple template, eventually made of Ember components.
It is used to define how data, in a JSON schema, will be edited.

For example :

.. code-block:: javascript

   {
       "type": "object",
       "categories": [{
           "title": "General",
           "keys": ["bgcolor"]
       }],
       "properties": {
           "bgcolor": {
               "type": "string",
               "role": "color"
           }
       }
   }

Here, the key ``role`` tells the ``modelform`` to use the ``color.html`` template (our editor), in order to render the field.

Now, we will create our template ``editors/color.html`` within the UI plugin folder (core, uibase, monitoring, ...), containing something like :

.. code-block:: html

   {{input type="color" value=attr.value}}

Or, if you have an awesome *color selection* component :

.. code-block:: html

   {{component-colorselect content=attr.value}}

