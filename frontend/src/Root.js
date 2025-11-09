import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeHeader from './components/EmployeeHeader'; // ✅ الجديد

function Root() {
  return (
    <>
      <EmployeeHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Root;
