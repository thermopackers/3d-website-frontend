// components/OrderTracking.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Home,
  Calendar,
  Check,
  Circle
} from 'lucide-react';

const OrderTracking = ({ order }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="w-5 h-5" />;
      case 'Processing': return <Package className="w-5 h-5" />;
      case 'Shipped': return <Truck className="w-5 h-5" />;
      case 'Out for Delivery': return <MapPin className="w-5 h-5" />;
      case 'Delivered': return <Home className="w-5 h-5" />;
      case 'Cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-yellow-500 border-yellow-500';
      case 'Processing': return 'text-blue-500 border-blue-500';
      case 'Shipped': return 'text-purple-500 border-purple-500';
      case 'Out for Delivery': return 'text-orange-500 border-orange-500';
      case 'Delivered': return 'text-green-500 border-green-500';
      case 'Cancelled': return 'text-red-500 border-red-500';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100';
      case 'Processing': return 'bg-blue-100';
      case 'Shipped': return 'bg-purple-100';
      case 'Out for Delivery': return 'bg-orange-100';
      case 'Delivered': return 'bg-green-100';
      case 'Cancelled': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getStatusMessage = (status) => {
    switch(status) {
      case 'Pending': return 'Your order has been placed and is waiting for confirmation';
      case 'Processing': return 'Your order is being processed and prepared for shipping';
      case 'Shipped': return 'Your order has been shipped and is on its way';
      case 'Out for Delivery': return 'Your order is out for delivery!';
      case 'Delivered': return 'Your order has been delivered successfully!';
      case 'Cancelled': return 'Your order has been cancelled';
      default: return 'Order status unknown';
    }
  };

  const getStatusSteps = () => {
    const allSteps = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = allSteps.indexOf(order.status);
    
    return allSteps.map((step, index) => ({
      step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
      isUpcoming: index > currentIndex
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Current Status */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-full ${getStatusBg(order.status)}`}>
          {getStatusIcon(order.status)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Status: {order.status}</h3>
          <p className="text-gray-500">{getStatusMessage(order.status)}</p>
        </div>
        {order.estimatedDelivery && order.status !== 'Delivered' && (
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500">Estimated Delivery</p>
            <p className="font-semibold text-blue-600">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200">
          <div 
            className="w-0.5 bg-gradient-to-b from-blue-500 to-green-500 transition-all duration-1000"
            style={{ 
              height: `${Math.min(100, (getStatusSteps().filter(s => s.isCompleted).length / (getStatusSteps().length - 1)) * 100)}%` 
            }}
          />
        </div>

        <div className="space-y-8">
          {getStatusSteps().map((step, index) => (
            <div key={step.step} className="relative flex items-start gap-4">
              {/* Timeline Node */}
              <div className="relative z-10">
                {step.isCompleted ? (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBg(step.step)} border-2 ${getStatusColor(step.step)}`}>
                    {step.isCurrent ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-current"
                      />
                    ) : (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 border-2 border-gray-300`}>
                    <Circle className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Status Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold ${
                    step.isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.step}
                  </h4>
                  {step.isCurrent && (
                    <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      Current
                    </span>
                  )}
                  {step.isCompleted && !step.isCurrent && (
                    <span className="px-2 py-0.5 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                      ✓ Complete
                    </span>
                  )}
                </div>

                {step.isCompleted && order.statusHistory && (
                  <div className="mt-1">
                    {order.statusHistory
                      .filter(h => h.status === step.step)
                      .map((history, idx) => (
                        <p key={idx} className="text-sm text-gray-500">
                          {history.note || `${step.step} status`}
                          {history.location && ` at ${history.location}`}
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(history.timestamp).toLocaleString()}
                          </span>
                        </p>
                      ))}
                  </div>
                )}

                {!step.isCompleted && step.isUpcoming && (
                  <p className="text-sm text-gray-400">Waiting...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Number */}
      {order.trackingNumber && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tracking Number</p>
              <p className="font-semibold text-gray-900">{order.trackingNumber}</p>
            </div>
            <button
              onClick={() => window.open(`https://www.google.com/search?q=${order.trackingNumber}`, '_blank')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
            >
              Track Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;