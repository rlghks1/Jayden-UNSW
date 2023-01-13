import React, { useEffect, useState } from 'react'
import AdminProduct from "../components/AdminProduct"
import Button from "../../customer/components/Button"
import EditPane from "../components/EditPane"
import ItemPane from "../components/ItemPane"

/*
  This file shows categories including relating 'tags' on homepage
  If an user clicks a category it moves to the related products page 
*/
const Catalogue = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPane, setShowPane] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [focusItem, setFocusItem] = useState([]);
  const [currPage, setCurrPage] = useState(1) 
  const [allItems, setAllItems] = useState([])
  const [currItems, setCurrItems] = useState([]) // 50 on page

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
      const dataItems = data.documents.slice(0, 50)
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
      const products = allItems.slice(50*(newPage-1), 50*newPage)
      setCurrItems(products)
    } else if (direction === "next") {
      if (page === Math.ceil(allItems.length / 50)) {
        return
      }
      const newPage = currPage + 1
      setCurrPage(newPage)
      const products = allItems.slice(50*(newPage-1), 50*newPage)
      setCurrItems(products)
    }
  }
  
  const toggleItemPane = (item) => {
    if (!showPane) {
      setShowPane(true)
      setShowEdit(false)
    }
    else if (showPane && focusItem.sku === item.sku) {
      setShowPane(false)
    }
    setFocusItem(item)
  }

  const toggleEditPane = (item) => {
    showEdit ? setShowEdit(false) : setShowEdit(true)
    if (showEdit) {
      setShowEdit(false)
    } else if (!showEdit) {
      setShowPane(false)
      setShowEdit(true)
      setFocusItem(item)
    }
  }

  const onDelete = async(item) => {
    const reqObj = {}
    reqObj["sku"] = item.sku
    console.log(JSON.stringify(reqObj))

    const response = await fetch("/products/delete", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'},
      body: JSON.stringify(reqObj),
    })
    console.log(response)
    response.json().then(data => {
      console.log(data)
      if (data.Reason === "Successfully deleted product") {
        alert("Successfully deleted product")
      } else {
        alert("Something went wrong deleting product")
      }
    })
    getAllProducts()
  }

  return (
    <div className="catalogue-bg">
      <div className="catalogue-container">
        {isLoaded && currItems.map((item, index) => 
          <AdminProduct 
            key={index}
            item={currItems[index]} 
            onClick={() => toggleItemPane(currItems[index])}
            showPane={showPane}
            onEdit={() => toggleEditPane(currItems[index])}
            showEdit={showEdit}
            onDelete={() => onDelete(currItems[index])}
          />
        )}
        {showPane && <ItemPane item={focusItem}/>}
        {showEdit && <EditPane item={focusItem}/>}
      </div>
      <div className="catalogue-buttons">
        <div>
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
      </div>
    </div>
  )
}

export default Catalogue