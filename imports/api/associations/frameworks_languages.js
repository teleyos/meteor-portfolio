import { Mongo } from 'meteor/mongo' 

/**
 * Association between {Framework} and {Language}
 * @typedef {Object} AssociationFrameworkLanguage
 * @property {string} framework_id - The id of the framework made for the language
 * @property {string} language_id - The id of the language for the framework
 */

/**
 * Creates and returns a Mongo collection named "a_framework_language" with allowed operations.
 *
 * @type {Mongo.Collection<AssociationFrameworkLanguage>} The Mongo collection of associations documents
 */
const AssociationsFrameworkLanguageCollection = new Mongo.Collection("a_framework_language")
AssociationsFrameworkLanguageCollection.allow({
    insert: () => true,
    remove: () => true,
    update: () => true,
})
export default AssociationsFrameworkLanguageCollection

