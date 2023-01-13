import React, { useEffect, useState } from 'react' 
import { Link, useOutletContext } from 'react-router-dom'

const HomeMain = () => {
	
	const [top9Array,setTop9Array] = useState([]) 
	const [recc, setRecc] = useState([])    
  const loggedIn = useOutletContext() 

	useEffect(() => {
		const getTop9 = () => {
			let reqOption = {
				method : "POST",
				headers : {"content-type" : "application/json"},
        body : JSON.stringify({"amount": "9"})
			}
			fetch("/products/query/variable", reqOption)
			.then(res => res.json())
			.then(data => setTop9Array(data.documents))
		}

    const getRecc = async() => {
      const email = localStorage.getItem("currentEmail")
      if (email === null || email === "" ) {
        setRecc(top9Array.slice(0, 6))
        return
      }
		  console.log(JSON.stringify({email}))
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

    getTop9()
	  getRecc()
    return () => {
      setTop9Array([])
      setRecc([])
    }
	}, [loggedIn])

  return (
    <div className={"homeMain"}>
      <div className={"homeMain-container"}>
        <div className={"homeMain-gridBox box-one"}></div>
        <div className={`homeMain-gridBox box-two-1 ${loggedIn ? "" : "logged-out"}`}>Top 9 NFTs</div>
        <div className={`homeMain-gridBox box-two-2 ${loggedIn ? "" : "logged-out"}`}>
          {top9Array.map((item, index) => (
            <div key={index}>
              #{index+1}
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
        {loggedIn && <div className={"homeMain-gridBox box-three-1"}>
          <p>Recommended</p>
          <p>for you:</p>
        </div>}
        {loggedIn && <div className={"homeMain-gridBox box-three-2"}>
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
        </div>}
        <div className={"homeMain-gridBox box-four"}></div>
      </div>
    </div>
  )
}
export default HomeMain 
