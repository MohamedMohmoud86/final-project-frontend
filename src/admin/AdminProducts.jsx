import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    thumbnail: ""
  });

 
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://final-project-production-3b18.up.railway.app/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
  
    const payload = {
      ...formData,
      images: [formData.thumbnail]
    };

   
    await axios.post("https://final-project-production-3b18.up.railway.app/api/products", payload);
    
    toast.success("Product Added Successfully! 🎉");
    setFormData({ title: "", price: "", description: "", category: "", thumbnail: "" });
    fetchProducts(); 
  } catch (err) {
    toast.error("Failed to add product");
  }
};

  const handleDeleteProduct = async (id) => {
    try {
    
      const stringId = String(id);

      if (stringId.length > 10) {
     
        const res = await fetch(`https://final-project-production-3b18.up.railway.app/api/products/${stringId}`, {
          method: "DELETE",
        });

        if (res.ok) {
       
          setProducts(prevProducts => prevProducts.filter(item => (item._id || item.id) !== id));
          toast.success("Product deleted successfully from Database! 🗑️", { duration: 3000 });
        } else {
          toast.error("Failed to delete product from server");
        }
      } else {
       
        setProducts(prevProducts => prevProducts.filter(item => (item._id || item.id) !== id));
        toast.success("Dummy product removed locally! 📋", { duration: 3000 });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <div className="admin_products_manager">
      <div className="admin_header_title">
        <h2>📦 Products Management</h2>
        <span className="count_badge">Total Items: {products.length}</span>
      </div>

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="admin_product_form">
        <h3>Add New Product</h3>
        <div className="form_group_row">
          <input type="text" name="title" placeholder="Product Title" value={formData.title} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="form_group_row">
          <input type="text" name="category" placeholder="Category (e.g. accessories)" value={formData.category} onChange={handleChange} required />
          <input type="text" name="thumbnail" placeholder="Image URL" value={formData.thumbnail} onChange={handleChange} required />
        </div>
        <textarea name="description" placeholder="Product Description..." value={formData.description} onChange={handleChange} required></textarea>
        <button type="submit" className="add_product_submit_btn">Add Product to Inventory</button>
      </form>

      {/* TABLE SECTION */}
      <div className="table_section">
        <h3>Current Inventory</h3>
        <div className="admin_table_container">
          <table className="admin_table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id || product.id}>
                  <td>
                    <img 
                      src={product.thumbnail || "https://via.placeholder.com/150"} 
                      alt={product.title} 
                      className="table_img" 
                    />
                  </td>
                  <td className="product_title_cell">{product.title}</td>
                  <td><span className="category_badge">{product.category}</span></td>
                  <td className="price_cell">${product.price}</td>
                  <td>
                  
                    <button onClick={() => handleDeleteProduct(product._id || product.id)} className="delete_action_btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}