import { NavLink, Outlet } from 'react-router';

export default function Layout() {
  return (
    <div>
      <div>
        <NavLink to="/spa">Page One</NavLink>
        <NavLink to="/spa/page-two">Page Two</NavLink>
      </div>
      <Outlet />
    </div>
  );
}
