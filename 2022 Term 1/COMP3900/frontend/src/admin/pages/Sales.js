import React, { useState, useEffect } from 'react'
import AdminOrder from "../components/AdminOrder"

/*
  This page shows total sales result from all orders
*/
const Sales = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([])

  useEffect(() => {
    getOrders()
    // calculateToday()
    return () => {
      setItems([])
    }
  }, [])

  const getOrders = async() => {
    const response = await fetch("http://localhost:3000/orders/getHistory",{
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'},
        body: {},
      })
    response.json().then(data => {
      console.log(data)
      setItems(data.documents)
      setIsLoaded(true)
    })
  }

  const calculateToday = () => {
    var ordersToday = 0
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, "0")
    let mm = String(today.getMonth() + 1).padStart(2, "0")
    let yyyy = today.getFullYear()
    today = yyyy + "-" + mm + "-" + dd
    for (const item of items) {
      if (item.date.slice(0, 10) === today) {
        ordersToday++
      }
    }
    return ordersToday
  }


  return (
    <div className="cart-items">
      <h3>Sales</h3>
      <div className="sales-data">
        <div className="sales-block">Orders Today: {calculateToday()}</div>
        <div className="sales-block">Total Orders: {items.length}</div>
      </div>
      <h3>Order History</h3>
      <div className="fav-items-container">
        {!items.length && <p>No  products yet</p>}
        {isLoaded && items.map((item, index) => 
          <AdminOrder 
            key={index}
            order={items[index]} 
            onClick={() => {console.log("Admins cannot view products")}}
          />
        )}
      </div>
    </div>
  )
}

export default Sales