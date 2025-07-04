"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user.publicMetadata.role === "seller") {
        setIsSeller(true);
      }

      const token = await getToken();

      const { data } = await axios.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Item added to cart");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Cart Updated");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  // const getCartAmount = () => {
  //   let totalAmount = 0;
  //   for (const items in cartItems) {
  //     console.log("Current cart item ID:", items); // Cart item key
  //     console.log("Quantity:", cartItems[items]); // Quantity
  //     let itemInfo = products.find((product) => product._id === items);
  //     console.log("Found product:", itemInfo); // Will show undefined if not found

  //     if (cartItems[items] > 0) {
  //       totalAmount += itemInfo.offerPrice * cartItems[items];
  //     }
  //   }
  //   return Math.floor(totalAmount * 100) / 100;
  // };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const quantity = cartItems[itemId];

      if (quantity <= 0) continue;

      const product = products.find((p) => String(p._id) === String(itemId));

      if (!product) {
        console.warn(`No product found for cart item ID: ${itemId}`);
        continue;
      }

      const price = Number(product.offerPrice ?? product.price ?? 0);
      if (isNaN(price)) {
        console.warn(`Invalid price for product ID: ${itemId}`);
        continue;
      }

      totalAmount += price * quantity;
    }

    return Math.round(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  useEffect(() => {
    if (!products.length || !Object.keys(cartItems).length) return;

    const cleaned = { ...cartItems };
    let changed = false;

    for (const id in cartItems) {
      const found = products.some((p) => String(p._id) === id);
      if (!found) {
        delete cleaned[id]; // drop the stale item
        changed = true;
        console.warn(`Pruned stale cart item ${id}`);
      }
    }

    if (changed) {
      setCartItems(cleaned);

      // 🔄 optional – persist the cleanup to backend
      (async () => {
        try {
          const token = await getToken();
          await axios.post(
            "/api/cart/update",
            { cartData: cleaned },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          toast.error(err.message);
        }
      })();
    }
  }, [products, cartItems]);

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
