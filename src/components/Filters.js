import "./Filters.css";
import { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";

const Filters = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000});
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");

  const toggleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle filter changes and pass them up to the parent component
  const handleFilterChange = () => {
    onFilterChange({
      priceRange,
      selectedTags,
      selectedColor,
    });
  };
  const handleFilterReset = () => {
    setPriceRange({ min: 0, max: 100000})
    setSelectedColor("")
    setSelectedTags([])
  }
  return (
    <div className="filters">
      <button className="showFiltersButton" onClick={toggleShowFilters}>
        <IoFilterOutline /> Filtrovat
      </button>

      {showFilters && (
        <div className="filtersOverlay">
          <div className="filtersContent">
          <button className="closeFiltersButton" onClick={toggleShowFilters}>
            X
          </button>
            <h3>Filtry</h3>
            

            {/* Price Slider */}
            <div className="filterSection">
              <h4>Cena</h4>
              <div className="priceInputs">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: Number(e.target.value) })
                  }
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: Number(e.target.value) })
                  }
                  placeholder="Max"
                />
              </div>
            </div>
              {/* Color Picker */}
              <div className="filterSection">
              <h4>Barva</h4>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}>
                <option value="">Vše</option>
                {["black", "brown", "blue", "red", "white"].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>


            {/* Tags */}
            <div className="filterSection">
              <h4>Štítky</h4>
              {["sharp", "", ""].map((tag) => (
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

            {/* Buttons */}
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
