// @ts-check
import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor'
import { useTracker } from "meteor/react-meteor-data"
import ProjectsCollection from '../api/projects';
import FrameworksCollection from '../api/frameworks';
import StatusCollection from '../api/status';
import LanguagesCollection from '../api/languages';
import { LoginForm } from './LoginForm';

export const App = () => {

    const projects = useTracker(() => ProjectsCollection.find().fetch())
    const frameworks = useTracker(() => FrameworksCollection.find().fetch())
    const languages = useTracker(() => LanguagesCollection.find().fetch())
    const user = useTracker(() => Meteor.user())
    const [addingProject, setAddingProject] = useState(false)

    useEffect(() => {
        Meteor.subscribe("projects")
        Meteor.subscribe("status")
        Meteor.subscribe("frameworks")
        Meteor.subscribe("languages")
    }, [])

    return (
        <>
            <h1>TODO : Add other lists and project status and allow modification if connected</h1>
            <LoginForm />
            <p style={{ color: "teal" }}>todo : handle login/register errors </p>
            <h1>Projects {user ? <span onClick={() => setAddingProject(!addingProject)}>{addingProject ? "-" : "+"}</span>:""}</h1>
            {user && addingProject ? <AddProjectForm /> : ""}
            <ul>
                {
                    projects?.map(p => <li key={p._id}>
                        <a href={`/project/${p._id}`}>{p.title}</a> -
                        {" " + StatusCollection.findOne({ _id: p.status_id })?.label ?? ""}
                        {user ? <span onClick={()=>ProjectsCollection.removeAsync({_id: p._id})}>- delete</span>:""}
                    
                    </li>) ?? <>
                    </>
                }
            </ul>
            <h1>Known Frameworks</h1>
            <ul>
                {
                    frameworks?.map(f => <li key={f._id}>
                        <a href={`/framework/${f._id}`}>{f.label}</a>
                    </li>) ?? <>
                    </>
                }
            </ul>
            <h1>Language</h1>
            <ul>
                {
                    languages?.map(l => <li key={l._id}>
                        <a href={`/language/${l._id}`}>{l.label}</a>
                    </li>) ?? <>
                    </>
                }
            </ul>
        </>
    );
};

const AddProjectForm = () => {

    const allStatus = useTracker(() => StatusCollection.find().fetch())
    const [inserting, setInserting] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        Meteor.subscribe("status")
        Meteor.subscribe("projects")
    }, [])

    return <form onSubmit={async e => {
        e.preventDefault()
        setInserting(true)
        setError(null)
        await ProjectsCollection.insertAsync({
            title: e.target[0].value,
            status_id: e.target[1].value,
            body: e.target[2].value,
            start_date: "2024-05-01",
            end_date: "2024-05-01",
        })
        setInserting(false)

    }} style={{ display: "flex", flexDirection: "column" }}>
        <label>title</label>
        <input type="text" name="title" />
        <br />
        <label>status</label>
        <select name="status">
            {allStatus?.map(s => <option key={s._id} value={s._id}>
                {s.label}
            </option>)}
        </select>
        <br />
        <label>description</label>
        <textarea name="body" cols={30} rows={10}></textarea>
        <button type="submit">add project</button>
        {inserting ? "adding to the db":""}
    </form>
}
