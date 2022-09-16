import React from 'react';
import { Outlet } from 'react-router-dom';
import AppBar from 'renderer/pages/SharedLayout/AppBar';
import Menu from 'renderer/components/Menu';

export default function SharedLayout() {
  return (
    <>
      <AppBar />
      <section>
        <Outlet />
      </section>
      <Menu />
    </>
  );
}
