import React from 'react'
import { useNavigate } from 'react-router-dom'

/* 
  This file includes definition for product item
*/
const Product = ( {item} ) => {
  let navigate = useNavigate()
  
  return (
    <div className="product">
      <img 
        src={`${item.path ? process.env.PUBLIC_URL+"/dataset/"+item.path : process.env.PUBLIC_URL+"img-placeholder.jpg"}`} 
        alt=""
        onClick={() => {navigate("/product-detail/"+item.sku)}} 
      />
      <div className="product-info">
        <h4 onClick={() => {navigate("/product-detail/"+item.sku)}}>{item.name}</h4>
        {!(item.quantity === 0) && <span>{"$"+item.price}</span>}
        {(item.quantity === 0) && <span>Sold Out</span>}
      </div>
    </div>
  )
}

export default Product