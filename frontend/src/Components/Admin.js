import React from 'react'
import { Outlet } from 'react-router-dom';

import NavbarComponent from './Navbar';


const User = () => {

  return (
    <>
      <NavbarComponent/>
      <Outlet/>
    </>
  )
}

export default User
