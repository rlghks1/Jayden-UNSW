import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import CartProduct from "../components/CartProduct"
import { Link } from 'react-router-dom'

/*
  This file shows cart page for a user.
  User can remove products and go to checkout page from this page 
*/
const Cart = () => {
  const [recc, setRecc] = useState([]);   
	const [isLoaded, setIsLoaded] = useState(false);
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    getAllProducts()
    getRecc()
    return () => {
      setCartItems([])
    }
  }, [])

  // Gets products from cart and re-renders cart container
  const getAllProducts = async() => {
    setTotalPrice(0)
    setCartItems([])

    const usersFromLocal = JSON.parse(localStorage.getItem("users"))
    const currUser = localStorage.getItem("currentUser")
    const cartArray = usersFromLocal[`${currUser}`]["cart"]

    const response = await fetch("/products/query/all")
    response.json().then(data => {
      const filteredItems = data.documents.filter(item => cartArray.includes(item.sku))
      setCartItems(filteredItems)
      console.log(data)
      setIsLoaded(true)
      for (const item of filteredItems) {
        setTotalPrice(totalPrice => totalPrice + parseInt(item.price))
      }
    })
  }

  const goCheckout = () => {
    console.log(cartItems)
    if (cartItems.length > 0) {
      navigate(`/checkout?cart`,
      {state : {items: cartItems, 
                from: "cart",
                totalprice: totalPrice}
      })
    } else {
      alert("cart is empty!")
    }
  }  

  const onDelete = ( sku ) => {
    let usersFromLocal = JSON.parse(localStorage.getItem("users"))
    const currUser = localStorage.getItem("currentUser")
    const cartArray = usersFromLocal[`${currUser}`]["cart"]
    // remove sku from currUser's cart array
    const modifiedCart = cartArray.filter(item => item !== sku)
    // replace original cart array with modified
    usersFromLocal[`${currUser}`]["cart"] = modifiedCart
    // update localStorage and rerender
    localStorage.setItem("users", JSON.stringify(usersFromLocal))
    getAllProducts()
  }

  const getRecc = async() => {
    const email = localStorage.getItem("currentEmail")
    console.log(JSON.stringify({email}))
    const response = await fetch("/users/get_data", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'},
      body: JSON.stringify({email}),
    })
    response.json().then(data => {
      if (data.Reason === "VALID EMAIL") {
        console.log(data)
        const recommendedProducts = data.user_data.document.recommendations.slice(0, 4)
        setRecc(recommendedProducts)
      }
    })
  }

  let navigate = useNavigate()

  return (
    <>
      <div className="cart-container">
        <div className="cart-items">
          <h3>Cart</h3>
          <div className="cart-items-headings">
            <p>PRODUCT</p>
            <p>PRICE</p>
          </div>
          <div className="cart-items-container">
            {!cartItems.length && <p>Your cart is empty</p>}
            {isLoaded && cartItems.map((item, index) => 
              <CartProduct 
                key={index}
                item={cartItems[index]} 
                onClick={() => {navigate("/product-detail/"+item.sku)}}
                onDelete={() => {onDelete(item.sku)}}
              />
            )}
          </div>
        </div>
        <div className="cart-recs">
          <h3>Top picks for you</h3>
          <div className="cart-recs-container">
          {recc.map((item, index) => (
						<div key={index}>
							<Link 
								to={"/product-detail/" + item.sku}
								state= {{
									path: item.path,
									sku: item.sku,
									likes: item.likes,
									name: item.name,
									creator: item.creator,
									price: item.price
								}}>    
								<img src={"dataset/"+item.path} alt={item.name}/>
							</Link>
						</div>
					))}
          </div>
        </div>
      </div>
      <div className="checkout-pane">
        <img src={process.env.PUBLIC_URL+"/black-line.png"} alt=""/>
        <p>CART TOTAL</p>
        <h3>${totalPrice}</h3>
          <Button 
            type="flat"
            text="CHECKOUT"
            onClick={() => {goCheckout()}}
          />
          <Button 
            type="flatwhite"
            text="Continue shopping"
            onClick={()=>{navigate("/")}}
          />
      </div>
    </>
  )
}

export default Cart