import React, { useState } from 'react';
import { useAuthStore } from './stores/photoStore';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PhotoGrid from './components/PhotoGrid';
import PhotoDetail from './components/PhotoDetail';
import UploadModal from './components/UploadModal';

function App() {
  const { token, logout } = useAuthStore();
  const [showRegister, setShowRegister] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  if (!token) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* 顶部导航栏 */}
      <nav className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className="font-bold text-lg">Photo Studio</span>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white text-sm"
          >
            退出登录
          </button>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {selectedPhotoId ? (
          <PhotoDetail
            photoId={selectedPhotoId}
            onBack={() => setSelectedPhotoId(null)}
          />
        ) : (
          <PhotoGrid
            onPhotoClick={setSelectedPhotoId}
            onUpload={() => setShowUpload(true)}
          />
        )}
      </main>

      {/* 上传弹窗 */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => setSelectedPhotoId(null)}
        />
      )}
    </div>
  );
}

export default App;
