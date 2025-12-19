// Get subcategories for selected category in product form
const currentFormSubcategories = categories.find(c => c.name === productForm.category)?.subcategories || [];

// Category dropdown change handler
onChange={(e) => {
  setProductForm({ 
    ...productForm, 
    category: e.target.value, 
    subcategory: '' // Reset subcategory when category changes
  });
}}

// Subcategory dropdown
<select
  value={productForm.subcategory}
  onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
  disabled={!productForm.category}
  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
>
  <option value="">Select Subcategory</option>
  {currentFormSubcategories.map((subcategory) => (
    <option key={subcategory} value={subcategory}>
      {subcategory}
    </option>
  ))}
</select>