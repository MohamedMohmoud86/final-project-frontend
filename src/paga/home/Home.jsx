import React, { useEffect, useState } from 'react';
import HeroSlider from '../../component/HeroSlider';
import SlideProduct from '../../component/slideProduct/SlideProduct';
import './home.css';
import SlideProductLoading from '../../component/slideProduct/SlideProductLoading';
import PageTransition from '../../component/PageTransition';

const categories = [
  "smartphones",
  "mobile-accessories",
  "laptops",
  "tablets",
  "sports-accessories",
  "sunglasses",
  "mens-watches",
  "womens-watches",
  "mens-shoes",
];

function Home() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchAndMergeProducts = async () => {
    try {
      
      const dummyResults = await Promise.all(
        categories.map(async (category) => {
          const res = await fetch(`https://dummyjson.com/products/category/${category}`);
          const data = await res.json();
          return data.products || [];
        })
      );
     
      const allDummyProducts = dummyResults.flat();

      
      let myRealProducts = [];
      try {
        const res = await fetch("https://final-project-production-3b18.up.railway.app/api/products");
        myRealProducts = await res.status === 200 ? await res.json() : [];
      } catch (e) {
        console.error("Your backend server is offline, using dummy only.");
      }

      
      const combinedProducts = [...myRealProducts, ...allDummyProducts];

      
      const sortedData = {};
      categories.forEach((cat) => {
        sortedData[cat] = combinedProducts.filter(
          (p) => p.category && p.category.toLowerCase() === cat.toLowerCase()
        );
      });

      setProducts(sortedData);
    } catch (error) {
      console.error("Error Fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAndMergeProducts();
}, []);

  return (
    <PageTransition>
      <div>
        <HeroSlider />

        {loading ? (
          categories.map((category) => (
            <SlideProductLoading key={category} />
          ))
        ) : (
          categories.map((category) => (
           
            <SlideProduct 
              key={category} 
              data={products[category] || []} 
              title={category.replace("-", " ")} 
            />
          ))
        )}
      </div>
    </PageTransition>
  );
}

export default Home;