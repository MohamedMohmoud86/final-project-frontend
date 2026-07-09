import React from "react";
import "./Blog.css";


const posts = [
  {
    id: 1,
    title: "Top 5 Smartphones in 2025",
    desc: "Discover the best smartphones with the latest features.",
    img: "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/1.webp"
  },
  {
    id: 2,
    title: "Best Accessories for Your Laptop",
    desc: "Upgrade your setup with these must-have accessories.",
    img: "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp"
  },
  {
    id: 3,
    title: "Watches Is Cool",
    desc: "Build your dream gaming setup step by step.",
    img: "https://cdn.dummyjson.com/product-images/womens-watches/rolex-cellini-moonphase/1.webp"
  }
];

function Blog() {
  return (
    <div className="blog_page">
      
      {/* Hero */}
      <div className="blog_hero">
        <h1>Our Blog</h1>
        <p>Latest news, tips & guides</p>
      </div>

      {/* Posts */}
      <div className="container blog_posts">
        {posts.map(post => (
          <div className="blog_card" key={post.id}>
            <img src={post.img} alt="" />
            <h3>{post.title}</h3>
            <p>{post.desc}</p>
            
          </div>
        ))}
      </div>

    </div>
  );
}

export default Blog;