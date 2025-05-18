import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  // states
  const [products, setProducts] = useState([]);
  const savedCart = useLoaderData();
  const [cart, setCart] = useState(savedCart);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  console.log("current page", currentPage);

  // calc total page
  const totalPage = Math.ceil(parseInt(count) / itemsPerPage);

  // const pages for pagination button
  const pages = [...Array(totalPage).keys()];

  // side effect for products
  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${currentPage}&size=${itemsPerPage}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, itemsPerPage]);

  // useEffect(() => {
  //   const storedCart = getShoppingCart();
  //   const savedCart = [];
  //   // step 1: get id of the addedProduct
  //   for (const id in storedCart) {
  //     // step 2: get product from products state by using id
  //     const addedProduct = products.find((product) => product._id === id);
  //     if (addedProduct) {
  //       // step 3: add quantity
  //       const quantity = storedCart[id];
  //       addedProduct.quantity = quantity;
  //       // step 4: add the added product to the saved cart
  //       savedCart.push(addedProduct);
  //     }
  //     // console.log('added Product', addedProduct)
  //   }
  //   // step 5: set the cart
  //   setCart(savedCart);
  // }, [products]);

  // sideEffect for product count
  useEffect(() => {
    fetch("http://localhost:5000/products/count")
      .then((res) => res.json())
      .then((data) => setCount(data?.count));
  }, []);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  //   all handle function for pagination
  const handleItemsPerPage = (e) => {
    const val = parseInt(e.target.value);
    setItemsPerPage(val);
    setCurrentPage(0);
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    currentPage > 0 && setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    currentPage < pages.length - 1 && setCurrentPage(currentPage + 1);
  };
  // return code
  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>

      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>

      {/* pagination */}
      <div className="pagination">
        <button onClick={handlePrev}>prev</button>
        {pages.map((page, idx) => (
          <button
            className={currentPage === page ? "active_btn " : ""}
            key={idx}
            onClick={() => handleCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNext}>next</button>
        <select
          name=""
          id=""
          className="items_per_page"
          value={itemsPerPage}
          onChange={handleItemsPerPage}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
