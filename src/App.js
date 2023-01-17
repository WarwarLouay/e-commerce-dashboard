/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import Categories from './Pages/Categories/Categories';
import CategoryDetails from './Pages/CategoryDetails/CategoryDetails';
import Customers from './Pages/Customers/Customers';
import Login from './Pages/Login/Login';
import OrderDetails from './Pages/OrderDetails/OrderDetails';
import Orders from './Pages/Orders/Orders';
import Products from './Pages/Products/Products';

const App = () => {

  let isIn;
  const callPage = () => {
    isIn = localStorage.getItem('isLoggedIn');
    return isIn;
  }
  
  React.useEffect(() => {
    callPage();
  },[callPage(), isIn]);

return (
  <BrowserRouter>
  { isIn ? <NavBar /> : <div></div>}
      <Routes>
        <Route path='/login' element={ <Login /> } />
        <Route exact path='/' element={ <Products /> } />
        <Route path='/categories' element={ <Categories /> } />
        <Route path='/customers' element={ <Customers /> } />
        <Route path='/orders' element={ <Orders /> } />
        <Route path='/orders/:id' element={ <OrderDetails /> } />
        <Route path='/categories/:id' element={ <CategoryDetails /> } />
      </Routes>
    </BrowserRouter>
);
};

export default App;