import React, { useState } from 'react'
import Button from "../components/Button"
import { useNavigate, useLocation } from "react-router-dom"
import CheckoutProduct from "../components/CheckoutProduct"


/*
  This file shows checkout page for users
  users can buy items in cart or reservation in this page
*/
const Checkout = () => {
  let navigate = useNavigate()
  let location = useLocation() 
  const cartItems = location.state.items
  const reservedItems = location.state.items
  const from = location.state.from
  const totalPrice = location.state.totalprice
  const [isPurchasable, setIsPurchasable] = useState(true)

  const email = localStorage.getItem("currentEmail")
  const date = new Date()

  // reservation check and then make a new order history
  const reservation_check = async() => {
    
    for (const item of reservedItems) {
      if (item.quantity === 0) {
        alert("product "+ item.name + "is already sold")
        setIsPurchasable(false)
        return
      }
    }
      if (isPurchasable) {
        const skus = [...new Set(reservedItems.map((item) => item.sku))]
        // console.log(skus)
        let reqOption = {
          method : "POST",
          headers : {
            "content-type" : "application/json",
          },
          body : JSON.stringify({
            "products": skus,
            "buyer":email,
            "cost":totalPrice,
            "date":date,
            "quantity":reservedItems.length
          })
        }
        const response = await fetch("/orders/newPurchase", reqOption)
        response.json().then(data => console.log(data))
        alert("Purchase Success!")
    }
  }

  async function cart_checkout() {
    console.log("0")
    // check if some items are sold
    for (const item of cartItems) {
      if (item.quantity === 0) {
        alert("Some items are already sold")
        isPurchasable(false)
        return
      }
      if (item.reservable === false) {
        alert("product '"+ item.name + "' is already reserved")
        isPurchasable(false)
        return
      }
    }
      if (isPurchasable) {
        console.log("1")
        // check if some items are reserved by other users
        const skus = [...new Set(cartItems.map((item) => item.sku))]

        let reqOption = {
          method : "POST",
          headers : {
            "content-type" : "application/json",
          },
          body : JSON.stringify({
            "products": skus,
            "buyer":email,
            "cost":totalPrice,
            "date":date,
            "quantity":cartItems.length
          })
        }  
        const response = await fetch("/orders/newPurchase", reqOption)
        response.json().then(data => {
          console.log(data)
        })
        alert("Purchase Success")
      }
    

    // NEED TO REMOVE CART ITEMS FROM CART AND NAVIGATE TO HOME
    let usersFromLocal = JSON.parse(localStorage.getItem("users"))
    const currUser = localStorage.getItem("currentUser")
    usersFromLocal[`${currUser}`]["cart"] = []
    localStorage.setItem("users", JSON.stringify(usersFromLocal))
    navigate("/")
  }

/*
need to check if the checkout from cart or reservation
            + quantity + already reserved
*/
  if (from === "cart") {
    return (
      <>
        <div className="checkout-container">
          <div className="checkout-items">
            <h3>Order Summary</h3>
            <div className="checkout-items-headings">
              <p>PRODUCT</p>
              <p>PRICE</p>
            </div>
            <div className="checkout-items-container">
              {cartItems.map((item, index) => 
                <CheckoutProduct 
                  key={index}
                  item={cartItems[index]} 
                />
              )}
            </div>
            <div className="checkout-items-price">
              <p>TOTAL : </p>
              <p>$ {totalPrice}</p>
            </div>
          </div>
        </div>
        <div className="payment-pane">
          <img src={process.env.PUBLIC_URL+"/black-line.png"} alt=""/>
          <Button 
            type="flat"
            text="Complete the order"
            onClick={() => {cart_checkout()
                            navigate("/")}}
          />
          <Button 
            type="flatwhite"
            text="Return to cart"
            onClick={() => {navigate(`/cart`)}}
          />
        </div>
      </>
    )
  } else if (from === "reservation") {  
    return (
      <>
        <div className="checkout-container">
          <div className="checkout-items">
            <h3>Order Summary</h3>
            <div className="checkout-items-headings">
              <p>PRODUCT</p>
              <p>PRICE</p>
            </div>
            <div className="checkout-items-container">
              {cartItems.map((item, index) => 
                <CheckoutProduct 
                  key={index}
                  item={reservedItems[index]} 
                />
              )}
            </div>
            <div className="checkout-items-price">
              <p>TOTAL : </p>
              <p>$ {totalPrice}</p>
            </div>
          </div>
        </div>
        <div className="payment-pane">
          <img src={process.env.PUBLIC_URL+"/black-line.png"} alt=""/>
          <Button 
            type="flat"
            text="Buy reserved items"
            onClick={() => {reservation_check()
                            navigate("/")}}
          />
          <Button 
            type="flatwhite"
            text="Return to reservation"
            onClick={() => {navigate(`/reservation`)}}
          />
        </div>
      </>
    )  
  }
}
export default Checkout