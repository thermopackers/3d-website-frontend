import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null); // Track hover state
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    colorOptions: [],
    materialOptions: [],
    images: [],
    existingImages: [],
    colorInput: "",
    materialInput: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced file validation with better error handling
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = [];
    const oversizedFiles = [];
    
    // Check each file size (9MB limit to be safe)
    const MAX_FILE_SIZE = 9 * 1024 * 1024; // 9MB
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`📁 File ${i + 1}: ${file.name} - ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + 'MB'
        });
      } else {
        validFiles.push(file);
      }
    }
    
    if (oversizedFiles.length > 0) {
      const fileList = oversizedFiles.map(f => `${f.name} (${f.size})`).join('\n');
      alert(`❌ The following files exceed 9MB limit:\n${fileList}\n\nPlease compress images or use smaller files.`);
      
      // Clear the input
      e.target.value = '';
    }
    
    setForm(prev => ({
      ...prev,
      images: validFiles
    }));
  };

  // Image compression function for large files
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          
          // Calculate new dimensions maintaining aspect ratio
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }
              
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              console.log(`✅ Compressed: ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Hover handlers
  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  // Get current image based on hover state
  const getCurrentImage = (product) => {
    if (!product.images || product.images.length === 0) return null;
    
    // If product has multiple images and is being hovered, show second image
    if (hoveredProduct === product._id && product.images.length > 1) {
      return product.images[1]; // Second image
    }
    
    // Otherwise show first image
    return product.images[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    const MAX_FILE_SIZE = 9 * 1024 * 1024; // 9MB
    const oversizedFiles = Array.from(form.images).filter(file => file.size > MAX_FILE_SIZE);
    
    if (oversizedFiles.length > 0) {
      const fileList = oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join('\n');
      alert(`❌ Cannot submit: The following files are still too large:\n${fileList}\n\nPlease remove them and try again.`);
      return;
    }

    if (form.images.length === 0 && form.existingImages.length === 0 && !editingProduct) {
      if (!confirm('No images selected. Continue without images?')) {
        return;
      }
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      
      // Basic fields
      data.append("name", form.name.trim());
      data.append("description", form.description.trim());
      data.append("price", form.price.toString());
      
      // Array fields - append each individually
      form.colorOptions.forEach(color => {
        if (color.trim()) {
          data.append("colorOptions", color.trim());
        }
      });
      
      form.materialOptions.forEach(material => {
        if (material.trim()) {
          data.append("materialOptions", material.trim());
        }
      });
      
      // Existing images
      form.existingImages.forEach(image => {
        if (image.trim()) {
          data.append("existingImages", image.trim());
        }
      });
      
      // New images
      for (let i = 0; i < form.images.length; i++) {
        console.log(`📤 Uploading: ${form.images[i].name} - ${(form.images[i].size / 1024 / 1024).toFixed(2)}MB`);
        data.append("images", form.images[i]);
      }

      console.log("🔄 Submitting form data...");
      console.log("📝 Form data entries:");
      for (let pair of data.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      
      let response;
      if (editingProduct) {
        response = await axiosInstance.put(`/products/${editingProduct._id}`, data, {
          headers: { 
            "Content-Type": "multipart/form-data"
          },
          timeout: 30000 // 30 second timeout
        });
      } else {
        response = await axiosInstance.post("/products", data, {
          headers: { 
            "Content-Type": "multipart/form-data"
          },
          timeout: 30000 // 30 second timeout
        });
      }

      console.log("✅ Success:", response.data);
      alert(editingProduct ? "✅ Product updated successfully!" : "✅ Product added successfully!");
      resetForm();
      fetchProducts();
      
    } catch (err) {
      console.error("❌ Failed to save product:", err);
      console.error("❌ Error response:", err.response?.data);
      
      let errorMessage = "Failed to save product. Please try again.";
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
        if (err.response.data.message) {
          errorMessage += `\n${err.response.data.message}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      colorOptions: [],
      materialOptions: [],
      images: [],
      existingImages: [],
      colorInput: "",
      materialInput: ""
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      colorOptions: product.colorOptions || [],
      materialOptions: product.materialOptions || [],
      images: [],
      existingImages: product.images || [],
      colorInput: "",
      materialInput: ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeExistingImage = (index) => {
    setForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const removeNewImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addColorOption = () => {
    if (form.colorInput.trim()) {
      setForm(prev => ({
        ...prev,
        colorOptions: [...prev.colorOptions, prev.colorInput.trim()],
        colorInput: ""
      }));
    }
  };

  const removeColorOption = (index) => {
    setForm(prev => ({
      ...prev,
      colorOptions: prev.colorOptions.filter((_, i) => i !== index)
    }));
  };

  const addMaterialOption = () => {
    if (form.materialInput.trim()) {
      setForm(prev => ({
        ...prev,
        materialOptions: [...prev.materialOptions, prev.materialInput.trim()],
        materialInput: ""
      }));
    }
  };

  const removeMaterialOption = (index) => {
    setForm(prev => ({
      ...prev,
      materialOptions: prev.materialOptions.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      fetchProducts();
      setDeleteConfirm(null);
      alert("✅ Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Products</h1>
          <p className="text-gray-600">Add, edit, and manage your 3D printed products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingProduct ? `Edit ${editingProduct.name}` : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter product description"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Color Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Options
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={form.colorInput}
                    onChange={e => setForm({ ...form, colorInput: e.target.value })}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addColorOption())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Add color option"
                  />
                  <button
                    type="button"
                    onClick={addColorOption}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.colorOptions.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColorOption(index)}
                        className="ml-2 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Material Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Options
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={form.materialInput}
                    onChange={e => setForm({ ...form, materialInput: e.target.value })}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMaterialOption())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Add material option"
                  />
                  <button
                    type="button"
                    onClick={addMaterialOption}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.materialOptions.map((material, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {material}
                      <button
                        type="button"
                        onClick={() => removeMaterialOption(index)}
                        className="ml-2 hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Existing Images Display with Delete Option */}
              {editingProduct && form.existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Images (Click × to remove)
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {form.existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Existing ${index + 1}`}
                          className="h-20 w-full object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition duration-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingProduct ? "Add New Images" : "Product Images"}
                  <span className="text-xs text-red-500 ml-1">(Max 9MB per image)</span>
                </label>
                
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                
                {/* Show selected new images with remove option */}
                {form.images.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 mb-2">New images to upload:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from(form.images).map((file, index) => {
                        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
                        const isLarge = file.size > 8 * 1024 * 1024; // Warning for files >8MB
                        
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New ${index + 1}`}
                              className="h-20 w-full object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition duration-200"
                            >
                              ×
                            </button>
                            <div className={`absolute bottom-0 left-0 right-0 text-white text-xs p-1 ${isLarge ? 'bg-orange-500' : 'bg-black bg-opacity-50'}`}>
                              {fileSizeMB}MB
                              {isLarge && ' ⚠️'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-1">
                  {form.images.length > 0 
                    ? `${form.images.length} file(s) selected - Total: ${(Array.from(form.images).reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)}MB` 
                    : 'Select multiple images for the product'
                  }
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300 transition duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingProduct ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingProduct ? "Update Product" : "Add Product"
                  )}
                </button>
                
                {editingProduct && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Products ({filteredProducts.length})
              </h2>
              
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {searchTerm ? "No products found" : "No products yet"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search term" : "Add your first product using the form"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => {
                  const currentImage = getCurrentImage(product);
                  const hasMultipleImages = product.images && product.images.length > 1;
                  
                  return (
                    <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Product Image with Hover Effect */}
                        <div 
                          className="flex-shrink-0 relative"
                          onMouseEnter={() => handleMouseEnter(product._id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {currentImage ? (
                            <div className="relative">
                              <img
                                src={currentImage}
                                alt={product.name}
                                className="h-16 w-16 rounded-lg object-cover transition-opacity duration-300"
                              />
                              {/* Show image indicator if multiple images */}
                              {hasMultipleImages && (
                                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                  {hoveredProduct === product._id ? '2' : '1'}/{product.images.length}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                          <p className="text-lg font-bold text-blue-600">₹{product.price}</p>
                          <p className="text-sm text-gray-500 truncate">{product.description}</p>
                          
                          {/* Options */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {product.colorOptions?.slice(0, 3).map((color, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {color}
                              </span>
                            ))}
                            {product.colorOptions?.length > 3 && (
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +{product.colorOptions.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product._id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Delete Confirmation */}
                      {deleteConfirm === product._id && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800 text-sm mb-2">Are you sure you want to delete this product?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition duration-200"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}