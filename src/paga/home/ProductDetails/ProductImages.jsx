import React from 'react'

function ProductImages({ product }) {
 
  const defaultBigImg = product?.images && product.images.length > 0 
    ? product.images[0] 
    : (product?.thumbnail || "https://via.placeholder.com/150");

  return (
    <div className='imgs_item'>
   
      <div className='big_img'>
        <img id='big_img' src={defaultBigImg} alt={product?.title || 'product'} />
      </div>

    
      <div className='sm_img'>
        {product?.images && product.images.length > 0 ? (
         
          product.images.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={product?.title} 
              onClick={() => document.getElementById("big_img").src = img} 
            />
          ))
        ) : (
          
          product?.thumbnail && (
            <img 
              src={product.thumbnail} 
              alt={product?.title} 
              onClick={() => document.getElementById("big_img").src = product.thumbnail} 
            />
          )
        )}
      </div>
    </div>
  )
}

export default ProductImages;