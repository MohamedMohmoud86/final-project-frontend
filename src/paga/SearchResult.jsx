import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import PageTransition from '../component/PageTransition';
import SlideProductLoading from '../component/slideProduct/SlideProductLoading';
import Product from '../component/slideProduct/Product';

function SearchResult() {

    const [results, setResults] = useState([])
    const Query = new URLSearchParams(useLocation().search).get("Query");
    const [loading, setLoading] = useState(true)

    console.log(results);



    useEffect(() => {


        const fetchResult = async () => {
            try {
                const res = await fetch(
                    `https://dummyjson.com/products/search?q=${Query}`
                )

                const data = await res.json();
                setResults(data.products || []);
            } catch (error) {
                console.error("Search Error :", error);

            } finally {
                setLoading(false)
            }
        }
        if (Query) fetchResult();

    }, [Query])
    return (
        <PageTransition key={Query}>
            <div className="category_products">

                {loading ? (

                    <SlideProductLoading key={Query} /> 

                ) : results.length > 0 ? (
                    

                    <div className="container">

                        <div className='top_slide'>
                            <h2> Results for : {Query}
                                </h2>
                            
                        </div>

                        <div className="products">
                            {results.map((item, index) => (
                                <Product item={item} key={index} />
                            ))}
                        </div>
                    </div>
                
                ) : <div className='container' style={{ padding: "100px" }}> <p>No Result Found</p>
</div>}
 

            </div>

        </PageTransition>


    );
}

export default SearchResult