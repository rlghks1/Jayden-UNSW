import React from 'react'

/* 
  This file includes item definition for admin page
*/
const ItemPane = ({ item }) => {
  return (
    <div className="item-pane-wrapper">
      <div className="item-pane">
        <img 
          src={`${item.path ? process.env.PUBLIC_URL+"/dataset/"+item.path : process.env.PUBLIC_URL+"img-placeholder.jpg"}`} 
          alt=""
        />
        <div className="item-pane-details">
          <h4>Product Details:</h4>
          <p><b>Name:</b> {item.name}</p>
          <p><b>Creator:</b> {item.creator}</p>
          <p><b>SKU:</b> {item.sku}</p>
          <p><b>Tags:</b><br/></p>
          <p className="tab">{item.tags}</p>
          <p><b>Favourites:</b> {item.likes}</p>
          <p><b>Price:</b> {"$"+item.price}</p>
        </div>
      </div>
    </div>
  )
}

export default ItemPane