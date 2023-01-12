/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import Customers from './Pages/Customers/Customers';
import Login from './Pages/Login/Login';
import Orders from './Pages/Orders/Orders';
import Products from './Pages/Products/Products';

const App = () => {

  let isIn;
  const callPage = () => {
    isIn = sessionStorage.getItem('isLoggedIn');
    return isIn;
  }
  
  React.useEffect(() => {
    callPage();
  },[callPage(), isIn]);

return (
  <BrowserRouter>
  { isIn ? <NavBar /> : <div></div>}
      <Routes>
        <Route exact path='/login' element={ <Login /> } />
        <Route path='/products' element={ <Products /> } />
        <Route path='/customers' element={ <Customers /> } />
        <Route path='/orders' element={ <Orders /> } />
      </Routes>
    </BrowserRouter>
);
};

export default App;