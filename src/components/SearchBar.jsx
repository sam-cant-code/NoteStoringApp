const SearchBar = ({ value, onChange }) => (
  <div className="mb-4 flex justify-center">
    <input
      type="text"
      className="w-full max-w-md px-4 py-2 rounded border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      placeholder="Search notes..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default SearchBar;