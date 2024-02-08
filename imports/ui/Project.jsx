// @ts-check
import React, { useEffect, useState } from "react"
import { Meteor } from "meteor/meteor"
import { useTracker } from "meteor/react-meteor-data"
import { useParams } from "react-router-dom"
import ProjectsCollection from "../api/projects"
import StatusCollection from "../api/status"
import { LoginForm } from "./LoginForm.jsx"

export const Project = () => {
    const params = useParams()
    const project = useTracker(() => ProjectsCollection.findOne(params.id), [params])
    const status = useTracker(() => project ? StatusCollection.findOne(project?.status_id) : null, [project])

    useEffect(() => {
        Meteor.subscribe("project", params.id)
        if (project) {
            Meteor.subscribe("statusOne", project?.status_id)
        }
    }, [params, project])

    return <>
        <a href="/">back</a>
        <h1>{project?.title ?? `Loading ${params.id}`}</h1>
        {status && project ? <StatusEditor {...project} /> : "Status Loading"}
        <LoginForm />
        <div style={{ color: "teal" }}>
            todo :
            <ul>
                <li>
                    show all frameworks used
                </li>
                <li>
                    render markdown body (problem with vfile and mdx)
                </li>
                <li>
                    show language used (project+framework !duplicates)
                </li>
                <li>
                    add icons to status dropdown
                </li>
            </ul>
        </div>
        {project ? <BodyEditor {...project} /> : "Body loading"}
    </>
}

/**
 * @param {import('../api/projects.js').Project} project
 */
const StatusEditor = (project) => {
    const user = useTracker(() => Meteor.user())
    const [editing, setEditing] = useState(false)
    const allStatus = useTracker(() => StatusCollection.find().fetch())

    useEffect(() => {
        Meteor.subscribe("project",project._id)
        Meteor.subscribe("status")
    }, [])

    if (user) {
        if (editing) {
            return <select onChange={(e) => {
                ProjectsCollection.update({_id:project._id},{$set:{status_id:e.target.value}})
            }}>
                {allStatus?.map(s => <option key={s._id} selected={s._id == project.status_id} value={s._id}>
                    {s.label}
                </option>)}

            </select>
        }
        return <>
            <h2>{allStatus.filter(s=>s._id==project.status_id)[0].label} <a onClick={() => setEditing(!editing)}>down_arrow</a></h2>
        </>
    }
    return <h2>{allStatus.filter(s=>s._id==project.status_id)[0].label}</h2>
}

/**
 * @param {import('../api/projects.js').Project} project
 */
const BodyEditor = (project) => {
    const [body, setBody] = useState(project.body)
    const [editing, setEditing] = useState(false)
    const user = useTracker(() => Meteor.user())

    useEffect(() => {
        Meteor.subscribe('project', project._id)
    }, [])

    if (user) {
        return <>
            <a onClick={() => {
                if (editing) ProjectsCollection.update({ _id: project._id }, { $set: { body } })
                setEditing(!editing)
            }
            }>{editing ? "save" : "edit"}</a>

            {editing ? <>
                | <a onClick={() => {
                    setEditing(!editing)
                    setBody(project.body)
                }}>cancel</a>
            </> : ""
            }<br />

            {editing ?
                <textarea
                    name="projectBody"
                    cols={30}
                    rows={10}
                    defaultValue={body}
                    readOnly={!editing}
                    onChange={(e) => {
                        setBody(e.target.value)
                    }}
                />
                :
                <p>{body}</p>
            }
        </>
    }

    return <p>{body}</p>
}
