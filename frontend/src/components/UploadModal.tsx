import React, { useState, useRef } from 'react';
import { photosApi } from '../api/client';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [jpgFiles, setJpgFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [iso, setIso] = useState('');
  const [aperture, setAperture] = useState('');
  const [shutterSpeed, setShutterSpeed] = useState('');
  const [focalLength, setFocalLength] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const jpgInputRef = useRef<HTMLInputElement>(null);

  const handleRawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setRawFile(e.target.files[0]);
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^.]+$/, ''));
      }
    }
  };

  const handleJpgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setJpgFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawFile) {
      setError('请选择 RAW 文件');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('raw', rawFile);
    jpgFiles.forEach((file) => formData.append('jpg', file));
    formData.append('title', title);
    formData.append('comment', comment);
    if (iso) formData.append('iso', iso);
    if (aperture) formData.append('aperture', aperture);
    if (shutterSpeed) formData.append('shutterSpeed', shutterSpeed);
    if (focalLength) formData.append('focalLength', focalLength);

    try {
      await photosApi.upload(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">上传照片</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 text-red-200 p-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* RAW 文件上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                RAW 文件 (ARW) *
              </label>
              <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".arw,.cr2,.cr3,.nef,.dng"
                  onChange={handleRawChange}
                  className="hidden"
                  id="raw-input"
                  required
                />
                <label htmlFor="raw-input" className="cursor-pointer">
                  {rawFile ? (
                    <div className="text-green-400">✓ {rawFile.name}</div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📁</div>
                      <div className="text-gray-400">点击选择 RAW 文件</div>
                      <div className="text-xs text-gray-500 mt-1">支持 ARW, CR2, CR3, NEF, DNG</div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* JPG 文件上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                JPG 版本 (可选，可多选)
              </label>
              <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".jpg,.jpeg"
                  multiple
                  onChange={handleJpgChange}
                  className="hidden"
                  id="jpg-input"
                  ref={jpgInputRef}
                />
                <label htmlFor="jpg-input" className="cursor-pointer">
                  {jpgFiles.length > 0 ? (
                    <div className="text-green-400">✓ 已选择 {jpgFiles.length} 个文件</div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">🖼️</div>
                      <div className="text-gray-400">点击选择 JPG 文件</div>
                      <div className="text-xs text-gray-500 mt-1">支持多个调色的 JPG 版本</div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* 元数据 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ISO</label>
                <input
                  type="number"
                  value={iso}
                  onChange={(e) => setIso(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                  placeholder="如：100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">光圈</label>
                <input
                  type="text"
                  value={aperture}
                  onChange={(e) => setAperture(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                  placeholder="如：f/2.8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">快门</label>
                <input
                  type="text"
                  value={shutterSpeed}
                  onChange={(e) => setShutterSpeed(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                  placeholder="如：1/250"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">焦距</label>
                <input
                  type="text"
                  value={focalLength}
                  onChange={(e) => setFocalLength(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                  placeholder="如：35mm"
                />
              </div>
            </div>

            {/* 标题和备注 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                placeholder="照片标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">备注</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                rows={3}
                placeholder="拍摄说明、想法等"
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !rawFile}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {uploading ? '上传中...' : '上传'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
