// @ts-check
import { Mongo } from 'meteor/mongo'

/**
 * @typedef {Object} Project
 * @property {string} [_id] - Unique identifier for the project's document
 * @property {string} title - The name of the project 
 * @property {string} body - Markdown for the body
 * @property {string} start_date - The date of project beginning
 * @property {string} end_date - The date of project end
 * @property {string} status_id - The id from the status accurate to the project
 */

/**
 * Creates and returns a Mongo collection named "projects" with allowed operations.
 *
 * @type {Mongo.Collection<Project>} The Mongo collection of Project documents
 */
const ProjectsCollection = new Mongo.Collection("projects")
ProjectsCollection.allow({
    insert: () => true,
    remove: () => true,
    update: () => true,
})
export default ProjectsCollection
