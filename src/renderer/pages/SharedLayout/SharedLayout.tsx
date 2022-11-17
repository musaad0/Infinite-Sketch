import { Outlet } from 'react-router-dom';
import AppBar from 'renderer/pages/SharedLayout/AppBar';

export default function SharedLayout() {
  return (
    <>
      <AppBar />
      <section>
        <Outlet />
      </section>
    </>
  );
}
