// @ts-check
import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "../../ui/App"
import { Project } from "../../ui/Project";
import { Framework } from "../../ui/Framework";
import { Language } from "../../ui/Language";


/**
 * @type {React.FunctionComponent}
 */
export const RenderRoutes = () => {

    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/project/:id" element={<Project />} />
                    <Route path="/framework/:id" element={<Framework />} />
                    <Route path="/language/:id" element={<Language />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
