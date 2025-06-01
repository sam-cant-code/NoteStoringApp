import React from 'react';
import SearchIcon from '../reactIcons/SearchIcon.png';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex items-center bg-white rounded-full shadow px-4 py-2 w-full max-w-md">
        <img src={SearchIcon} alt="Search Icon" className="w-5 h-5 mr-2 opacity-60" />
        <input
          type="text"
          placeholder="Search Notes..."
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default SearchBar;