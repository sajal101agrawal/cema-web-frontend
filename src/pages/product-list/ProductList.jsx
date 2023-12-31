import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../../components/Button";
import PageTitle from "../../components/page-tittle/PageTitle";
import PreLoader from "../../components/pre-loader/PreLoader";
import Brands from "../../components/product-list/Brands";
import Category from "../../components/product-list/Category";
import Product from "../../components/product-list/product/Product";
import apiConfig from "../../config/apiConfig";
import Error from "../error/Error";
import { ToastContainer, toast } from "react-toastify";
import Dropdown from 'react-bootstrap/Dropdown';
import { useShoppingCart } from "../../context/ShoppingCartContext";
import ProductGrid from "../../components/product-list/product-grid/ProductGrid";






const ProductList = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastpage] = useState(1);

  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [brands, setBrands] = useState([]);
  const { AddToCart, handleAddRemoveWishlist } = useShoppingCart();

  const [categoryDetails, setCategoryDetails] = useState({
    category: {},
    products: []
  });
  const [categories, setCategories] = useState({});
  const [productsLoaded, setProductsLoaded] = useState(false);

  const [filter, setFilter] = useState({
    minPrice: 0,
    maxPrice: 1000000,
  });
  const [filterToggle, setFilterToggle] = useState(false);
  const [view, setView] = useState('grid');

  const handleFilter = (e) => {
    setFilter(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryID = queryParams.get('id');
    const query = {
      currency: "INR",
      page: currentPage,
      per_page: 10,
      price_range: `${filter?.minPrice}-${filter?.maxPrice}`,
      brand: filter.brand ? filter.brand : '',
    };
    const queryString = new URLSearchParams(query).toString();
    console.log(queryString);

    let urlAPI = "";
    const categoryDetailAPI = apiConfig.categoryDetailsAPI;
    if (categoryID === null) {
      urlAPI = `${categoryDetailAPI}/0?${queryString}`;
    }
    else {
      urlAPI = `${categoryDetailAPI}/${categoryID}?${queryString}`;
    }
    const request = {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
    fetch(urlAPI, request)
      .then((response) => {
        if (!response.ok) throw new Error("Network Issue");
        return response.json();
      })
      .then((datar) => {
        console.log(datar);
        if (datar.status) return "";
        else {
          setProductList(datar.products.data);
          setCurrentPage(datar.products.current_page);
          setLastpage(datar.products.last_page);

          return datar;
        }

      })
      .catch((error) => console.error("Problem with fetch operations", error));


  }, [location.search, currentPage, filterToggle]);

  useEffect(() => {
    const categoryListAPI = apiConfig.categoryListAPI;
    const brandsAPI = apiConfig.brandsAPI;

    fetch(categoryListAPI, {
      method: "GET"
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network Issue");
        return response.json();
      })
      .then((datar) => {
        setCategoryList(datar.categories.data);
        return datar;
      })
      .catch((error) => console.error("Problem with fetch operations", error));

    fetch(brandsAPI, {
      method: "GET"
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network Issue");
        return response.json();
      })
      .then((datar) => {
        if (datar.status) return "";
        else {
          setBrands(datar);
          return datar;
        }

      })
      .catch((error) => console.error("Problem with fetch operations", error));


  }, []);


  useEffect(() => {
    setFilteredProductList(productList);
    setProductsLoaded(true);
  }, [productList])

  const handlePage = (page) => {
    setCurrentPage(page);
  }



  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        <div id="primary" className="content-area">

          <PageTitle current={category === null ? "Products" : category} />

          <div id="content" className="site-content" role="main">
            <div className="section-padding">
              <div className="section-container p-l-r">
                <div class="row">
                  <div class="col-xl-3 col-lg-3 col-md-12 col-12 sidebar left-sidebar md-b-50">

                    {/* Categories */}
                    <div class="block block-product-cats">
                      <div class="block-title">
                        <h2>Categories</h2>
                      </div>
                      <div class="block-content">
                        <div className="product-cats-list">
                          <ul onClick={() => setCurrentPage(1)}>
                            {
                              categoryList.map(category => (
                                <Category current={category} />
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="block block-product-filter">
                      <div className="block-title">
                        <h2>Price</h2>
                      </div>
                      <div className="block-content">
                        <div id="slider-range" className="price-filter-wrap">
                          <div className="filter-item price-filter">
                            <div className="layout-slider" style={{ display: 'flex' }}>
                              <input
                                id="price-filter"
                                name="minPrice"
                                style={{ width: '20%', textAlign: 'center' }}
                                onChange={(e) => handleFilter(e)}
                                placeholder='Min'
                              />
                              <br />
                              <input
                                id="price-filter"
                                name="maxPrice"
                                style={{ marginLeft: '3%', width: '20%', textAlign: 'center' }}
                                onChange={(e) => handleFilter(e)}
                                placeholder='Max'
                              />
                              <button
                                style={{ marginLeft: '5%', width: '20%' }}
                                onClick={() => setFilterToggle(prev => !prev)}
                              >
                                Go
                              </button>
                            </div>
                            <div className="layout-slider-settings"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="block block-product-filter">
                      <div className="block-title">
                        <h2>Price</h2>
                      </div>
                      <div className="block-content">
                        <div id="slider-range" className="price-filter-wrap">
                          <div className="filter-item price-filter">
                            <div className="layout-slider">
                              <input
                                id="price-filter"
                                name="price"
                              />
                            </div>
                            <div className="layout-slider-settings"></div>
                          </div>
                        </div>
                      </div>
                    </div> */}

                    {/* Size  */}
                    {/* <div className="block block-product-filter clearfix">
                      <div className="block-title">
                        <h2>Size</h2>
                      </div>
                      <div className="block-content" >
                        <ul className="filter-items text" onClick={(e) => handleSizeChange(e)}>
                          <li>
                            <span value="l" >L</span>
                          </li>
                          <li>
                            <span value="m" >M</span>
                          </li>
                          <li>
                            <span value="s" >S</span>
                          </li>
                        </ul>
                      </div>
                    </div> */}

                    {/* Brands  */}
                    <div className="block block-product-filter clearfix">
                      <div className="block-title">
                        <h2>Brands</h2>
                      </div>
                      <div className="block-content">
                        <ul className="filter-items image">
                          {brands.map(brand => <Brands brand={brand} bf={setFilter} ft={setFilterToggle} f={filter} />)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-9 col-lg-9 col-md-12 col-12">
                    <div className="products-topbar clearfix">
                      <div className="products-topbar-left">
                        <div className="products-count">
                          Showing all {filteredProductList.length} results
                        </div>
                      </div>
                      <div className="products-topbar-right">
                        <ul className="layout-toggle nav nav-tabs">
                          <li className="nav-item" onClick={() => setView('grid')}>
                            <a className={`layout-grid nav-link ${view === 'grid' ? 'active' : ''}`} data-toggle="tab" href="#layout-grid" role="tab">
                              <span className="icon-column">
                                <span class="layer first"><span></span><span></span><span></span></span><span class="layer middle"><span></span><span></span><span></span></span><span class="layer last"><span></span><span></span><span></span></span></span></a>
                          </li>
                          <li className="nav-item" onClick={() => setView('list')}>
                            <a className={`layout-list nav-link ${view === 'list' ? 'active' : ''}`} data-toggle="tab" href="#layout-list" role="tab"><span className="icon-column"><span class="layer first"><span></span><span></span></span><span class="layer middle"><span></span><span></span></span><span class="layer last"><span></span><span></span></span></span></a>
                          </li>
                        </ul>
                      </div>
                    </div>




                    <div className="tab-content">

                      {/* List Version  */}
                      <div
                        className={`tab-pane fade ${view === 'list' ? 'show active' : ''}`}
                        id="layout-list"
                        role="tabpanel"
                      >
                        <div className="products-list list">
                          {filteredProductList.map(product => (
                            <Product current={product} />
                          ))}
                        </div>
                      </div>

                      {/* Grid Version  */}
                      <div
                        className={`tab-pane fade ${view === 'grid' ? 'show active' : ''}`}
                        id="layout-grid"
                        role="tabpanel"
                      >
                        <div className="products-list grid">
                          <div className="row">
                            {filteredProductList?.map((product) => (
                              <>
                                <ProductGrid current={product} />
                              </>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pagination  */}
                    <nav className="pagination">
                      <ul className="page-numbers">
                        {currentPage !== 1 ?
                          <li onClick={() => setCurrentPage(pre => pre - 1)}>
                            <a className="prev page-numbers" href="#">
                              Previous
                            </a>
                          </li> : ""
                        }
                        {currentPage - 1 > 0 ? <li onClick={() => setCurrentPage(page => page - 1)}><a class="page-numbers" href="#">{currentPage - 1}</a></li> : ""}
                        {currentPage !== lastPage ? <li><span aria-current="page" class="page-numbers current">{currentPage}</span></li> : ''}
                        {currentPage + 1 <= lastPage ? <li onClick={() => setCurrentPage(page => page + 1)}><a class="page-numbers" href="#">{currentPage + 1}</a></li> : ""}

                        {currentPage !== lastPage ?
                          <li onClick={() => setCurrentPage(pre => pre + 1)}>
                            <a className="next page-numbers" href="#">
                              Next
                            </a>
                          </li> : ""
                        }
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default ProductList;
