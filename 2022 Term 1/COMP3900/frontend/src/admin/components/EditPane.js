import React, { useState } from 'react'
import Button from "../../customer/components/Button"

/* 
  This file shows product edit page for admin
  admin can edit all product's information on this page
*/
const EditPane = ({ item }) => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [creator, setCreator] = useState("")
  const [tags, setTags] = useState("")

  const onEdit = async() => {
    console.log("ONEDIT")
    console.log(name)
    console.log(price)
    console.log(creator)
    console.log(tags)
    // make request to API
    var JSONobject = {}
    JSONobject["sku"] = item.sku
    if (name !== "") {
      JSONobject["name"] = name
    }
    if (price !== "") {
      JSONobject["price"] = price
    }
    if (creator !== "") {
      JSONobject["creator"] = creator
    }
    if (tags !== "") {
      JSONobject["tags"] = tags
    }
    console.log(JSON.stringify(JSONobject))

    const response = await fetch("/products/update", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'},
      body: JSON.stringify(JSONobject),
    })
    console.log(response)
    response.json().then(data => {
      console.log(data)
      if (data.Reason === "Successfully updated product") {
        alert("Successfully updated product")
      } else {
        alert("Something went wrong updating product")
      }
    })
  } 

  return (
    <div className="item-pane-wrapper">
      <div className="item-pane">
        <div className="item-pane-details">
          <h4>Edit product details for SKU: {item.sku}</h4>
          <h5>Note: All input fields are optional</h5>
        </div>
        <div className="edit-form">
          <p>Name</p>
          <input 
            type="text" 
            placeholder={item.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p>Price</p>
          <input 
            type="text" 
            placeholder={item.price}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <p>Creator</p>
          <input 
            type="text" 
            placeholder={item.creator}
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />
          <p>Tags</p>
          <input 
            type="text" 
            placeholder={item.tags}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Button 
            type="flat"
            text="Submit"
            onClick={() => onEdit()}
          />
        </div>
      </div>
    </div>
  )
}

export default EditPane