.. _ED__brick_system:

===========================
Brick System
===========================

This document describes how the brick system goals and internals.

.. contents::
   :depth: 3


References
==========

Updates
=======

.. csv-table::
   :header: "Author(s)", "Date", "Version", "Summary", "Accepted by"

   "Gwenael Pluchon", "2016/09/16", "0.1", "Document creation", ""
.. 
Contents
========

.. _FR__Title__Desc:

Description
-----------

The brick system aims to split concerns into dedicated modules, which are supposed to be :
- autonomous
- easily deployable on any webcore installation
- activable and desactivable easily

Bricks can be handled using the [Canopsis-ui-toolbelt tool](https://git.canopsis.net/canopsis/canopsis-ui-toolbelt), that makes easier bricks maintainance.

To activate or desactivate a bricks use the brickmanager tool

The Brickmanager tool
---------------------

This tool is designed to provide a simple way to install, activate, disable, and remove frontend bricks. To use it, go into the root folder of the frontend, and access the brickmanager via the command ```./bin/brickmanager```

Brick installation
^^^^^^^^^^^^^^^^^^

To install a brick, use the following subcommand :

```./bin/brickmanager install <brickname>```

To install a brick which is stored in a local archive, you can use the -f option

```./bin/brickmanager install -f <brickname.tar.gz>```

Brick activation
^^^^^^^^^^^^^^^^

To activate a brick, use the following subcommand :

```./bin/brickmanager enable <brickname>```

The brick will then be loaded in the frontend, and the brick documentation will be added into the frontend documentation.

Brick disactivation
^^^^^^^^^^^^^^^^^^^

To disable a brick, use the following subcommand :

```./bin/brickmanager disable <brickname>```

Brick removal
^^^^^^^^^^^^^

To remove a brick, use the following subcommand :

```./bin/brickmanager uninstall <brickname>```

Reset to default bricks configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To restore the frontend initial state, use the following subcommand :

```./bin/brickmanager init```


List currently enabled bricks
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To list all the bricks currently enabled, use the following subcommand :

```./bin/brickmanager list```

