.. _dev-frontend-architecture:
===========================
Frontend Architecture
===========================

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

Presentation
------------

Canopsis UI is built on top on the `Emberjs <http://www.emberjs.com>`_ framework. This framework is used in Canopsis as a skeletton that let developper plug functionnalities all around the Canopsis core. Canopsis UI also uses some other frameworks like `requirejs <http://requirejs.org>`_ or the famous css framework `bootstrap <http://getbootstrap.com>`_ In this documentation will be explained how canopsis core is designed and what are its mechanics. It also covers how to integrate new features in order they best fit existing content.

Canopsis UI once installed on a server is served by the `Gunicorn <http://gunicorn.org>`_ webserver with some static **javascript, html, css** files and some **dynamic content** computed and server throught the `Canopsis API </developer-guide/API/index.html>`_

Please note that the folder referential is based on the **webcore** folder which, in Canopsis sources, is located in the subfolder ``canopsis/sources/webcore/var/www/canopsis`` . This path once Canopsis built is by default ``/opt/canopsis/var/www/canopsis``. Some resources may however only be avaiable from other location. This is the case for *locales* translation *.po* files that are located by default in ``/opt/canopsis/locale`` or schemas that are documented in the `model </developer-guide/uiv2/model_layer.html>`_ part of the Canopsis documentation.

The Entry point
---------------

When the *index.html* file is queried by a client to the server, index.html loads a few files (mainly css ones) directly. However, it includes the **canopsis.js** file that is the entry point of the canopsis UI system. File loading is handled by requirejs and once loaded, the canopsis.js file instanciate the require.js framework recursively and this leads to the call of each canopsis requirement for the initial load.

Canopsis editors
----------------

Editors in canopsis UI application are graphical components that are called when a user need to input information into the system. They can have many forms depending on the user action context datatype. For instance, editors can be either a simple textbox to input text or a more complext date time picker component that enables the user to provide a date information to the context.

Often the data input context is a canopsis form that is configured by a Canopsis Schema, which determines what data are related to the form and how the user will be prompted to enter values for the fields (what editor will be displayed)

When an editor is created, the editor context expects that the input value generated is set as the **content** field of the component. This way, the editor context (a form in canopsis UI) knows that the user input is always and only the **content** field of the editor.

An editor is a template that most of time calls a component object (see `components <#components>`_ ) that allow more complex operation / GUI rendering to manage user inputs. It looks like the following:

.. code-block:: html

   {{component-eventselector content=attr.value title=attr.field}}


Here, the template of our editor contains the call of the eventselector component where it's content value is binded to the attr.value variable of the context. In Canopsis forms contexts, this is the location where the form will get the user input in order to generate a coherent form record. The title field is also set with `attr.field` value. This means that the title field within the component will be equal to the `attr.field` value witch is in this case the field value contained in the schema. It is for eventselector the value `event selection`.

Finally, in the canopsis UI forms, when the schema of the edited model have an attribute that has for role **"eventselector"**, in the form our editor with the call of a component will looks like the picture below.

.. image:: ../../_static/images/frontend/eventselectoreditor.png

Canopsis renderers
------------------

A render in Canopsis is a web component that aims to display a given data in a specific form.

Renderers are simple GUI components made a html template for information displaying.

In Schemas, an attribute **role** defines witch renderer will be used to display the data in the Canopsis interface.

For exemple, the state information contained in events, when displayed into a table, are rendered thanks to the call of a helper in the renderer's template. Here is the code of the state renderer:

.. code-block:: html

   {{stateview value this}}

This code will just call the stateview helper with two parameters: the state value known in the render context as **"value"** field that is for the example equal to `0` and the **this** instance that is contextually the record that represents the event.

.. image:: ../../_static/images/frontend/staterenderer.png


Canopsis UI Model
-----------------

The Canopsis UI Model system is based upon json schemas that describes datatypes for each document type managed into canopsis. Those schemas are used in both front office and back office in order to keep redundancy in the project.

Widgets
-------

Widgets are elements used in Canopsis UI to build userviews. They are made of a controller and a template and they can be configured in order to best fit users need. see more `widgets <widgets/creating-a-simple-widget.html>`_
