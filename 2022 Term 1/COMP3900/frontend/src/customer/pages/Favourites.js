import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import CartProduct from "../components/CartProduct"

/*
  This file shows a page including the NFTs an unser liked so far
*/
const Favourites = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [favItems, setFavItems] = useState([])

  let navigate = useNavigate()

  useEffect(() => {
    getLikedProducts()
    return () => {
      setFavItems([])
    }
  }, [])

    // Gets products from cart and rerenders cart container
    const getLikedProducts = async() => {
      const usersFromLocal = JSON.parse(localStorage.getItem("users"))
      const currUser = localStorage.getItem("currentUser")
      const favsArray = usersFromLocal[`${currUser}`]["favs"]
  
      const response = await fetch("/products/query/all")
      response.json().then(data => {
        const filteredItems = data.documents.filter(item => favsArray.includes(item.sku))
        setFavItems(filteredItems)
        // console.log(filteredItems)
        setIsLoaded(true)
      })
    }

  // Deletes a product from favs
  const onDelete = ( sku ) => {
    let usersFromLocal = JSON.parse(localStorage.getItem("users"))
    const currUser = localStorage.getItem("currentUser")
    const favsArray = usersFromLocal[`${currUser}`]["favs"]
    const modifiedFavs = favsArray.filter(item => item !== sku)
    usersFromLocal[`${currUser}`]["favs"] = modifiedFavs
    localStorage.setItem("users", JSON.stringify(usersFromLocal))
    getLikedProducts()
  }

  return (
    <div className="cart-items">
      <h3>Favourites</h3>
      <div className="fav-items-container">
        {!favItems.length && <p>No liked products yet</p>}
        {isLoaded && favItems.map((item, index) => 
          <CartProduct 
            key={index}
            item={favItems[index]} 
            onClick={() => {navigate("/product-detail/"+item.sku)}}
            onDelete={() => {onDelete(item.sku)}}
          />
        )}
      </div>
    </div>
  )
}

export default Favourites