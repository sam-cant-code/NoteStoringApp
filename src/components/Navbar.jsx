import SearchBar from './SearchBar';
import UserProfile from './UserProfile';

const Navbar = ({ search, setSearch }) => (
  <nav className="w-full bg-yellow-300 shadow-md px-6 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="font-bold text-xl text-yellow-900 tracking-wide">MyNotes</span>
    </div>
    <div className="flex-1 flex justify-center">
      <div className="w-full max-w-md">
        <SearchBar value={search} onChange={setSearch} />
      </div>
    </div>
    
    <UserProfile />
  </nav>
);

export default Navbar;