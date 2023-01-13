import React from 'react'
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

/*
  definition for products on admin page
*/
const AdminProduct = ( {item, onClick, showPane, onEdit, showEdit, onDelete} ) => {
  return (
    <div className={`admin-product ${showPane ? "small" : ""} ${showEdit ? "small" : ""}`} onClick={onClick}>
      <img 
        src={`${item.path ? process.env.PUBLIC_URL+"/dataset/"+item.path : process.env.PUBLIC_URL+"img-placeholder.jpg"}`} 
        alt=""
      />
      <span>
        {"SKU:"+item.sku}
        <h4>{item.name}</h4>
      </span>
      <div className="buttons">
        <FaRegEdit onClick={onEdit}/>
        {"   "}
        <FaTrashAlt onClick={onDelete}/>
      </div>
    </div>
  )
}

export default AdminProduct