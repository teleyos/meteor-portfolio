// @ts-check
import React, { useEffect } from "react"
import { Meteor } from "meteor/meteor"
import { useTracker } from "meteor/react-meteor-data"
import { useParams } from "react-router-dom"
import FrameworksCollection from "../api/frameworks"
import ProjectsCollection from "../api/projects"

export const Framework = () => {
    const params = useParams()
    const framework = useTracker(() => FrameworksCollection.findOne(params.id), [params])
    const projects = useTracker(() => ProjectsCollection.find().fetch(),[framework])

    useEffect(() => {
        Meteor.subscribe("framework",params.id)
        Meteor.subscribe("framework.projects",params.id)
    }, [params, framework])

    return <>
        <a href="/">back</a>
        <h1>{framework?.label ?? `Loading ${params.id}`}</h1>
        <h2>Project using this framework</h2>
        <ul>
        {
        projects?.map(p=><li key={p._id}>
            <a href={`/project/${p._id}`}>{p.title}</a>
        </li>)
        }
        </ul>
    </>
}
