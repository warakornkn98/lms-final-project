import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import { AuthProvider } from './Auth/AuthContext';
import Login from './Auth/Login';
import Admin from './Components/Admin';
import Books from './Components/Book/Books';
import BookDetail from './Components/Book/BookDetail';
import BookForm from './Components/Book/BookForm';
import ProtectedRoute from './Auth/ProtectedRoute';
import BooksManager from './Components/Book/BooksManager';
import Borrow from './Components/Borrow/Borrow';
import Dashboard from './Components/Dashboard';

function App() {
  
  useEffect(() => {

  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' element={<ProtectedRoute><Admin/></ProtectedRoute>}>
              <Route index element={<Books/>}/>
            </Route>
            <Route path='/books' element={<ProtectedRoute><Admin/></ProtectedRoute>}>
              <Route index element={<Books/>}/>
              <Route path=':id' element={<BookDetail/>}/>
            </Route>
            <Route path='/admin' element={<ProtectedRoute><Admin/></ProtectedRoute>}>
              <Route index element={<BooksManager/>}/>
              <Route path='booktable' element={<BooksManager/>}/>
              <Route path='bookform' element={<BookForm />}/>
              <Route path='borrow' element={<Borrow />}/>
              <Route path='dashboard' element={<Dashboard />}/>
              {/* <Route path='updatebook/:id' element={<UpdateBook/>}/> */}
            </Route>
          {/* <Route path='*' element={<Login/>}/> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;