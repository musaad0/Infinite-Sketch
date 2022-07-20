import React from 'react';
import { Outlet } from 'react-router-dom';
import AppBar from 'renderer/components/AppBar';
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
