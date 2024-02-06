import { Mongo } from 'meteor/mongo' 

/**
 * @typedef {Object} Framework
 * @property {string} [_id] - Unique identifier for the framework's document
 * @property {string} label - The name of the framework
 * @property {string} website_url - The url to the framework's website
 * @property {number} proficiency - Note of the proficiency out of 10
 */

/**
 * Creates and returns a Mongo collection named "frameworks" with allowed operations.
 *
 * @type {Mongo.Collection<Framework>} The Mongo collection of Framework documents
 */
const FrameworksCollection = new Mongo.Collection("frameworks")
FrameworksCollection.allow({
    insert: () => true,
    remove: () => true,
    update: () => true,
})
export default FrameworksCollection
