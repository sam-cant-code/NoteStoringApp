import UserProfile from './UserProfile';

const Navbar = () => (
  <nav className="w-full bg-yellow-300 shadow-md px-6 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="font-bold text-xl text-yellow-900 tracking-wide">MyNotes</span>
    </div>
    <UserProfile />
  </nav>
);

export default Navbar;