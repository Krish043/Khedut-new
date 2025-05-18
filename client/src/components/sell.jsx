import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Sell = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({});
  const [auth, setAuth] = useState({
    name: "",
    email: "",
    auth: false,
    role: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    const localAuth = localStorage.getItem("auth");
    if (!localAuth) {
      const defaultAuth = { name: "", email: "", auth: false, role: "" };
      localStorage.setItem("auth", JSON.stringify(defaultAuth));
      setAuth(defaultAuth);
    } else {
      setAuth(JSON.parse(localAuth));
    }
  }, []); 

  const fetchProducts = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND}/products`)
      .then((response) => {
        setProducts(response.data);
        fetchUserDetails(response.data);
      })
      .catch((error) => console.error("Error fetching products!", error));
  };

  const fetchUserDetails = (products) => {
    const userPromises = products.map(product => 
      axios.get(`${import.meta.env.VITE_BACKEND}/users/email/${product.email}`)
    );
    Promise.all(userPromises)
      .then(responses => {
        const usersMap = {};
        responses.forEach(response => {
          const { email, name } = response.data;
          usersMap[email] = name;
        });
        setUsers(usersMap);
      })
      .catch(error => console.error("Error fetching user details!", error));
  };

  const categorizedProducts = products.reduce((categories, product) => {
    categories[product.category] = categories[product.category] || [];
    categories[product.category].push(product);
    return categories;
  }, {});

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === "All" ? "All Products" : category);
  };

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8 mt-12 w-full">
      <DropdownMenu onOpenChange={setIsDropdownOpen}>
        <div className="flex w-full p-2 h-[80px] items-center justify-between">
          <DropdownMenuTrigger className="flex items-center text-4xl font-bold text-green-800 cursor-pointer">
            {selectedCategory}
            {isDropdownOpen ? (
              <FaChevronUp className="ml-2" />
            ) : (
              <FaChevronDown className="ml-2" />
            )}
          </DropdownMenuTrigger>
          <button
            onClick={() => {
              navigate("/add-product");
            }}
            className="py-3 w-[150px] bg-green-500 text-white rounded-lg shadow-lg"
          >
            Add products
          </button>
        </div>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleCategoryClick("All")}>
            All Products
          </DropdownMenuItem>
          {Object.keys(categorizedProducts).map((category) => (
            <DropdownMenuItem
              key={category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-screen-lg">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="p-2 pb-0 bg-white rounded-lg shadow-lg text-left"
          >
            <img
              src={product.uri}
              alt={product.productname}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h4 className="text-3xl font-bold text-gray-800 mb-2">
              {product.productname}
            </h4>
            <p className="text-gray-500 mb-2">by @{users[product.email] || "Unknown"}</p>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-semibold text-gray-800">
              Quantity: {product.quantity} Kgs
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Price: {product.price} Rs/Kg
            </p>
          </div>
        ))}

        
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <div
        key={product._id}
        className="rounded-2xl border bg-white p-4 shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform"
      >
        <div className="relative">
          <img
            src={product.uri}
            alt={product.productname}
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
            {product.category || "Uncategorized"}
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.productname}
          </h3>
          <p className="text-sm text-gray-500">
            by @{users[product.email] || "Unknown"}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400"
                    : i < (product.rating || 0)
                    ? "text-yellow-300"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.563-.954L10 0l2.947 5.956 6.563.954-4.755 4.635 1.123 6.545z" />
              </svg>
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              {(product.rating || 0).toFixed(1)}
            </span>
          </div>

          <div className="text-sm mt-1 text-gray-700">
            Pack of: <strong>{product.quantity} kg</strong>
          </div>
          <div className="text-sm text-gray-700">
            Price: <strong>₹{product.price}/kg</strong>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-2xl text-gray-600 col-span-full text-center">
      No products listed for sale.
    </p>
  )}
</div>
    </div>
  );
};

export default Sell;
