import React, { useState, useEffect } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';
import { photosApi } from '../api/client';

interface PhotoDetailProps {
  photoId: number;
  onBack: () => void;
}

interface JpgVersion {
  id: number;
  jpgFilename: string;
  storedJpgPath: string;
  styleName: string;
  width: number;
  height: number;
}

export default function PhotoDetail({ photoId, onBack }: PhotoDetailProps) {
  const [photo, setPhoto] = useState<any>(null);
  const [jpgVersions, setJpgVersions] = useState<JpgVersion[]>([]);
  const [compareIndex, setCompareIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhoto();
  }, [photoId]);

  const loadPhoto = async () => {
    try {
      const res = await photosApi.getById(photoId);
      setPhoto(res.data.photo);
      setJpgVersions(res.data.jpgVersions);
    } catch (err) {
      alert('加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">加载中...</div>;
  }

  if (!photo) {
    return <div className="p-8 text-center">照片不存在</div>;
  }

  const rawUrl = `http://localhost:3000/api/photos/files/${photo.storedRawPath.split('/').pop()}`;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧 - 图片展示 */}
        <div className="lg:col-span-2">
          <div className="bg-dark-800 rounded-lg overflow-hidden">
            {jpgVersions.length >= 1 ? (
              jpgVersions.length === 1 ? (
                <img
                  src={`http://localhost:3000/api/photos/files/${jpgVersions[0].storedJpgPath.split('/').pop()}`}
                  alt={photo.title}
                  className="w-full"
                />
              ) : (
                <ReactCompareSlider
                  itemOne={
                    <img
                      src={`http://localhost:3000/api/photos/files/${jpgVersions[0].storedJpgPath.split('/').pop()}`}
                      alt="JPG 1"
                      className="w-full"
                    />
                  }
                  itemTwo={
                    <img
                      src={`http://localhost:3000/api/photos/files/${jpgVersions[1].storedJpgPath.split('/').pop()}`}
                      alt="JPG 2"
                      className="w-full"
                    />
                  }
                />
              )
            ) : (
              <div className="aspect-video bg-dark-700 flex items-center justify-center text-gray-400">
                暂无 JPG 预览
              </div>
            )}
          </div>

          {jpgVersions.length > 2 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {jpgVersions.map((jpg, idx) => (
                <button
                  key={jpg.id}
                  onClick={() => setCompareIndex(idx)}
                  className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                    compareIndex === idx
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {jpg.styleName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 右侧 - 信息 */}
        <div className="space-y-4">
          <div className="bg-dark-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{photo.title || photo.rawFilename}</h2>
            
            {photo.comment && (
              <p className="text-gray-300 mb-4">{photo.comment}</p>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">文件名</span>
                <span className="text-white">{photo.rawFilename}</span>
              </div>
              {photo.iso && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ISO</span>
                  <span className="text-white">{photo.iso}</span>
                </div>
              )}
              {photo.aperture && (
                <div className="flex justify-between">
                  <span className="text-gray-400">光圈</span>
                  <span className="text-white">{photo.aperture}</span>
                </div>
              )}
              {photo.shutterSpeed && (
                <div className="flex justify-between">
                  <span className="text-gray-400">快门</span>
                  <span className="text-white">{photo.shutterSpeed}</span>
                </div>
              )}
              {photo.focalLength && (
                <div className="flex justify-between">
                  <span className="text-gray-400">焦距</span>
                  <span className="text-white">{photo.focalLength}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">上传时间</span>
                <span className="text-white">{new Date(photo.createdAt).toLocaleString('zh-CN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 rounded-lg p-6">
            <h3 className="font-bold mb-3">JPG 版本 ({jpgVersions.length})</h3>
            <ul className="space-y-2">
              {jpgVersions.map((jpg) => (
                <li key={jpg.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">{jpg.styleName}</span>
                  <span className="text-gray-400">{jpg.width}×{jpg.height}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
