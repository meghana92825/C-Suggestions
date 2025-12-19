import { useState } from 'react';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { calculateDiscount } from '../utils/productUtils';
import { storage } from '../utils/storage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscount(product.mrp, product.sellingPrice);
  const [imageError, setImageError] = useState(false);

  const handleBuyNow = () => {
    // Track click
    storage.trackProductClick(product.id, product.name);
    
    // Open affiliate link in new tab
    window.open(product.affiliateUrl, '_blank');
  };

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group w-full">
      {/* Product Image - Fixed Height */}
      <div className="relative overflow-hidden h-48 w-full">
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info - Fixed Height Container */}
      <div className="p-4 h-48 flex flex-col">
        {/* Product Title - One Line Only */}
        <h3 className="font-semibold text-gray-900 mb-2 truncate group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Category Tags */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
            {product.subcategory}
          </span>
        </div>

        {/* Product Code */}
        <div className="text-xs text-gray-500 font-mono mb-2 truncate">
          Code: {product.code}
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-3 mb-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.sellingPrice}
            </span>
            {product.mrp > product.sellingPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={handleBuyNow}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <ExternalLink className="w-4 h-4" />
          Buy Now
        </button>
      </div>
    </article>
  );
}