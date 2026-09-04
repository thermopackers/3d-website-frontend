// components/CouponDisplay.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Clock, 
  CheckCircle, 
  XCircle,
  Percent,
  IndianRupee,
  Calendar,
  Tag,
  Sparkles
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const CouponDisplay = ({ onApplyCoupon, orderAmount }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/recycling/coupons/available');
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async (coupon) => {
    try {
      setApplying(true);
      const res = await axiosInstance.post('/recycling/coupons/validate', {
        code: coupon.code,
        orderAmount: orderAmount
      });

      if (res.data.success) {
        setSelectedCoupon(coupon);
        toast.success(`Coupon applied! You saved ₹${res.data.coupon.discount}`);
        if (onApplyCoupon) {
          onApplyCoupon(res.data.coupon);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to apply coupon');
    } finally {
      setApplying(false);
    }
  };

  const getCouponIcon = (source) => {
    switch(source) {
      case 'recycling': return <Gift className="w-5 h-5 text-green-500" />;
      case 'promotion': return <Sparkles className="w-5 h-5 text-yellow-500" />;
      case 'birthday': return <Calendar className="w-5 h-5 text-pink-500" />;
      case 'referral': return <Tag className="w-5 h-5 text-blue-500" />;
      default: return <Gift className="w-5 h-5 text-purple-500" />;
    }
  };

  const getDiscountDisplay = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `₹${coupon.discountValue} OFF`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Gift className="w-10 h-10 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No coupons available</p>
        <p className="text-xs">Recycle waste to earn coupons!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Gift className="w-5 h-5 text-green-500" />
        Available Coupons ({coupons.length})
      </h3>

      {coupons.map((coupon) => (
        <motion.div
          key={coupon._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 border rounded-lg transition-all ${
            selectedCoupon?.code === coupon.code
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getCouponIcon(coupon.source)}
                <span className="font-bold text-gray-900">{coupon.code}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {getDiscountDisplay(coupon)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">{coupon.description}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Min: ₹{coupon.minOrderAmount}</span>
                {coupon.maxDiscount && (
                  <span>Max Discount: ₹{coupon.maxDiscount}</span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(coupon.validUntil).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleApplyCoupon(coupon)}
              disabled={applying || selectedCoupon?.code === coupon.code}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCoupon?.code === coupon.code
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {selectedCoupon?.code === coupon.code ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Applied
                </span>
              ) : applying ? (
                'Applying...'
              ) : (
                'Apply'
              )}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CouponDisplay;