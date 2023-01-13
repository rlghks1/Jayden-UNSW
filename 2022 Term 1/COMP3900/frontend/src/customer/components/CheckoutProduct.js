import React from 'react'
import { FaTrashAlt } from "react-icons/fa";

/* 
  This file shows an item in checkout process
  user cannot remove or go to product detail on this process
*/
const CartProduct = ( {item, onClick } ) => {
  return (
    <div className={"cart-product"}>
      <img 
        src={`${item.path ? process.env.PUBLIC_URL+"/dataset/"+item.path : process.env.PUBLIC_URL+"img-placeholder.jpg"}`} 
        alt=""
        onClick={onClick}
      />
      <span>
        <h4 onClick={onClick}>{item.name}</h4>
        {item.creator}
        {" / qty: " + item.quantity}
      </span>
      <div className="price">
        {"$"+item.price}
      </div>
    </div>
  )
}

export default CartProduct