import { Mongo } from "meteor/mongo"
// @ts-check

/**
 * @typedef {import('../projects.js').Project} Project
 * @typedef {import('../status.js').Status} Status
 * @typedef {import('../frameworks.js').Framework} Framework
 * @typedef {import('../languages.js').Language} Language
 *
 * @typedef {import('../associations/projects_languages.js').AssociationProjectLanguage} AssociationProjectLanguage
 * @typedef {import('../associations/frameworks_languages.js').AssociationFrameworkLanguage} AssociationFrameworkLanguage
 * @typedef {import('../associations/projects_frameworks.js').AssociationProjectFramework} AssociationProjectFramework
 */

/**
 * @typedef {Object} PopulateTablesArgs
 * @property {Mongo.Collection<Project>} ProjectCollection - the meteor mongo db collection for project documents
 * @property {Mongo.Collection<Status>} StatusCollection - the meteor mongo db collection for status documents
 * @property {Mongo.Collection<Framework>} FrameworkCollection - the meteor mongo db collection for framework documents
 * @property {Mongo.Collection<Language>} LanguageCollection - the meteor mongo db collection for language documents
 *
 * @property {Mongo.Collection<AssociationProjectLanguage>} AssociationProjectLanguageCollection - the meteor mongo db collection for associations between projects and languages
 * @property {Mongo.Collection<AssociationFrameworkLanguage>} AssociationFrameworkLanguageCollection - the meteor mongo db collection for associations between frameworks and languages
 * @property {Mongo.Collection<AssociationProjectFramework>} AssociationProjectFrameworkCollection - the meteor mongo db collection for associations between projects and frameworks
 */

/**
 * Populates the db
 * @param {PopulateTablesArgs} test - The meteor mongo collections
 */
export const populateTables = async ({
    StatusCollection,
    ProjectCollection,
    FrameworkCollection,
    LanguageCollection,
    AssociationProjectLanguageCollection,
    AssociationFrameworkLanguageCollection,
    AssociationProjectFrameworkCollection,
}) => {
    // need these tables to be full before writing the example associations
    await Promise.all([
        populateStatus(StatusCollection),
        populateProjects(ProjectCollection),
        populateFrameworks(FrameworkCollection),
        populateLanguages(LanguageCollection)
    ])

    await Promise.all([
        populateAssociationProjectLanguage(AssociationProjectLanguageCollection, ProjectCollection, LanguageCollection),
        populateAssociationFrameworkLanguage(AssociationFrameworkLanguageCollection, FrameworkCollection, LanguageCollection),
        populateAssociationProjectFramework(AssociationProjectFrameworkCollection, ProjectCollection, FrameworkCollection)
    ])

}

/**
 * @param {Mongo.Collection<Status>} StatusCollection
 */
const populateStatus = async (StatusCollection) => {
    if (await StatusCollection.find().countAsync() !== 0) return;
    [
        "In progress",
        "Done",
        "Idea",
    ].forEach((label, index) => StatusCollection.insertAsync({
        _id: index.toString(),
        label,
    }))
}

/**
 * @param {Mongo.Collection<Project>} ProjectCollection
 */
const populateProjects = async (ProjectCollection) => {
    if (await ProjectCollection.find().countAsync() !== 0) return;
    for (let i = 0; i < 10; i++) {
        let project = generateProject().next().value
        if (project) await ProjectCollection.insertAsync(project)
    }
}

/**
 * @param {Mongo.Collection<Framework>} FrameworkCollection
 */
const populateFrameworks = async (FrameworkCollection) => {

    if (await FrameworkCollection.find().countAsync() !== 0) return;
    /**
     * @type {Array<Framework>}
     */
    let frameworksFixtures = [
        {
            label: "React",
            proficiency: 8,
            website_url: "https://fr.react.dev/"
        }, {
            label: "Svelte",
            proficiency: 3,
            website_url: "https://svelte.dev/"
        }, {
            label: "NestJS",
            proficiency: 3,
            website_url: "https://nestjs.com/"
        }
    ]

    frameworksFixtures.forEach((framework) => FrameworkCollection.insertAsync(framework))
}

/**
 * @param {Mongo.Collection<Language>} LanguageCollection
 */
const populateLanguages = async (LanguageCollection) => {
    if (await LanguageCollection.find().countAsync() !== 0) return;
    /**
     * @type {Array<Language>}
     */
    let languageFixtures = [
        {
            label: "JavaScript",
            proficiency: 10,
        }, {
            label: "Go",
            proficiency: 4,
        }, {
            label: "Java",
            proficiency: 7,
        }, {
            label: "SQL",
            proficiency: 10,
        }, {
            label: "Python",
            proficiency: 7,
        }
    ]
    languageFixtures.forEach((language) => LanguageCollection.insertAsync(language))
}

/**
 * Populates a_project_language
 * @param {Mongo.Collection<AssociationProjectLanguage>} AssociationProjectLanguageCollection
 * @param {Mongo.Collection<Project>} ProjectCollection
 * @param {Mongo.Collection<Language>} LanguageCollection
 */
const populateAssociationProjectLanguage = async (AssociationProjectLanguageCollection, ProjectCollection, LanguageCollection) => {
    if (await AssociationProjectLanguageCollection.find().countAsync() !== 0) return;
    const languageIds = LanguageCollection.find().map(l => l._id)
    const randIndex = () => Math.floor(Math.random() * languageIds.length)
    ProjectCollection.find().map(p => {
        AssociationProjectLanguageCollection.insertAsync({
            project_id: p._id,
            language_id: languageIds[randIndex()]
        })
    })
}

/**
 * Populates a_framework_language
 * @param {Mongo.Collection<AssociationFrameworkLanguage>} AssociationFrameworkLanguageCollection
 * @param {Mongo.Collection<Framework>} FrameworkCollection
 * @param {Mongo.Collection<Language>} LanguageCollection
 */
const populateAssociationFrameworkLanguage = async (AssociationFrameworkLanguageCollection, FrameworkCollection, LanguageCollection) => {
    if (await AssociationFrameworkLanguageCollection.find().countAsync() !== 0) return;
    const languageIds = LanguageCollection.find().map(l => l._id)
    const randIndex = () => Math.floor(Math.random() * languageIds.length)
    FrameworkCollection.find().map(f => {
        AssociationFrameworkLanguageCollection.insertAsync({
            framework_id: f._id,
            language_id: languageIds[randIndex()]
        })
    })
}

/**
 * Populates a_project_framework
 * @param {Mongo.Collection<AssociationProjectFramework>} AssociationProjectFrameworkCollection
 * @param {Mongo.Collection<Project>} ProjectCollection
 * @param {Mongo.Collection<Framework>} FrameworkCollection
 */
const populateAssociationProjectFramework = async (AssociationProjectFrameworkCollection, ProjectCollection, FrameworkCollection) => {
    if (await AssociationProjectFrameworkCollection.find().countAsync() !== 0) return;
    const frameworkIds = FrameworkCollection.find().map(f => f._id)
    const randIndex = () => Math.floor(Math.random() * frameworkIds.length)
    ProjectCollection.find().map(p => {
        AssociationProjectFrameworkCollection.insertAsync({
            project_id: p._id,
            framework_id: frameworkIds[randIndex()]
        })
    })
}

/**
 * Generates a title for a project
 */
function* generateTitle() {
    /**
     * @type {Array<string>}
     */
    let list = ["a title", "an other title", "yet an other one", "and an other"]
    for (; ;) {
        yield list[Math.floor(Math.random() * list.length)]
    }
}

/** 
 * Generates a project
 */
function* generateProject() {
    for (; ;) {
        /**
         * @type {Project}
         */
        let project = {
            title: generateTitle().next().value ?? "defaultTitle",
            body: "# title\
            Just a dummy text\
            ## owo\
            jkdnck\
            # uwu",
            start_date: `20${Math.floor(Math.random() * 20)}-02-05`,
            end_date: `20${Math.floor(Math.random() * 20)}-02-05`,
            status_id: Math.floor(Math.random() * 3).toString()
        }
        yield project
    }
}
