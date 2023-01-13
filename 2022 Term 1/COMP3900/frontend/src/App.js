import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OrderHistory from "./customer/pages/OrderHistory"
import ProductDetail from "./customer/pages/ProductDetail"
import Favourites from "./customer/pages/Favourites"
import HomeMain from "./customer/pages/HomeMain"
import PassReset from "./customer/pages/PassReset"
import RequestPassReset from "./customer/pages/RequestPassReset"
import Search from "./customer/pages/Search"
import Category from "./customer/pages/Category"
import Reservation from "./customer/pages/Reservation"
import Checkout from "./customer/pages/Checkout"
import AllProducts from "./customer/pages/AllProducts"
import Cart from "./customer/pages/Cart"
import ErrorPage from "./customer/pages/ErrorPage"
import Customer from "./customer/pages/Customer"
import Sales from "./admin/pages/Sales"
import Admin from "./admin/pages/Admin"
import Catalogue from "./admin/pages/Catalogue"
import ControlPage from "./admin/pages/ControlPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Customer />}>
          <Route index element ={<HomeMain />} />
          <Route path="/homescreen" element={<HomeMain />}/>
          <Route path="/all" element={<AllProducts />}/>
          <Route path="/cart" element={<Cart />}/>
          <Route path="/category/:type" element={<Category />}/>
          <Route path="/checkout" element={<Checkout />}/>
          <Route path="/checkout/:step" element={<Checkout />}/>
          <Route path="/reservation" element={<Reservation />}/>
          <Route path="/favourites" element={<Favourites />}/>
          <Route path="/search" element={<Search />}/>
          <Route path="/search/:searchWord" element={<Search />}/>
          <Route path="/forgotpassword" element={<RequestPassReset />}/>
          <Route path="/changepassword" element={<PassReset />}/>
          <Route path="/product-detail" element={<ProductDetail />}/>
          <Route path="/product-detail/:sku" element={<ProductDetail />}/>
          <Route path="/order-history" element={<OrderHistory />}/>
        </Route>
        <Route path="admin" element={<Admin />}>
          <Route index element ={<ControlPage />} />
          <Route path="control-page" element={<ControlPage />}/>
          <Route path="catalogue" element={<Catalogue />}/>
          <Route path="sales" element={<Sales />}/>
        </Route>
        <Route path="*" element={<ErrorPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
