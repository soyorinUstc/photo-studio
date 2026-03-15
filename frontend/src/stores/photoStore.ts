import { create } from 'zustand';

interface Photo {
  id: number;
  rawFilename: string;
  thumbnailPath: string;
  title: string | null;
  comment: string | null;
  jpgCount: number;
  createdAt: string;
}

interface PhotoState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  
  setPhotos: (photos: Photo[]) => void;
  addPhoto: (photo: Photo) => void;
  removePhoto: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePhotoStore = create<PhotoState>((set) => ({
  photos: [],
  loading: false,
  error: null,
  
  setPhotos: (photos) => set({ photos }),
  addPhoto: (photo) => set((state) => ({ photos: [photo, ...state.photos] })),
  removePhoto: (id) => set((state) => ({ 
    photos: state.photos.filter(p => p.id !== id) 
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));

interface AuthState {
  user: { id: number; username: string; role: string } | null;
  token: string | null;
  
  setUser: (user: { id: number; username: string; role: string } | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));
