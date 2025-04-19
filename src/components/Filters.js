import "./Filters.css";
import { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";

const Filters = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000});
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");

  // prepinani filtrovaciho okna
  const toggleShowFilters = () => {
    setShowFilters(!showFilters);
  }

  // aplikovani filtru a poslani do parent componentu
  const handleFilterChange = () => {
    onFilterChange({
      priceRange,
      selectedTags,
      selectedColor,
    });
  }

  // nastaveni filtru na default
  const handleFilterReset = () => {
    setPriceRange({ min: 0, max: 100000})
    setSelectedColor("")
    setSelectedTags([])
  }

  const prekladac = (slovo) => {
    switch(slovo) {
      case "black":
        return "černá"
      case "blue":
        return "modrá"
      case "red":
        return "červená"
      case "brown":
        return "hnědá"
      case "white":
        return "bílá"
      case "yellow":
        return "žlutá"
      case "green":
        return "zelená"
      case "gray":
        return "šedá"
      default:
        return ""
    }
  }

  return (

    <div className="filters">
      {/* prepinaci tlacitko */}
      <button className="showFiltersButton" onClick={toggleShowFilters}>
        <IoFilterOutline /> Filtrovat
      </button>
      {/* filtrove okno */}
      {showFilters && (
        <div className="filtersOverlay">
          <div className="filtersContent">
          <button className="closeFiltersButton" onClick={toggleShowFilters}>
            X
          </button>
            <h3>Filtry</h3>
            <br />
            

            {/* cenový slider */}
            <div className="filterSection">
              <h4>Cena</h4>
              <div className="priceInputs">
                <input
                  type="number" min="0"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: Number(e.target.value) })
                  }
                  placeholder="Min"
                />
                <input
                  type="number" min="0"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: Number(e.target.value) })
                  }
                  placeholder="Max"
                />
              </div>
            </div>
              {/* picker barvy */}
              <div className="filterSection">
              <h4>Barva</h4>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}>
                <option value="">Vše</option>
                {["black", "brown", "blue", "red", "white"].map((color) => (
                  <option key={color} value={color}>
                    {prekladac(color)}
                  </option>
                ))}
              </select>
            </div>


            {/* tagy */}
            <div className="filterSection">
              <h4>Štítky</h4>
              {["sharp", "steel", "magnum"].map((tag) => (
                <div key={tag}>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      )
                    }
                  />
                  <label>{tag}</label>
                </div>
              ))}
            </div>

            {/* tlacitka*/}
            <div className="filterButtons">
              <button className="resetFiltersButton"
                onClick={handleFilterReset}>
                  Resetovat filtry
              </button>
              <button
                className="applyFiltersButton"
                onClick={() => {
                  handleFilterChange();
                  toggleShowFilters();
                }}>
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
