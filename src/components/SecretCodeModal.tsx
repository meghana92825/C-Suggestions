import { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface SecretCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export function SecretCodeModal({ isOpen, onClose, onSubmit }: SecretCodeModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onSubmit(code);
      setCode('');
      setError('');
    } else {
      setError('Please enter a 6-digit code');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            Admin Access
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Secret Code
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl font-mono tracking-widest"
              placeholder=""
              maxLength={6}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Access Admin Panel
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Enter the 6-digit secret code to access the admin dashboard
        </p>
      </div>
    </div>
  );
}