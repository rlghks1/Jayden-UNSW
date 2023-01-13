import React from 'react'
import { FaTrashAlt } from "react-icons/fa";

const OrderProduct = ( {item, onClick, onDelete } ) => {
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

export default OrderProduct