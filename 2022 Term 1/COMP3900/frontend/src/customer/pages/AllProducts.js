import React, { useState, useEffect } from 'react'
import Button from "../components/Button"
import Product from "../components/Product"

/*
  This page shows all products in the website 
*/
const AllProducts = () => {

  const [allItems, setAllItems] = useState([])
  const [currItems, setCurrItems] = useState([]) 
  const [currPage, setCurrPage] = useState(1) 
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getAllProducts()
    return () => {
      setAllItems([])
      setCurrItems([])
    } 
  }, [])

  const getAllProducts = async() => {
    const response = await fetch("/products/query/all")
    response.json().then(data => {
      const allDataItems = data.documents
      setAllItems(allDataItems)
      const dataItems = data.documents.slice(0,48)
      setCurrItems(dataItems)
      setIsLoaded(true)
    })
  }

  const getProdPage = (page, direction) => {
    if (direction === "prev") {
      if (page === 1) {
        return
      }
      const newPage = currPage - 1
      setCurrPage(newPage)
      const products = allItems.slice(48*(newPage-1), 48*newPage)
      setCurrItems(products)
    } else if (direction === "next") {
      if (page === Math.ceil(allItems.length / 48)) {
        return
      }
      const newPage = currPage + 1
      setCurrPage(newPage)
      const products = allItems.slice(48*(newPage-1), 48*newPage)
      setCurrItems(products)
    }
  }

  return (
    <>
      {isLoaded && <div className="product-container">
        {currItems.map((item, index) => 
          <Product 
            key={index}
            item={currItems[index]} 
          />
        )}
      </div>}
      <div className="product-page-buttons">
        <Button 
          type="text"
          text="< PREV"
          onClick={() => {getProdPage(currPage, "prev")}}
        />
        <Button 
          type="text"
          text="NEXT >"
          onClick={() => {getProdPage(currPage, "next")}}
        />
      </div>
    </>
  )
}

export default AllProducts