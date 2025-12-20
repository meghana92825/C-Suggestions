import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BannerScroller } from './components/BannerScroller';
import { ProductGrid } from './components/ProductGrid';
import { AdminModal } from './components/AdminModal';
import { SecretCodeModal } from './components/SecretCodeModal';
import { storage } from './utils/storage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  useEffect(() => {
    storage.initializeDefaults();
  }, []);

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    
    if (newCount >= 5) {
      setShowSecretModal(true);
      setLogoClickCount(0);
    }
    
    // Reset count after 2 seconds
    setTimeout(() => setLogoClickCount(0), 2000);
  };

  const handleSecretCodeSubmit = async (code: string) => {
    try {
      const settings = await storage.getAdminSettings();

      if (code === settings.secretCode) {
        setShowSecretModal(false);
        setShowAdminModal(true);
      } else {
        alert('Invalid secret code! Please try again.');
      }
    } catch (error) {
      console.error('Failed to verify secret code:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleBannerClick = (affiliateUrl: string) => {
    window.open(affiliateUrl, '_blank');
  };

  const handleAdminClose = () => {
    setShowAdminModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={setSearchQuery}
        onCategoryFilter={setCategoryFilter}
        onSubcategoryFilter={setSubcategoryFilter}
        onLogoClick={handleLogoClick}
      />
      
      <BannerScroller onBannerClick={handleBannerClick} />
      
      <main className="w-full px-0 py-8">
        <ProductGrid
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          subcategoryFilter={subcategoryFilter}
        />
      </main>

      {/* Hidden Admin Access Link */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="w-full text-center text-gray-500 text-sm">
          <p>© 2024 C-Suggestions. All rights reserved.</p>
          <button
            onClick={() => setShowSecretModal(true)}
            className="text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm opacity-0 hover:opacity-100 shadow-md hover:shadow-lg"
          >
            Admin Access
          </button>
        </div>
      </footer>

      <SecretCodeModal
        isOpen={showSecretModal}
        onClose={() => setShowSecretModal(false)}
        onSubmit={handleSecretCodeSubmit}
      />

      <AdminModal
        isOpen={showAdminModal}
        onClose={handleAdminClose}
      />
    </div>
  );
}

export default App;