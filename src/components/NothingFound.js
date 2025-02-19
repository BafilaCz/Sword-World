import React from 'react'
import { PiEmpty } from "react-icons/pi";
import "./NothingFound.css"




const NothingFound = () => {
  return (
    <div className="nothingFound">
        <PiEmpty className="nothingFoundIcon" />
        <h1>Nic jsme nenašli</h1>
    </div>
  )
}

export default NothingFound