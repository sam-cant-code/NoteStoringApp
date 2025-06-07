import SearchBar from './SearchBar';
import UserProfile from './UserProfile';

const Navbar = ({ search, setSearch }) => (
  <nav className="w-full bg-yellow-300 shadow-md px-3 py-2 sm:px-4 sm:py-4">
    <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      {/* Logo */}
      <div className="text-center sm:text-left">
        <span className="font-bold text-2xl text-yellow-900 tracking-wide">MyNotes</span>
      </div>

      {/* Search and Profile in same row even on mobile */}
      <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex-shrink-0">
          <UserProfile />
        </div>
      </div>

    </div>
  </nav>
);

export default Navbar;