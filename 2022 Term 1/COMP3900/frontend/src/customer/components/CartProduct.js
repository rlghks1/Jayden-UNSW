import React from 'react'
import { FaTrashAlt } from "react-icons/fa";

/* 
  This file shows an item in cart
  If user clicks remove button on this item,
  the item is removed from cart
*/
const CartProduct = ( {item, onClick, onDelete } ) => {
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
      <div className="buttons">
        <FaTrashAlt onClick={onDelete}/>
      </div>
    </div>
  )
}

export default CartProduct