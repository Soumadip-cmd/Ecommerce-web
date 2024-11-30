import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";

const Cart = () => {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const responseData = await response.json();

      if (responseData.success) {
        setUserData({
          name: responseData.data?.name || "",
          email: responseData.data?.email || "",
          location: responseData.data?.address || "",
        });
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error loading user details");
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      const responseData = await response.json();

      if (responseData.success) {
        setData(responseData.data);
      } else {
        toast.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Error loading cart items");
    }
  };

  const handleLoading = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchData(), fetchUserData()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoading();
  }, []);

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
    }
  };

  const decraseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        fetchData();
      }
    }
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
  };

  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  );
  const totalPrice = data.reduce(
    (preve, curr) => preve + curr.quantity * curr?.productId?.sellingPrice,
    0
  );

  // Payment
  const handlePayment = (totalPrice) => {
    // const url = "http://localhost:8088";
    const url="https://ecommerce-web-hwh3.onrender.com"
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: totalPrice * 100,
      currency: "INR",
      name: "BaXar Corp.",
      description: "Thank You For Shopping... Have A Good day !..",
      image: "logo.png",
      callback_url: `${url}/api/paymentVerify`,
      prefill: {
        name: userData.name,
        email: userData.email,
      },
      notes: {
        address: userData.location,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5">No Data</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
        {/* View product */}
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart?.map((el, index) => (
                <div
                  key={el + "Add To Cart Loading" + index}
                  className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                ></div>
              ))
            : data.map((product, index) => (
                <div
                  key={product?._id + "Add To Cart Loading"}
                  className="w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]"
                >
                  <div className="w-32 h-32 bg-slate-200">
                    <img
                      src={product?.productId?.productImage[0]}
                      className="w-full h-full object-scale-down mix-blend-multiply"
                      alt={product?.productId?.productName}
                    />
                  </div>
                  <div className="px-4 py-2 relative">
                    {/* Delete product */}
                    <div
                      className="absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                      onClick={() => deleteCartProduct(product?._id)}
                    >
                      <MdDelete />
                    </div>

                    <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                      {product?.productId?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {product?.productId.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-red-600 font-medium text-lg">
                        {displayINRCurrency(product?.productId?.sellingPrice)}
                      </p>
                      <p className="text-slate-600 font-semibold text-lg">
                        {displayINRCurrency(
                          product?.productId?.sellingPrice * product?.quantity
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                        onClick={() =>
                          decraseQty(product?._id, product?.quantity)
                        }
                      >
                        -
                      </button>
                      <span>{product?.quantity}</span>
                      <button
                        className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                        onClick={() =>
                          increaseQty(product?._id, product?.quantity)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Summary */}
        <div className="mt-5 lg:mt-0 w-full max-w-sm">
          {loading ? (
            <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse"></div>
          ) : (
            <div className="h-36 bg-white">
              <h2 className="text-white bg-red-600 px-4 py-1">Summary</h2>
              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Quantity</p>
                <p>{totalQty}</p>
              </div>

              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Total Price</p>
                <p>{displayINRCurrency(totalPrice)}</p>
              </div>

              <button
                className="bg-blue-600 p-2 text-white w-full mt-2 hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                onClick={() => handlePayment(totalPrice)}
                disabled={!totalQty || loading}
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>
      {/* <footer className="bg-slate-200 ">
        <div className="container mx-auto p-4">
          <p className="text-center font-medium">
            {" "}
            <p className=" font-extralight">
              <span className=" font-normal">
                Copyright &copy; & Developed by
              </span>{" "}
              <strong>~ Soumadip.</strong>.
            </p>
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default Cart;
