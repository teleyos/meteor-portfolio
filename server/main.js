// @ts-check
import { Meteor } from 'meteor/meteor';
import StatusCollection from "../imports/api/status"
import ProjectCollection from "../imports/api/projects"
import FrameworkCollection from "../imports/api/frameworks"
import LanguageCollection from "../imports/api/languages"
import AssociationProjectLanguageCollection from '../imports/api/associations/projects_languages';
import AssociationFrameworkLanguageCollection from "../imports/api/associations/frameworks_languages.js"
import AssociationProjectFrameworkCollection from "../imports/api/associations/projects_frameworks.js"
import { populateTables } from "../imports/api/fixtures/fixtures"

const COLLECTIONS = {
    StatusCollection,
    ProjectCollection,
    FrameworkCollection,
    LanguageCollection,
    AssociationProjectLanguageCollection,
    AssociationFrameworkLanguageCollection,
    AssociationProjectFrameworkCollection
}

/**
 * @param {string} s
 */
const getMongoName = s => s.replace("Collection", "")
    .replace("Association", "a")
    .replace(/([A-Z])/, "_$1")
    .toLowerCase()

Meteor.startup(async () => {

    populateTables(COLLECTIONS)

});
