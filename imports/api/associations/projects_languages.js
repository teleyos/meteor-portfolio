import { Mongo } from 'meteor/mongo' 

/**
 * Association between {Project} and {Language}
 * @typedef {Object} AssociationProjectLanguage
 * @property {string} project_id - The id of the project coded
 * @property {string} language_id - The id of the language the project is written in
 */

/**
 * Creates and returns a Mongo collection named "a\_project\_language" with allowed operations.
 *
 * @type {Mongo.Collection<AssociationProjectLanguage>} The Mongo collection of associations documents
 */
const AssociationsProjectLanguageCollection = new Mongo.Collection("a_project_language")
AssociationsProjectLanguageCollection.allow({
    insert: () => true,
    remove: () => true,
    update: () => true,
})
export default AssociationsProjectLanguageCollection
