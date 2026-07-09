import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import './productdetails.css'

import SlideProduct from '../../../component/slideProduct/SlideProduct';
import ProaductDetailsLoading from './ProaductDetailsLoading';
import SlideProductLoading from '../../../component/slideProduct/SlideProductLoading';
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';
import PageTransition from '../../../component/PageTransition';


function ProductDetails() {


    const { id } = useParams()
    

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    const [relatedProducts, setRelatedProducts] = useState([])
    const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(true)


  useEffect(() => {
  const getProductDetail = async () => {
    try {
      setLoading(true);
      let res;
      let data;

      
      if (id.length > 10) {
        res = await fetch(`https://final-project-production-3b18.up.railway.app/api/products/${id}`);
        data = await res.json();
      } else {
        
        res = await fetch(`https://dummyjson.com/products/${id}`);
        data = await res.json();
      }

      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  getProductDetail();
}, [id]);


    useEffect(() => {
        if (!product) return;
        fetch(`https://dummyjson.com/products/category/${product.category}`)
            .then((res) => res.json())
            .then((data) => {
                setRelatedProducts(data.products);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoadingRelatedProducts(false));

    }, [product?.category]);




    if (!product) return <p>Product Not Found</p>;

    return (



     <PageTransition key={id}>

           <div>
            {loading ? (
                <ProaductDetailsLoading />
            ) : (
                <div className='item_details'>
                    <div className='container'>

                        <ProductImages product={product} />

                        <ProductInfo product={product} />
                    </div>

                </div>
            )}




            {loadingRelatedProducts ? (
                <SlideProductLoading />
            ) : (
                <SlideProduct key={product.category} data={relatedProducts} title={product.category.replace("_", " ")} />
            )}




        </div>
     </PageTransition>
    );
}


export default ProductDetails