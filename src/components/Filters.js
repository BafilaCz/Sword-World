
import "./Filters.css"
import { useState } from 'react'
import { FaFilter } from "react-icons/fa"
import { IoFilterOutline } from "react-icons/io5"


const Filters = () => {
    const [showFilters, setShowFilters] = useState(false)

    const toggleShowFilters = () => {
        setShowFilters(!showFilters)
    }

  return (

    
    <div className='filters'>

        <button className='showFiltersButton' onClick={toggleShowFilters}><IoFilterOutline /> Filtrovat produkty</button>

        { showFilters &&(

        <div className="filtersOverlay">
            <div className="filtersContent">

            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore laborum nostrum tempora quis quae saepe asperiores magnam nulla vitae laboriosam, quaerat eveniet fugiat quod ducimus. Tempora aspernatur eveniet doloribus ea!</p>
            <button className='closeFiltersButton' onClick={toggleShowFilters}>X</button>

            </div>
        </div> )}
    </div>
   
  )
}

export default Filters