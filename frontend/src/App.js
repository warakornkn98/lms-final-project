import { BrowserRouter, Navigate, Route, Router, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import Admin from './Components/Admin';
import Login from './Auth/Login';
import { AuthProvider } from './Auth/AuthContext';
import BookTable from './Components/Book/BooksTable';
import Books from './Components/Book/Books';
import BookDetail from './Components/Book/BookDetail';
import User from './Components/Admin';
import UpdateBook from './Components/Book/UpdateBook';
import AddBook from './Components/Book/AddBook';

function App() {
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {

  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes> 
          <Route path='/login' element={<Login/>}/>
          <Route path='/' element={<User/>}>
            <Route index element={<Books/>}/>
            <Route path='a' element={<BookDetail/>}/>
          </Route>
          <Route path='admin' element={<Admin/>}>
            <Route index element={<Books/>}/>
            <Route path='a' element={<BookTable/>}/>
            <Route path='addbook' element={<AddBook fetchbook={BookTable.fetchbook}/>}/>
            <Route path='updatebook/:id' element={<UpdateBook/>}/>
          </Route>
          
          {/* <Route path='*' element={<Login/>}/> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;