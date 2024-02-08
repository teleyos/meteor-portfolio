// @ts-check
import React, { useEffect } from "react"
import { Meteor } from "meteor/meteor"
import { useTracker } from "meteor/react-meteor-data"
import { useParams } from "react-router-dom"
import LanguagesCollection from "../api/languages"

export const Language = () => {
    const params = useParams()
    const language = useTracker(()=>LanguagesCollection.findOne(),[params])

    useEffect(() => {
        Meteor.subscribe("language",params.id)
    }, [params])

    return <>
        <a href="/">back</a>
        <h1>{language?.label ?? `Loading ${params.id}`}</h1>
    </>
}
