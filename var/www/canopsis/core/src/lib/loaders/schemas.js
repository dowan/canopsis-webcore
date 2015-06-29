/**
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 *
 * @module canopsis-frontend-core
 */


Ember.Application.initializer({
    name: 'Schemas',
    after: ['SchemaAdapter', 'SchemasRegistry', 'DataUtils', 'SchemaAdapter'],
    initialize: function(container, application) {
        var schemasRegistry;
        function compare(a,b) {
          if (a.id < b.id) {
             return -1;
          }
          if (a.id > b.id) {
            return 1;
          }
          return 0;
        }

        /**
         * provides an abstraction to register schemas where they need to be
         */
        function registerSchema(modelDict, emberModel, schema, name) {
            var registryEntry = {
                modelDict: modelDict,
                EmberModel : emberModel,
                schema: schema
            };

            application.register('model:' + name, emberModel);
            schemasRegistry.add(registryEntry, name);
        }

        console.tags.add('loader');
        var schemasLoader = Ember.Object.create({
            generatedModels: Ember.A(),

            loadSchemas: function() {
              var records = this.getSchemas();

              records = records.sort(compare);

              for (var i = 0, l = records.length; i < l; i++) {
                var schema = records[i].schema;
                var schemaId = records[i].id;
                this.loadSchema(schemaId, schema);
              }

              for (var k = 0, lk = this.generatedModels.length; k < lk; k++) {
                var currentModel = this.generatedModels[k];

                currentModel.model.reopen(currentModel.modelDict);
                registerSchema(currentModel.modelDict, currentModel.model, currentModel.schema, currentModel.name);
              }

              console.log('generatedModels', this.generatedModels);
              window.$S = this.generatedModels;
              this.loaded = true;

              return true;
            },

            loadSchema: function(schemaId, schema) {
                var schemaName = this.getSchemaName(schemaId, schema);
                // console.log('schemaName', schemaName);

                var parentModel = this.getParentModelForModelId(schemaId);
                var modelDict = this.generateSchemaModelDict(schema, parentModel, schemaId);

                console.log(schemaId, modelDict);

                var generatedModelsObject = {
                    name: schemaName,
                    id: schemaId,
                    schema: schema,
                    model: parentModel.model.extend({}),
                    modelDict: modelDict
                };

                this.generatedModels.pushObject(generatedModelsObject);
                return generatedModelsObject;
            },

            generateSchemaModelDict: function(schema, parentModel, modelId) {
                var modelDict;
                    modelDict = Ember.copy(parentModel.modelDict);

                    console.log(modelId, 'parent dict', parentModel);

                modelDict.categories = schema.categories;
                modelDict.metadata = schema.metadata;
                modelDict.userPreferencesModel = {};
                modelDict.userPreferencesModelName = modelId;

                // console.log(modelId, 'dict:', modelDict, this.generatedModels.findBy('name', 'widget').modelDict);
                if(schema.properties) {
                    var propertiesKeys = Ember.keys(schema.properties);
                    for (var i = 0; i < propertiesKeys.length; i++) {
                        var currentKey = propertiesKeys[i];
                        // avoid to add id in model because ember has already added once
                        if (currentKey === 'id') {
                            continue;
                        }

                        var currentProperty = schema.properties[currentKey];

                        if(currentProperty['default']) {
                            currentProperty.defaultValue = function(model, attribute) {
                                return attribute['default'];
                            };
                        }

                        if (currentProperty.relationship === 'hasMany' && currentProperty.model !== undefined) {
                            currentProperty.model = currentProperty.model.split('.');
                            currentProperty.model = currentProperty.model[currentProperty.model.length - 1];

                            modelDict[currentKey] = DS.hasMany(currentProperty.model, currentProperty);
                        } else if (currentProperty.relationship === 'belongsTo' && currentProperty.model !== undefined) {
                            currentProperty.model = currentProperty.model.split('.');
                            currentProperty.model = currentProperty.model[currentProperty.model.length - 1];

                            modelDict[currentKey] = DS.belongsTo(currentProperty.model, currentProperty);
                        } else {
                            if(currentProperty.isUserPreference === true) {
                                modelDict.userPreferencesModel[currentKey] = DS.attr(currentProperty.type, currentProperty);
                            } else {
                                modelDict[currentKey] = DS.attr(currentProperty.type, currentProperty);
                            }
                        }
                    }

                    userPreferencesKeys = Ember.keys(modelDict.userPreferencesModel);
                    modelDict.userPreferencesModel.attributes = Ember.OrderedSet.create();
                    for (var i = 0; i < userPreferencesKeys.length; i++) {
                        var keyMeta = modelDict.userPreferencesModel[userPreferencesKeys[i]].meta();
                        keyMeta.name = userPreferencesKeys[i];

                        modelDict.userPreferencesModel.attributes.add(keyMeta);
                    }

                }

                return modelDict;
            },

            getParentModelForModelId: function(schemaId) {
              var schemaInheritance = schemaId.split('.');

              console.log('schemaInheritance', schemaInheritance, schemaInheritance.length);
              if(schemaInheritance.length > 1) {
                var parentClassName = schemaInheritance[schemaInheritance.length - 2];
                console.log('parentClassName', parentClassName);
                return this.generatedModels.findBy('name', parentClassName);
              } else {
                return {
                    model: DS.Model,
                    modelDict: {}
                };
              }
            },

            getSchemaName: function(schemaId) {
              var schemaName = schemaId.split('.');
              schemaName = schemaName[schemaName.length - 1];
              return schemaName;
            },

            getSchemas: function() {
                var schemasLoader = this;
                var shemasLimit = 200;

                var adapter = container.lookup('adapter:schema');

                var successFunction = function(payload) {
                    if (payload.success) {
                        if(payload.total === 0) {
                            console.warn('No schemas was imported from the backend, you might have nothing in your database, or a communication problem with the server');
                        } else if(payload.total === shemasLimit) {
                            console.warn('You loaded', shemasLimit, 'schemas. You might have some more on your database that were ignored.');
                        }

                        console.log('Api schema data', payload);
                        schemasLoader.__schemas__ = payload.data;
                    } else {
                        console.error('Unable to load schemas from API');
                    }
                }

                adapter.findAll(successFunction);

                return this.__schemas__;
            }
        });

        schemasRegistry = container.lookupFactory('registry:schemas');
        schemasLoader.loadSchemas();
        application.register('loader:schemas', schemasLoader);
    }
});
