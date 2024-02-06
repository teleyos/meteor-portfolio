import { Mongo } from 'meteor/mongo' 

/**
 * @typedef {Object} Language
 * @property {string} [_id] - Unique identifier for the language's document
 * @property {string} label - The name of the language
 * @property {number} proficiency - Note of the proficiency out of 10
 */

/**
 * Creates and returns a Mongo collection named "languages" with allowed operations.
 *
 * @type {Mongo.Collection<Language>} The Mongo collection of Language documents
 */
const LanguagesCollection = new Mongo.Collection("languages")
LanguagesCollection.allow({
    insert: () => true,
    remove: () => true,
    update: () => true,
})
export default LanguagesCollection
