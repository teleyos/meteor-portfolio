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
 * @property {Mongo.Collection<Project>} ProjectsCollection - the meteor mongo db collection for project documents
 * @property {Mongo.Collection<Status>} StatusCollection - the meteor mongo db collection for status documents
 * @property {Mongo.Collection<Framework>} FrameworksCollection - the meteor mongo db collection for framework documents
 * @property {Mongo.Collection<Language>} LanguagesCollection - the meteor mongo db collection for language documents
 *
 * @property {Mongo.Collection<AssociationProjectLanguage>} AssociationsProjectLanguageCollection - the meteor mongo db collection for associations between projects and languages
 * @property {Mongo.Collection<AssociationFrameworkLanguage>} AssociationsFrameworkLanguageCollection - the meteor mongo db collection for associations between frameworks and languages
 * @property {Mongo.Collection<AssociationProjectFramework>} AssociationsProjectFrameworkCollection - the meteor mongo db collection for associations between projects and frameworks
 */

/**
 * Populates the db
 * @param {PopulateTablesArgs} test - The meteor mongo collections
 */
export const populateTables = async ({
    StatusCollection,
    ProjectsCollection,
    FrameworksCollection,
    LanguagesCollection,
    AssociationsProjectLanguageCollection,
    AssociationsFrameworkLanguageCollection,
    AssociationsProjectFrameworkCollection,
}) => {
    // need these tables to be full before writing the example associations
    await Promise.all([
        populateStatus(StatusCollection),
        populateProjects(ProjectsCollection),
        populateFrameworks(FrameworksCollection),
        populateLanguages(LanguagesCollection)
    ])

    await Promise.all([
        populateAssociationProjectLanguage(AssociationsProjectLanguageCollection, ProjectsCollection, LanguagesCollection),
        populateAssociationFrameworkLanguage(AssociationsFrameworkLanguageCollection, FrameworksCollection, LanguagesCollection),
        populateAssociationProjectFramework(AssociationsProjectFrameworkCollection, ProjectsCollection, FrameworksCollection)
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
 * @param {Mongo.Collection<Project>} ProjectsCollection
 */
const populateProjects = async (ProjectsCollection) => {
    if (await ProjectsCollection.find().countAsync() !== 0) return;
    for (let i = 0; i < 10; i++) {
        let project = generateProject().next().value
        if (project) await ProjectsCollection.insertAsync(project)
    }
}

/**
 * @param {Mongo.Collection<Framework>} FrameworksCollection
 */
const populateFrameworks = async (FrameworksCollection) => {

    if (await FrameworksCollection.find().countAsync() !== 0) return;
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

    frameworksFixtures.forEach((framework) => FrameworksCollection.insertAsync(framework))
}

/**
 * @param {Mongo.Collection<Language>} LanguagesCollection
 */
const populateLanguages = async (LanguagesCollection) => {
    if (await LanguagesCollection.find().countAsync() !== 0) return;
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
    languageFixtures.forEach((language) => LanguagesCollection.insertAsync(language))
}

/**
 * Populates a_project_language
 * @param {Mongo.Collection<AssociationProjectLanguage>} AssociationsProjectLanguageCollection
 * @param {Mongo.Collection<Project>} ProjectsCollection
 * @param {Mongo.Collection<Language>} LanguagesCollection
 */
const populateAssociationProjectLanguage = async (AssociationsProjectLanguageCollection, ProjectsCollection, LanguagesCollection) => {
    if (await AssociationsProjectLanguageCollection.find().countAsync() !== 0) return;
    const languageIds = LanguagesCollection.find().map(l => l._id)
    const randIndex = () => Math.floor(Math.random() * languageIds.length)
    ProjectsCollection.find().map(p => {
        AssociationsProjectLanguageCollection.insertAsync({
            project_id: p._id,
            language_id: languageIds[randIndex()]
        })
    })
}

/**
 * Populates a_framework_language
 * @param {Mongo.Collection<AssociationFrameworkLanguage>} AssociationsFrameworkLanguageCollection
 * @param {Mongo.Collection<Framework>} FrameworksCollection
 * @param {Mongo.Collection<Language>} LanguagesCollection
 */
const populateAssociationFrameworkLanguage = async (AssociationsFrameworkLanguageCollection, FrameworksCollection, LanguagesCollection) => {
    if (await AssociationsFrameworkLanguageCollection.find().countAsync() !== 0) return;
    const languageIds = LanguagesCollection.find().map(l => l._id)
    const randIndex = () => Math.floor(Math.random() * languageIds.length)
    FrameworksCollection.find().map(f => {
        AssociationsFrameworkLanguageCollection.insertAsync({
            framework_id: f._id,
            language_id: languageIds[randIndex()]
        })
    })
}

/**
 * Populates a_project_framework
 * @param {Mongo.Collection<AssociationProjectFramework>} AssociationsProjectFrameworkCollection
 * @param {Mongo.Collection<Project>} ProjectsCollection
 * @param {Mongo.Collection<Framework>} FrameworksCollection
 */
const populateAssociationProjectFramework = async (AssociationsProjectFrameworkCollection, ProjectsCollection, FrameworksCollection) => {
    if (await AssociationsProjectFrameworkCollection.find().countAsync() !== 0) return;
    const frameworkIds = FrameworksCollection.find().map(f => f._id)
    const randIndex = () => Math.floor(Math.random() * frameworkIds.length)
    ProjectsCollection.find().map(p => {
        AssociationsProjectFrameworkCollection.insertAsync({
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
