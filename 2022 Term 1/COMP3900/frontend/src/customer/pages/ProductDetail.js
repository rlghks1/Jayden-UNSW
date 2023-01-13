import React, { useEffect, useState } from 'react' 
import { useParams } from 'react-router-dom'
import Button from "../components/Button"
import { FaHeart } from "react-icons/fa" 
import { Link } from 'react-router-dom'

/*
  This file show a product's detail including name, creator and price
  Users can put the item in the cart or make a reservation
*/

const ProductDetail = () => {
  let {sku} = useParams()

  const [recc, setRecc] = useState([])    
  const [product, setProduct] = useState([])
  const [isLoaded, setIsLoaded] = useState(false) 
  const [isReserved, setIsReserved] = useState(false) 
  const [isSoldOut, setIsSoldOut] = useState(false) 
  
  const [liked, setLiked] = useState(() => {
    // get default value from localstorage 
    let usersFromLocal = JSON.parse(localStorage.getItem("users"))
    const currUser = localStorage.getItem("currentUser")
    if (currUser === null || currUser === "") {
      return false
    }
    const favsArray = usersFromLocal[`${currUser}`]["favs"]
    if (favsArray.includes(sku)) {
      return true
    } else {
      return false 
    }
  })

  useEffect(() => {
    const getProduct = async() => {
      const response = await fetch("/products/query", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'},
        body: JSON.stringify({ sku }),
      })
      response.json().then(data => {
        if(data.document.quantity === 0) {
          setIsSoldOut(true)
        }
        setProduct(data.document)
      })
    }

    const checkIfReserved = async() => {
      const response1 = await fetch("/reservations/getReservations")
      response1.json().then(data => {
        const alreadyReserved = data.documents.filter(item => (item.sku).includes(sku))
        if (alreadyReserved.length === 1) {
          setIsReserved(true)
          return
        }
      })
    }

    const getRecc = async() => {
      const email = localStorage.getItem("currentEmail")
      // If not logged in, just return top 9
      if (email === null || email === "" ) {
        const response = await fetch("/products/query/variable", {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'},
            body : JSON.stringify({"amount": "9"})
        })
        response.json().then(data => {
          setRecc(data.documents.slice(0,6))
        })
        return
      }
      // If logged in, return user recommendations
      const response = await fetch("/users/get_data", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      })
      response.json().then(data => {
        if (data.Reason === "VALID EMAIL") {
          const recommendedProducts = data.user_data.document.recommendations.slice(0, 6)
          setRecc(recommendedProducts)
        }
      })
  	}

    getProduct()
    setIsLoaded(true)
    checkIfReserved()
    getRecc()
    return () => {
      setProduct([])
    } 
  }, [sku])

  // Reserves this item if it is available
  // If:  1) the item is already reserved by this user or other users
  //      2) the item is already sold
  //      3) the user didn't log in his account
  // then the user cannot reserve this item
  const addToReservation = async() => {
    const email = localStorage.getItem("currentEmail")
    // Check if the user already logged in
    if (email === "") {
      alert("You need to login to make a reservation")
      return
    }
    // Check if the product is already sold
    if (product.quantity < 1) {
      alert("This product has already been sold")
      return 
    }
    
    // If available, make reservation
    if (isReserved) {
      alert("This product is already reserved!")
    } else {
      console.log('hello')
      let reqOption = {
        method : "POST",
        headers : {"content-type" : "application/json",},
        body : JSON.stringify({"email": email, "sku": product.sku})
      }
      const response = await fetch('/reservations/makeReservation', reqOption)
      response.json().then(data => {
        console.log(data)
        if (data.Reason === "Unsuccessful reservation") {
          alert("Reservation failed")
        } else {
          alert("Reservation success")
        }
      })
    }
  }

  // Add this item to cart page
  const addToCart = () => {
    // Check if user is logged in
    const currUser = localStorage.getItem("currentUser")
    if (currUser === null || currUser === "") {
      alert("Log in to add to cart")
      return
    }
    // Check if cart already contains product
    const usersFromLocal = JSON.parse(localStorage.getItem("users"))
    if (usersFromLocal[`${currUser}`]["cart"].includes(sku)) {
      return
    }
    // Add product to cart
    let modifiedUsers = usersFromLocal
    modifiedUsers[`${currUser}`]["cart"].push(sku)
    localStorage.setItem("users", JSON.stringify(modifiedUsers))
    alert("Product added to cart")
  }

  // Like this item 
  const toggleLike = () => {
    // Check if user is logged in
    const currUser = localStorage.getItem("currentUser")
    if (currUser === null || currUser === "") {
      alert("Log in to like products")
      return
    }
    
    if (!liked) {
      // Check if favs already contains product
      const usersFromLocal = JSON.parse(localStorage.getItem("users"))
      if (usersFromLocal[`${currUser}`]["favs"].includes(sku)) {
        return
      }
      // Add product to favs
      let modifiedUsers = usersFromLocal
      modifiedUsers[`${currUser}`]["favs"].push(sku)
      localStorage.setItem("users", JSON.stringify(modifiedUsers))
      setLiked(true)
      alert("Product liked")
    } else if (liked) {
      // remove sku from favs in localstorage and rerender
      let usersFromLocal = JSON.parse(localStorage.getItem("users"))
      const currUser = localStorage.getItem("currentUser")
      const favsArray = usersFromLocal[`${currUser}`]["favs"]
      const modifiedFavs = favsArray.filter(item => item !== sku)
      usersFromLocal[`${currUser}`]["favs"] = modifiedFavs
      localStorage.setItem("users", JSON.stringify(usersFromLocal))
      setLiked(false)
      alert("Product un-liked")
    }
  }

  return (
    <>
      <div className="detail-container">
        {isLoaded && <img src={process.env.PUBLIC_URL+"/dataset/"+product.path} alt="" />}
        <div className="detail-text">
          <div className="detail-text-top">
            <div className="detail-text-top-left">
              <h3>{product.name}</h3>
              <p>{"Creator: "}<i>{product.creator}</i></p>
              <p>{"$"+product.price}</p>
            </div>
            <div className="detail-text-top-right">
              <Button 
                type={`icon ${liked ? "liked" : ""}`}
                text={<FaHeart/>}
                onClick={toggleLike}
              />
              <p>{product.likes+liked}</p>
            </div>
          </div>
          <div className="detail-text-bottom">
            {!isSoldOut && <Button 
              type="flat"
              text="ADD TO CART"
              onClick={addToCart}
            />}
            {isSoldOut && <Button 
              type="sold"
              text="SOLD OUT"
            />}
            <Button 
              type="flatwhite"
              text="Make Reservation"
              onClick={addToReservation}
            />
          </div>
        </div>
      </div>
      <div className="detail-rec">Recommendation</div>
      <div className="detail-recs">
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
              <img src={process.env.PUBLIC_URL+"/dataset/"+item.path} alt={item.name}/>
            </Link>
					</div>
				))}
      </div>
      <div className="detail-recItems">
        
      </div>
    </>
  ) 
}
export default ProductDetail 
