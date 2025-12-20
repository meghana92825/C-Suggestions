import { useState, useEffect } from 'react';
import { X, Package, Tags, Image, BarChart3, Settings, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Upload, Eye, EyeOff, Save } from 'lucide-react';
import { storage } from '../utils/storage';
import { Product, Category, Banner, AdminSettings, Analytics } from '../types';
import { generateProductCode } from '../utils/productUtils';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'banners' | 'analytics' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({ secretCode: '123456', sessionActive: false, sessionExpiry: 0 });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [newSubcategoryInputs, setNewSubcategoryInputs] = useState<{ [key: string]: string }>({});
  
  // Product form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    imageUrl: '',
    mrp: 0,
    sellingPrice: 0,
    category: '',
    subcategory: '',
    affiliateUrl: '',
    code: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [productsData, categoriesData, bannersData, analyticsData, settingsData] = await Promise.all([
        storage.getProducts(),
        storage.getCategories(),
        storage.getBanners(),
        storage.getAnalytics(),
        storage.getAdminSettings()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBanners(bannersData);
      setAnalytics(analyticsData);
      setAdminSettings(settingsData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      imageUrl: product.imageUrl,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      category: product.category,
      subcategory: product.subcategory,
      affiliateUrl: product.affiliateUrl,
      code: product.code
    });
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      imageUrl: '',
      mrp: 0,
      sellingPrice: 0,
      category: categories[0]?.name || '',
      subcategory: categories[0]?.subcategories[0] || '',
      affiliateUrl: '',
      code: ''
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.imageUrl || !productForm.affiliateUrl || !productForm.category || !productForm.subcategory) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingProduct) {
        await storage.updateProduct(editingProduct.id, productForm as Partial<Product>);
        const updatedProducts = products.map(p =>
          p.id === editingProduct.id
            ? { ...p, ...productForm }
            : p
        );
        setProducts(updatedProducts);
      } else {
        const newProductData = {
          name: productForm.name || '',
          imageUrl: productForm.imageUrl || '',
          mrp: productForm.mrp || 0,
          sellingPrice: productForm.sellingPrice || 0,
          category: productForm.category || '',
          subcategory: productForm.subcategory || '',
          code: productForm.code || generateProductCode(),
          affiliateUrl: productForm.affiliateUrl || '',
          clicks: 0
        };
        const newProduct = await storage.addProduct(newProductData);
        if (newProduct) {
          setProducts([...products, newProduct]);
        }
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        imageUrl: '',
        mrp: 0,
        sellingPrice: 0,
        category: '',
        subcategory: '',
        affiliateUrl: '',
        code: ''
      });
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    }
  };

  const handleCancelForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      imageUrl: '',
      mrp: 0,
      sellingPrice: 0,
      category: '',
      subcategory: '',
      affiliateUrl: '',
      code: ''
    });
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await storage.deleteProduct(id);
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleAddCategory = async () => {
    const newCategoryData = {
      name: 'New Category',
      subcategories: ['New Subcategory']
    };
    try {
      const newCategory = await storage.addCategory(newCategoryData);
      if (newCategory) {
        setCategories([...categories, newCategory]);
      }
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category');
    }
  };

  const handleUpdateCategoryName = async (id: string, newName: string) => {
    try {
      await storage.updateCategory(id, { name: newName });
      const updatedCategories = categories.map(c =>
        c.id === id ? { ...c, name: newName } : c
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    const productsInCategory = products.filter(p => p.category === category.name);
    if (productsInCategory.length > 0) {
      alert(`Cannot delete category "${category.name}" because ${productsInCategory.length} product(s) are using it. Please delete or reassign those products first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete category "${category.name}" and all its subcategories?`)) {
      try {
        await storage.deleteCategory(id);
        const updatedCategories = categories.filter(c => c.id !== id);
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const handleAddSubcategory = async (categoryId: string) => {
    const newSubcategoryName = newSubcategoryInputs[categoryId]?.trim();
    if (!newSubcategoryName) {
      alert('Please enter a subcategory name');
      return;
    }

    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (category.subcategories.includes(newSubcategoryName)) {
      alert('This subcategory already exists');
      return;
    }

    try {
      const updatedCategory = {
        ...category,
        subcategories: [...category.subcategories, newSubcategoryName]
      };
      await storage.updateCategory(categoryId, updatedCategory);

      const updatedCategories = categories.map(c =>
        c.id === categoryId ? updatedCategory : c
      );
      setCategories(updatedCategories);
      setNewSubcategoryInputs(prev => ({ ...prev, [categoryId]: '' }));
    } catch (error) {
      console.error('Failed to add subcategory:', error);
      alert('Failed to add subcategory');
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryName: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const productsInSubcategory = products.filter(p =>
      p.category === category.name && p.subcategory === subcategoryName
    );
    if (productsInSubcategory.length > 0) {
      alert(`Cannot delete subcategory "${subcategoryName}" because ${productsInSubcategory.length} product(s) are using it. Please delete or reassign those products first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete subcategory "${subcategoryName}"?`)) {
      try {
        const updatedCategory = {
          ...category,
          subcategories: category.subcategories.filter(s => s !== subcategoryName)
        };
        await storage.updateCategory(categoryId, updatedCategory);

        const updatedCategories = categories.map(c =>
          c.id === categoryId ? updatedCategory : c
        );
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Failed to delete subcategory:', error);
        alert('Failed to delete subcategory');
      }
    }
  };

  const handleUpdateSubcategory = async (categoryId: string, oldName: string, newName: string) => {
    if (!newName.trim()) return;

    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    try {
      const updatedProducts = [];
      for (const p of products) {
        if (p.category === category.name && p.subcategory === oldName) {
          await storage.updateProduct(p.id, { subcategory: newName });
          updatedProducts.push({ ...p, subcategory: newName });
        } else {
          updatedProducts.push(p);
        }
      }

      const updatedCategory = {
        ...category,
        subcategories: category.subcategories.map(s => s === oldName ? newName : s)
      };
      await storage.updateCategory(categoryId, updatedCategory);

      const updatedCategories = categories.map(c =>
        c.id === categoryId ? updatedCategory : c
      );

      setProducts(updatedProducts);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Failed to update subcategory:', error);
      alert('Failed to update subcategory');
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddBanner = async () => {
    const newBannerData = {
      imageUrl: '',
      affiliateUrl: '',
      title: 'New Banner',
      isActive: true
    };
    try {
      const newBanner = await storage.addBanner(newBannerData);
      if (newBanner) {
        setBanners([...banners, newBanner]);
      }
    } catch (error) {
      console.error('Failed to add banner:', error);
      alert('Failed to add banner');
    }
  };

  const handleUpdateBanner = async (id: string, field: keyof Banner, value: any) => {
    try {
      await storage.updateBanner(id, { [field]: value });
      const updatedBanners = banners.map(b =>
        b.id === id ? { ...b, [field]: value } : b
      );
      setBanners(updatedBanners);
    } catch (error) {
      console.error('Failed to update banner:', error);
      alert('Failed to update banner');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await storage.deleteBanner(id);
        const updatedBanners = banners.filter(b => b.id !== id);
        setBanners(updatedBanners);
      } catch (error) {
        console.error('Failed to delete banner:', error);
        alert('Failed to delete banner');
      }
    }
  };

  const handleToggleBannerActive = async (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;

    try {
      await storage.updateBanner(id, { isActive: !banner.isActive });
      const updatedBanners = banners.map(b =>
        b.id === id ? { ...b, isActive: !b.isActive } : b
      );
      setBanners(updatedBanners);
    } catch (error) {
      console.error('Failed to toggle banner:', error);
      alert('Failed to toggle banner');
    }
  };

  const [tempSecretCode, setTempSecretCode] = useState('');

  useEffect(() => {
    setTempSecretCode(adminSettings.secretCode);
  }, [adminSettings.secretCode]);

  const handleUpdateSecretCode = async () => {
    if (!tempSecretCode || tempSecretCode.length < 6) {
      alert('Secret code must be at least 6 characters');
      return;
    }

    try {
      const success = await storage.updateAdminSettings({ secretCode: tempSecretCode });
      if (success) {
        setAdminSettings({ ...adminSettings, secretCode: tempSecretCode });
        alert('Secret code updated successfully!');
      } else {
        alert('Failed to update secret code');
      }
    } catch (error) {
      console.error('Failed to update secret code:', error);
      alert('Failed to update secret code');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: Tags },
            { id: 'banners', label: 'Banners', icon: Image },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Products ({products.length})</h2>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              {/* Product Form - Only show when explicitly triggered */}
              {showProductForm && (
                <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter image URL"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategory <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={productForm.subcategory}
                        onChange={(e) => setProductForm(prev => ({ ...prev, subcategory: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        {categories.find(c => c.name === productForm.category)?.subcategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MRP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={productForm.mrp}
                        onChange={(e) => setProductForm(prev => ({ ...prev, mrp: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selling Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={productForm.sellingPrice}
                        onChange={(e) => setProductForm(prev => ({ ...prev, sellingPrice: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Affiliate URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={productForm.affiliateUrl}
                        onChange={(e) => setProductForm(prev => ({ ...prev, affiliateUrl: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://example.com/product"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={handleCancelForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProduct}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              )}
              
              {/* Product List - Minimal View */}
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{product.code}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Categories ({categories.length})</h2>
                <button
                  onClick={handleAddCategory}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <input
                            value={category.name}
                            onChange={(e) => handleUpdateCategoryName(category.id, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                            placeholder="Category Name"
                          />
                          <span className="text-sm text-gray-500 bg-purple-100 px-2 py-1 rounded">
                            {category.subcategories.length} subcategories
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {expandedCategories.has(category.id) && (
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="space-y-2 mb-3">
                          {category.subcategories.map((subcategory, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                              <input
                                value={subcategory}
                                onChange={(e) => handleUpdateSubcategory(category.id, subcategory, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                placeholder="Subcategory name"
                              />
                              <button
                                onClick={() => handleDeleteSubcategory(category.id, subcategory)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                          <input
                            value={newSubcategoryInputs[category.id] || ''}
                            onChange={(e) => setNewSubcategoryInputs(prev => ({ ...prev, [category.id]: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory(category.id)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="Add new subcategory..."
                          />
                          <button
                            onClick={() => handleAddSubcategory(category.id)}
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Banners ({banners.length})</h2>
                <button
                  onClick={handleAddBanner}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Banner
                </button>
              </div>
              
              <div className="space-y-6">
                {banners.map((banner) => (
                  <div key={banner.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Banner Preview */}
                    <div className="relative">
                      {banner.imageUrl ? (
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/800/300';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <Image className="w-12 h-12 mx-auto mb-2" />
                            <p>No banner image</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleToggleBannerActive(banner.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            banner.isActive
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-500 text-white hover:bg-gray-600'
                          }`}
                        >
                          {banner.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>

                    {/* Banner Details */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Banner Name
                          </label>
                          <input
                            value={banner.title}
                            onChange={(e) => handleUpdateBanner(banner.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter banner name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Banner Image URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              value={banner.imageUrl}
                              onChange={(e) => handleUpdateBanner(banner.id, 'imageUrl', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter banner image URL"
                            />
                            <div className="p-2 border border-gray-300 rounded-lg bg-gray-50">
                              <Upload className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Affiliate Sale Link
                          </label>
                          <input
                            value={banner.affiliateUrl}
                            onChange={(e) => handleUpdateBanner(banner.id, 'affiliateUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter affiliate sale link"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Banner will redirect to: <span className="font-medium">{banner.affiliateUrl || 'No link set'}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Banner
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
                  <div className="text-3xl font-bold">{products.length}</div>
                  <div className="text-sm opacity-90">Total Products</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg p-6">
                  <div className="text-3xl font-bold">
                    {analytics.reduce((sum, a) => sum + a.clicks, 0)}
                  </div>
                  <div className="text-sm opacity-90">Total Clicks</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                  <div className="text-3xl font-bold">{banners.filter(b => b.isActive).length}</div>
                  <div className="text-sm opacity-90">Active Banners</div>
                </div>
              </div>
              
              <h3 className="font-semibold mb-3">Product Click Analytics</h3>
              {analytics.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No clicks recorded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {analytics
                    .sort((a, b) => b.clicks - a.clicks)
                    .map((item) => (
                      <div key={item.productId} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div>
                          <div className="font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-500">Last clicked: {new Date(item.lastClicked).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-purple-600">{item.clicks}</div>
                          <div className="text-sm text-gray-500">clicks</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secret Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempSecretCode}
                      onChange={(e) => setTempSecretCode(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter secret code (min 6 characters)"
                    />
                    <button
                      onClick={handleUpdateSecretCode}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Change this to secure admin access. Must be at least 6 characters.</p>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold mb-3">Session Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session Active:</span>
                      <span className={`font-medium ${adminSettings.sessionActive ? 'text-green-600' : 'text-red-600'}`}>
                        {adminSettings.sessionActive ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session Expires:</span>
                      <span className="font-medium">
                        {adminSettings.sessionExpiry ? new Date(adminSettings.sessionExpiry).toLocaleString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="font-semibold mb-3">Access Instructions</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Click the logo 5 times quickly to open admin panel</li>
                    <li>• Or click the hidden "Admin Access" link in the footer</li>
                    <li>• Current secret code: <span className="font-mono font-bold text-purple-600">{adminSettings.secretCode}</span></li>
                    <li>• Sessions expire after 24 hours for security</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}