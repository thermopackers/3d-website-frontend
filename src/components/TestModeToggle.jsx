// src/components/TestModeToggle.jsx
import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const TestModeToggle = () => {
  const [isTestMode, setIsTestMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axiosInstance.get('/payments/config');
      if (res.data.success) {
        setConfig(res.data);
        setIsTestMode(res.data.currentMode === 'test');
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
    }
  };

  const toggleMode = async () => {
    try {
      setLoading(true);
      setError(null);
      const newMode = isTestMode ? 'live' : 'test';
      
      const res = await axiosInstance.post('/payments/switch-mode', { mode: newMode });
      
      if (res.data.success) {
        setIsTestMode(newMode === 'test');
        setShowBanner(true);
        // Refresh config
        await fetchConfig();
        // Show success notification
        showNotification(`Switched to ${newMode.toUpperCase()} mode`, 'success');
      }
    } catch (err) {
      console.error('Failed to switch mode:', err);
      setError(err.response?.data?.error || 'Failed to switch payment mode');
      showNotification('Failed to switch mode', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-xl z-50 animate-slide-in ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-slide-out');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  if (!config?.features?.testModeToggle) {
    return null;
  }

  return (
    <>
      {/* Mode Banner */}
      {showBanner && (
        <div className={`fixed top-20 right-4 z-40 p-4 rounded-xl shadow-2xl max-w-sm ${
          isTestMode 
            ? 'bg-yellow-50 border border-yellow-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-start gap-3">
            {isTestMode ? (
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${
                isTestMode ? 'text-yellow-800' : 'text-green-800'
              }`}>
                {isTestMode ? '🔬 Test Mode' : '🔒 Live Mode'}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {isTestMode 
                  ? 'Using test credentials. No real money will be charged.' 
                  : 'Using live credentials. Real payments will be processed.'}
              </p>
              <button
                onClick={() => setShowBanner(false)}
                className="text-xs text-gray-500 hover:text-gray-700 mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={toggleMode}
          disabled={loading}
          className={`group flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
            isTestMode 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          } ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {isTestMode ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Switch to Live</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Switch to Test</span>
                </>
              )}
            </>
          )}
        </button>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Mode Indicator in Checkout */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-slide-out {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>
    </>
  );
};

export default TestModeToggle;