import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from "../components/Button"
import ReservationProduct from "../components/ReservationProduct"

/*
  This file show a reservation list for a user
  The user can remove the reservations or purchase the items on this page
*/

const Reservation = () => {
  let navigate = useNavigate()
  const email = localStorage.getItem("currentEmail")
  const [ids, setIds] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [reservedInfos, setReservedInfos] = useState([])
  const [reservedItems, setReservedItems] = useState([])
  
  // update reservation db every 30 second
  useEffect(() => {
      const interval = setInterval(async() => {
      await fetch("/reservations/updateReservations", {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'},
          body: JSON.stringify(''),
        })
      }, 30000)
      return () => clearInterval(interval)
  },[])
  
  // get all reserved products and find the products this user reserved 
  useEffect(() => {
      getReservedProducts()
  }, [])

  async function getItemsBySku(item) {
      let reqOption = {
          method : "POST",
          headers : {
              "content-type" : "application/json",
          },
          body : JSON.stringify({
              "sku": item.sku
          })
      }
      const response = await fetch("/products/query", reqOption)
      response.json().then(data => {
          setReservedItems(reservedItems => [...reservedItems, data.document])
          setTotalPrice(totalPrice => totalPrice + parseInt(data.document.price) )
      })
  }
  const getReservedProducts = async() => {
      setTotalPrice(0)
      setReservedItems([])
      
      // check if there are products reserved by this user
      const response = await fetch("/reservations/getReservations")
      response.json().then(data => {
          const allItems = data.documents.filter(item => (item.email).includes(email))
          setReservedInfos(allItems)
          allItems.map((item) => setIds(ids => [...ids, item._id]))
          allItems.map((item) => getItemsBySku(item))
          setIsLoaded(true)
      })
  }

  // make order for reserved items
  // if 1) there are no reserved products
  const goCheckout = () => {
      if (reservedItems.length > 0) {
          navigate(`/checkout?reservation`,
          {state : {items: reservedItems,
                  from: "reservation", 
                  totalprice: totalPrice,
                  ids: ids}
          })
      } else {
          alert("There are no reserved products!")
      }
  }      

  // Deletes a product from reservation
  const onDelete = async( sku ) => {
    const removeItem = reservedInfos.filter(item => (item.sku).includes(sku))
    // console.log(removeItem[0])
    const response1 = await fetch("/reservations/removeReservation", {
      method: 'POST', headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        'sku': removeItem[0].sku,
        'reservationid': removeItem[0].reservationid})
    })        
    response1.json()
    
    const response2 = await fetch("/reservations/removeUserReservation", {
        method: 'POST', headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          'email': email,
          'reservationid': removeItem[0].reservationid})
    })
    response2.json()
    getReservedProducts()
  }

  return (
    <>
      <div className="cart-container">
        <div className="cart-items">
          <h3>Reservation</h3>
          <div className="cart-items-headings">
            <p>PRODUCT</p>
            <p>PRICE</p>
          </div>
          <div className="cart-items-container">
            {!reservedItems.length && <p>Your reservation is empty</p>}
            {isLoaded && reservedItems.map((item, index) => 
              <ReservationProduct 
                key={index}
                item={reservedItems[index]} 
                onClick={() => {navigate("/product-detail/"+item.sku)}}
                onDelete={() => {onDelete(item.sku)}}
              />
            )}
          </div>
          <div className="cart-items-headings">
            <p>Total: </p>
            <p>$ {totalPrice}</p>
          </div>
        </div>
      </div>
      <div className="checkout-pane">
        <img src={process.env.PUBLIC_URL+"/black-line.png"} alt=""/>
        <Button 
          type="flatwhite"
          text="Continue Shopping"
          onClick={()=>{navigate(`/`)}}
        />
        <Button 
          type="flat"
          text="Buy Reserved Products"
          onClick={() => {goCheckout()}}
        />
      </div>
    </>
  )
}

export default Reservation