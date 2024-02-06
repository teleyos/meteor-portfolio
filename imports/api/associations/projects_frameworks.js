import { Mongo } from 'meteor/mongo' 

/**
 * Association between {Project} and {Framework}
 * @typedef {Object} AssociationProjectFramework
 * @property {string} project_id - The id of the project coded
 * @property {string} framework_id - The id of the framework the project is written with
 */

/**
 * Creates and returns a Mongo collection named "a\_project\_framework" with allowed operations.
 *
 * @type {Mongo.Collection<AssociationProjectFramework>} The Mongo collection of associations documents
 */
const AssociationProjectFrameworkCollection = new Mongo.Collection("a_project_framework")
AssociationProjectFrameworkCollection.allow({
    insert: () => true,
    remove: () => true,
    update: () => true,
})
export default AssociationProjectFrameworkCollection
