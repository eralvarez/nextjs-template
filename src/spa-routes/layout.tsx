import { NavLink, Outlet } from 'react-router';

export default function Layout() {
  return (
    <div>
      <div>
        <NavLink to="/page-one">Page One</NavLink>
        <NavLink to="/page-two">Page Two</NavLink>
      </div>
      <Outlet />
    </div>
  );
}
