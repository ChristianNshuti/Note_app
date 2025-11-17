import React from "react"
import "./Error.css"
import ErrorIllustration from '../assets/nothing.webp'

export default function Error(){
    return(
        <div className="errorBoundary">
            <img src={ErrorIllustration} loading="lazy"/>
             <p>Ooops, Nothing here yet !😕</p>

        </div>
    )
}