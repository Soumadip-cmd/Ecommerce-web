import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const PaymentSuccess = () => {
  const [showCheck, setShowCheck] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchQuery = useSearchParams()[0];
  const referenceNum = searchQuery.get("reference");

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const fetchPaymentDetails = async () => {
//     const url = "http://localhost:8088";
    const url = "https://ecommerce-web-hwh3.onrender.com"

    try {
      const response = await fetch(`${url}/api/paymentDetails?reference=${referenceNum}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setPaymentDetails(data.order);
      } else {
        toast.error(data.error || "Failed to fetch payment details");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast.error("Error loading payment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
    setTimeout(() => setShowCheck(true), 500);
    setTimeout(() => setShowContent(true), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-red-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div
          className={`flex justify-center transition-all duration-700 transform ${
            showCheck ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <CheckCircle className="w-24 h-24 text-red-600" />
        </div>
        <div
          className={`mt-6 text-center transition-all duration-700 ${
            showContent ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
          }`}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your transaction has been completed successfully. We've sent a confirmation email to your inbox.
          </p>
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-red-700">Amount Paid</span>
              <span className="font-semibold text-red-700">
                ₹{paymentDetails ? (paymentDetails.amount / 100).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-red-700">Transaction ID</span>
              <span className="font-semibold text-red-700 uppercase">{referenceNum}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700">Date</span>
              <span className="font-semibold text-red-700">{formattedDate}</span>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              View Receipt
            </button>
            <button
              className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center hover:border-red-300"
              onClick={() => window.location.href = "/"}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;