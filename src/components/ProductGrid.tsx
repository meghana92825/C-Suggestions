import { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { storage } from '../utils/storage';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  searchQuery: string;
  categoryFilter: string;
  subcategoryFilter: string;
}

export function ProductGrid({ searchQuery, categoryFilter, subcategoryFilter }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await storage.getProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesSubcategory = !subcategoryFilter || product.subcategory === subcategoryFilter;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [products, searchQuery, categoryFilter, subcategoryFilter]);

  if (filteredProducts.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 w-full">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}