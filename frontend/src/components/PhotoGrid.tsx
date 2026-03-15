import React, { useEffect } from 'react';
import { photosApi } from '../api/client';
import { usePhotoStore } from '../stores/photoStore';

interface PhotoGridProps {
  onPhotoClick: (id: number) => void;
  onUpload: () => void;
}

export default function PhotoGrid({ onPhotoClick, onUpload }: PhotoGridProps) {
  const { photos, loading, error, setPhotos, setLoading, setError } = usePhotoStore();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const res = await photosApi.getList();
      setPhotos(res.data.photos);
    } catch (err: any) {
      setError(err.response?.data?.error || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('确定要删除这张照片吗？')) return;
    
    try {
      await photosApi.delete(id);
      loadPhotos();
    } catch (err: any) {
      alert('删除失败');
    }
  };

  if (loading && photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">我的图库</h2>
        <button
          onClick={onUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + 上传照片
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-gray-400 mb-4">还没有照片</p>
          <button
            onClick={onUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            上传第一张照片
          </button>
        </div>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onPhotoClick(photo.id)}
              className="relative group cursor-pointer bg-dark-800 rounded-lg overflow-hidden"
            >
              <img
                src={`http://localhost:3000/api/photos/files/${photo.thumbnailPath.split('/').pop()}`}
                alt={photo.title || photo.rawFilename}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-white font-medium truncate">{photo.title || photo.rawFilename}</p>
                <p className="text-gray-400 text-sm">{photo.jpgCount} 个 JPG 版本</p>
              </div>
              <button
                onClick={(e) => handleDelete(e, photo.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
