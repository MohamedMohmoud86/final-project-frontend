import React, { useContext } from 'react'
import { CartContext } from '../../component/context/CartContext'
import PageTransition from '../../component/PageTransition'
import Product from '../../component/slideProduct/Product'
import './Favorites.css'





function Favorites() {

    const {Favorites} = useContext(CartContext)
  return (
    <PageTransition>
        <div className="category_products FavoritesPage">
            <div className="cotainer">
                <div className="top_slide">
                    <h2>Your Favorites :</h2>
                </div>

                {Favorites.length === 0 ? (
                   <p>No Favorites Product Yet </p>
                ) : (
                    <div className="myFav">
                        {Favorites.map(item => (
                            <Product item={item} key={item.id}/>
                            
                        ))}
                    </div>
                )}
            </div>
        </div>
    </PageTransition>
  )
}

export default Favorites