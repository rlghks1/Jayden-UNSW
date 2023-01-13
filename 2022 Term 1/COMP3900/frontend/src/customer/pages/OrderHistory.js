import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Order from "../components/Order"

/*
  This file includes all order details from an specific user
*/
const OrderHistory = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([])

  let navigate = useNavigate()

  useEffect(() => {
    getOrders()
  }, [])

  const getOrders = async() => {
    const currEmail = localStorage.getItem("currentEmail")
    const response = await fetch("orders/getHistory",{
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'},
        body: {},
      })
    response.json().then(data => {
      console.log(data)
      const filteredItems = data.documents.filter(order => order.buyer === currEmail)
      console.log(filteredItems)
      setItems(filteredItems)
      setIsLoaded(true)
    })
  }

  return (
    <div className="cart-items">
      <h3>Order History</h3>
      <div className="fav-items-container">
        {!items.length && <p>No liked products yet</p>}
        {isLoaded && items.map((item, index) => 
          <Order 
            key={index}
            order={items[index]} 
            onClick={() => {navigate("/product-detail/"+item.sku)}}
          />
        )}
      </div>
    </div>
  )
}

export default OrderHistory