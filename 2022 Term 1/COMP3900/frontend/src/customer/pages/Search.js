import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import Button from "../components/Button"
import Product from "../components/Product"
import * as JsSearch from 'js-search'
import SearchDropdown from '../components/SearchDropdown'
import { FiChevronDown } from "react-icons/fi";

const Left = styled.div`
flex: 1;
display: flex;
justify-content: flex-start;
align-items: center;
padding-left: 10px;
`

const Right = styled.div`
flex: 1;
display: flex;
justify-content: flex-end;
align-items: center;
padding-right: 20px;
`
/*
  This page shows the search result on search bar.
  An user can search the items by name, creator and tags.
  User can also sort the results by alphabet order, likes and lowest price 
*/
const Search = () => {
  let location = useLocation();
  let searchQuery = location.state.query
  
  const [currPage, setCurrPage] = useState(1) // which page
  const [isLoaded, setIsLoaded] = useState(false);
  const [allItems, setAllItems] = useState([])
  const [currItems, setCurrItems] = useState([]) // 48 on page
  const [sortedItems, setSortedItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [showDropdown, setShowDropdown] = useState(false);
  
  // sort by - likes / name / lowest price
  const onSbl = () => {
    const sortedResult = filteredItems.sort((a,b) => (a.likes > b.likes ? 1 : -1))
    setFilteredItems([...sortedResult])
  }
  const onSbn = () => {
    const sortedResult = filteredItems.sort((a,b) => (a.name > b.name ? 1 : -1))
    setFilteredItems([...sortedResult])
  }
  const onSblp = () => {
    const sortedResult = filteredItems.sort((a,b) => (parseInt(a.price) > parseInt(b.price) ? 1 : -1))
    setFilteredItems([...sortedResult])
  }

  // get all items in product list in backend
  useEffect(() => {
    const getAllProducts = async() => {
      const response = await fetch("/products/query/all")
      response.json().then(data => {
        const item = data.documents
        setAllItems(item)
      })  
    }
    getAllProducts()
  }, [searchQuery])
  
  // search items from all Items by 'name'/'creator'/'tags'
  useEffect(() => {
    var search;
    search = new JsSearch.Search('cid');
    search.addIndex('name')
    search.addIndex('creator')
    search.addIndex('tags')

    function searchItems(items) {
      search.addDocuments(items);
      let result = search.search(searchQuery)
      setFilteredItems(result)
    }
    const getFilteredProducts = async() => {
      searchItems(allItems)
    }
    getFilteredProducts()
  }, [searchQuery, allItems])
  
  // set sorted result from search result
  useEffect(() => {
    const setSortedProducts = async() => {
      setSortedItems(filteredItems)
    }
    setSortedProducts()
  }, [filteredItems])

  // set current items to break the pages
  useEffect(() => {
    const setCurProducts = async() => {
      const dataItems = sortedItems.slice(0,48)
      //console.log(dataItems)
      setCurrItems(dataItems)
      setIsLoaded(true)
    }
    setCurProducts()
    // console.log(filteredItems)
  }, [sortedItems])

  // break the pages and one page includes maximum 48 NFTs
  const getProdPage = (page, direction) => {
    if (direction === "prev") {
      if (page === 1) {
        return
      }
      const newPage = currPage - 1
      setCurrPage(newPage)
      // console.log(newPage)
      const products = filteredItems.slice(48*(newPage-1), 48*newPage)
      // console.log(products)
      setCurrItems(products)
    } else if (direction === "next") {
      if (page === Math.ceil(filteredItems.length / 48)) {
        return
      }
      const newPage = currPage + 1
      setCurrPage(newPage)
      // console.log(newPage)
      const products = filteredItems.slice(48*(newPage-1), 48*newPage)
      // console.log(products)
      setCurrItems(products)
    }
  }

  return (
    <>
      <div className={"search-helper"}>
        <Left>
          {<div className={"search-result"}>About '{filteredItems.length}' results
          </div>}
        </Left>
        <Right>
          <Button
            type="text"
            text="Sort By"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          <Button
            type="text"
            text={<FiChevronDown/>}
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && <SearchDropdown 
            onSbl={onSbl}
            onSbn={onSbn}
            onSblp={onSblp}
          />}
        </Right>
      </div>
      {isLoaded && 
      <div className="product-container">
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

export default Search