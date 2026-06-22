import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import AdminLayout from '@/layouts/admin-layout';
import UserLayout from '@/layouts/user-layout';
import AdminAlbumsPage from '@/pages/admin/albums';
import AdminUsersPage from '@/pages/admin/users';
import AlbumsPage from '@/pages/albums';
import CollectionPage from '@/pages/collection/[userAlbumId]';
import LoginPage from '@/pages/login';
import ProfilePage from '@/pages/profile';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <UserLayout />,
    children: [
      { path: '/albums', element: <AlbumsPage /> },
      { path: '/collection/:userAlbumId', element: <CollectionPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'albums', element: <AdminAlbumsPage /> },
      { path: 'users', element: <AdminUsersPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
