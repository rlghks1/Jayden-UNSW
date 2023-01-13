import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import OrderProduct from "../../customer/components/OrderProduct"

const AdminOrder = ( { order } ) => {
  const [showExpanded, setShowExpanded] = useState(false)
  const [orderItems, setOrderItems] = useState([])

  let navigate = useNavigate()

  const expandProducts = () => {
    if(showExpanded) {
      setShowExpanded(false)
      return
    }
    if(!showExpanded) {
      getOrderProducts()
      setShowExpanded(true)
    }
  }

  const getOrderProducts = async() => {
    const response = await fetch("/products/query/all")
    response.json().then(data => {
      const dataItems = data.documents.filter(dataItem => order.products.includes(dataItem.sku))
      console.log(dataItems)
      setOrderItems(dataItems)
    })
  }

  const onClick = ( sku ) => {
    if (window.location.pathname === "/admin/sales") {
      return
    } else {
      navigate("/product-detail/"+sku)
    }
  }

  return (
    <>
      <div className={`order-product admin`} onClick={()=>expandProducts()}>
        <div className="left-details">
          <p><b>Order ID: {order.orderno}</b></p>
          <b>Customer: </b>{order.buyer}
          <p><b>Date: </b>{order.date.slice(0, 10)}</p>
          <b>Items: </b>{order.quantity}
        </div>
        <div className="price">
          <b>Total: </b>${order.cost}
        </div>
      </div>
      {showExpanded && <div className={"expanded-order"}>
        {orderItems.map((product, index) => 
          <OrderProduct
            key={index}
            item={orderItems[index]} 
            onClick={() => {onClick(product.sku)}}
          />
        )} 
      </div>}
    </>
  )
}

export default AdminOrder