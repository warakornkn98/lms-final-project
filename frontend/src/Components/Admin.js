import React from 'react'
import { AuthData } from '../Auth/AuthContext'
import Books from './Book/Books';
import MyNavbar from './Navbar';
import { Outlet, Route, Routes } from 'react-router-dom';
import BookTable from './Book/BooksTable';

const User = () => {

  const {user} = AuthData()
  console.log(user);
  return (
    <>
      <MyNavbar/>
      <Outlet/>
    </>
  )
}

export default User
