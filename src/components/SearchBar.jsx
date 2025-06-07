import React, { useState } from 'react';
import SearchIcon from '../reactIcons/searchIcon.png';

const SearchBar = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative z-10 my-4 ${isFocused ? ' bg-opacity-30 fixed inset-0 flex items-center justify-center' : 'flex items-center justify-center'}`}>
      <div className="z-20 w-full max-w-md">
        <div className={`flex items-center bg-white rounded-full shadow px-4 py-2 transition-all duration-300 ${isFocused ? 'ring-2 ring-yellow-500 shadow-xl' : ''}`}>
          <img src={SearchIcon} alt="Search Icon" className="w-5 h-5 mr-2 opacity-60" />
          <input
            type="text"
            placeholder="Search Notes..."
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;