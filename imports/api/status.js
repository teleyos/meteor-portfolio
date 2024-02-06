import { Mongo } from 'meteor/mongo' 

/**
 * The status of a project
 * @typedef {Object} Status
 * @property {string} _id - Unique identifier for the status document
 * @property {string} label - The name of the status 
 */

/**
 * Creates and returns a Mongo collection named "status" with allowed operations.
 *
 * @type {Mongo.Collection<Status>} The Mongo collection of Status documents
 */
const StatusCollection = new Mongo.Collection("status")
StatusCollection.allow({
    insert: () => true,
    remove: () => true,
    update: () => true,
})
export default StatusCollection
