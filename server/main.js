// @ts-check
import { Meteor } from 'meteor/meteor';
import { Accounts } from "meteor/accounts-base"
import { check } from 'meteor/check'
import StatusCollection from "../imports/api/status"
import ProjectsCollection from "../imports/api/projects"
import FrameworksCollection from "../imports/api/frameworks"
import LanguagesCollection from "../imports/api/languages"
import AssociationsProjectLanguageCollection from '../imports/api/associations/projects_languages';
import AssociationsFrameworkLanguageCollection from "../imports/api/associations/frameworks_languages.js"
import AssociationsProjectFrameworkCollection from "../imports/api/associations/projects_frameworks.js"
import { populateTables } from "../imports/api/fixtures/fixtures"

const SEED_USERNAME = "meteorite"
const SEED_PASSWORD = "password"

Meteor.startup(async () => {

    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD,
        })
    }

    populateTables({
        StatusCollection,
        ProjectsCollection,
        FrameworksCollection,
        LanguagesCollection,
        AssociationsProjectLanguageCollection,
        AssociationsFrameworkLanguageCollection,
        AssociationsProjectFrameworkCollection
    })

    Meteor.publish("projects", () => ProjectsCollection.find())

    Meteor.publish("project", function(_id) {
        check(_id, String)

        return ProjectsCollection.find({ _id })
    })

    Meteor.publish("status", () => StatusCollection.find())

    Meteor.publish("statusOne", function(_id) {
        check(_id, String)

        return StatusCollection.find({ _id })
    })

    Meteor.publish("frameworks", () => FrameworksCollection.find())

    Meteor.publish("framework", function(_id) {
        check(_id, String)

        return FrameworksCollection.find({ _id })
    })

    Meteor.publish("framework.projects", function(_id) {
        check(_id, String)

        const associations = AssociationsProjectFrameworkCollection.find({ framework_id: _id }).map(a => a.project_id)
        return ProjectsCollection.find({ _id: { $in: associations } })
    })

    Meteor.publish("languages", () => LanguagesCollection.find())

    Meteor.publish("language", function(_id) {
        check(_id, String)

        return LanguagesCollection.find({ _id })
    })
});
