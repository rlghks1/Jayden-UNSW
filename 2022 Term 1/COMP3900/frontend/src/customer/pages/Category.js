import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import Product from '../components/Product'

/*
  This file shows categories including relating 'tags' on homepage
  If an user clicks a category it moves to the related products page 
*/
const Category = () => {

  const [allItems, setAllItems] = useState([])
  const [currItems, setCurrItems] = useState([])
  const [currPage, setCurrPage] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false);

  let {type} = useParams()

  useEffect(() => {
    const humanTags = ["Human", "Human anatomy", "Human body", "Hair"]
    const animalTags = ["Birds", "Insect", "Whiskers", "Mythical creature"]
    const natureTags = ["Nature", "Natural environment", "Natural landscape", "Sky"]
    const abstractTags = ["Pattern", "Visual arts"]

    const getCategories = () => {
      if (type === "human") {
        return humanTags
      } else if (type === "animal") {
        return animalTags
      } else if (type === "nature") {
        return natureTags
      } else if (type === "abstract") {
        return abstractTags
      }
    }

    const getAllProducts = async() => {
      const response = await fetch("/products/query/all")
      response.json().then(data => {
        const allDataItems = data.documents
        // Keep items if matching tags
        const filteredArray = allDataItems.filter(item => {
          // Process strings into arrays
          const withoutFirstAndLast = item.tags.slice(1, -1);
          const noSpaces = withoutFirstAndLast.replace(/ /g, '')
          const noApostrophes = noSpaces.replace(/'/g, '')
          const tagArray = noApostrophes.split(',')
          // console.log(tagArray)
          // compare tagArray and getCategories array
          for (const tag of tagArray) {
            if (getCategories().includes(tag)) {
              return true
            }
          }
          return false
        })
        const dataItems = filteredArray.slice(0,48)
        setAllItems(filteredArray)
        setCurrItems(dataItems)
        setIsLoaded(true)
      })
    }
    getAllProducts()
    return () => {
      setAllItems([])
      setCurrItems([])
    } 
  }, [type])

  const getProdPage = (page, direction) => {
    console.log("clicked")
    if (direction === "prev") {
      if (page === 1) {
        alert("This is the first page")
        return
      }
      const newPage = currPage - 1
      setCurrPage(newPage)
      const products = allItems.slice(48*(newPage-1), 48*newPage)
      setCurrItems(products)
    } else if (direction === "next") {
      if (page === Math.ceil(allItems.length / 48)) {
        alert("This is the last page")
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

export default Category