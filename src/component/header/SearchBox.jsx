import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router';

function SearchBox() {

    const [searchTearm, setSearchTerm,] = useState("");

    const [suggestions, setSuggestions] = useState([])
    const navigate = useNavigate()

    const location = useLocation()

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTearm.trim()) {
            navigate(`/search?Query=${encodeURIComponent(searchTearm.trim())}`)
        }
        setSuggestions([]);

    }

    useEffect(() => {
        const fetchSuggestions = async () => {

            if (!searchTearm.trim()) {
                setSuggestions([])
                return;
            }
            try {
                const res = await fetch(
                    `https://dummyjson.com/products/search?q=${searchTearm}`
                )
                const data = await res.json();
                setSuggestions(data.products.slice(0, 5) || [])
            } catch (error) {
                console.error("Search Error :", error);
                setSuggestions([])
            }
        }

        const debounce = setTimeout(() => {
            fetchSuggestions()

        }, 300)

        return () => clearTimeout(debounce);

    }, [searchTearm])



    useEffect(() => {

        setSuggestions([]);
    }, [location])

    return (

        <div className="searchBox_container">
            <form onSubmit={handleSubmit} className='search_box'>
                <input type='text' name='search' id='search' placeholder='Search For Products' onChange={(e) => setSearchTerm(e.target.value)} autoComplete='off' />
                <button type='submit'><FaSearch /></button>


            </form>
            {suggestions.length > 0 && (
                <ul className='suggestions'>
                    {suggestions.map((item) => (
                        <Link to={`/products/${item.id}`}>
                            <li key={item.id}><img src={item.images[0]} alt='' /> <span>{item.title}</span></li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchBox