import React, { useEffect, useState } from "react";
import Product from "../../component/slideProduct/Product";
import './Accessories.css';

function Accessories() {
  const [data, setData] = useState([]);

 const categories = ["mobile-accessories", "sports-accessorie", "mens-watches", "womens-bags", "womens-jewellery"];

useEffect(() => {
  Promise.all(
    categories.map(cat =>
      fetch(`https://dummyjson.com/products/category/${cat}`).then(res => res.json())
    )
  ).then(results => {
    const all = results.flatMap(r => r.products);
    setData(all);
  });
}, []);
  return (
    <div className="accessories_products">
      {data.map(item => (
        <Product key={item.id} item={item} />
      ))}
    </div>
  );
}

export default Accessories;