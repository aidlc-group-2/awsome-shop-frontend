import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import EmployeeLayout from '../components/Layout/EmployeeLayout';
import AdminLayout from '../components/Layout/AdminLayout';
import PageFallback from '../components/PageFallback';
import AuthGuard from './AuthGuard';

// Employee pages (lazy-loaded)
const ShopHome = lazy(() => import('../pages/ShopHome'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const RedemptionHistory = lazy(() => import('../pages/RedemptionHistory'));
const OrderDetail = lazy(() => import('../pages/OrderDetail'));
const PointsCenter = lazy(() => import('../pages/PointsCenter'));
const ConfirmRedemption = lazy(() => import('../pages/ConfirmRedemption'));
const DeliveryInfo = lazy(() => import('../pages/DeliveryInfo'));
const RedemptionSuccess = lazy(() => import('../pages/RedemptionSuccess'));

// Admin pages (lazy-loaded)
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AdminProducts = lazy(() => import('../pages/AdminProducts'));
const AdminProductDetail = lazy(() => import('../pages/AdminProductDetail'));
const AdminEditProduct = lazy(() => import('../pages/AdminEditProduct'));
const AdminCategories = lazy(() => import('../pages/AdminCategories'));
const AdminPoints = lazy(() => import('../pages/AdminPoints'));
const AdminOrders = lazy(() => import('../pages/AdminOrders'));
const AdminOrderDetail = lazy(() => import('../pages/AdminOrderDetail'));
const AdminUsers = lazy(() => import('../pages/AdminUsers'));
const AdminUserPoints = lazy(() => import('../pages/AdminUserPoints'));
const AdminTeam = lazy(() => import('../pages/AdminTeam'));

const lazyPage = (element: React.ReactNode) => (
  <Suspense fallback={<PageFallback />}>{element}</Suspense>
);

const employee = (element: React.ReactNode) => (
  <AuthGuard requiredRole="employee">{lazyPage(element)}</AuthGuard>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },

  // Employee standalone full-page flows (own nav, no shared layout)
  {
    path: '/orders/:id',
    element: employee(<OrderDetail />),
  },
  {
    path: '/redeem/confirm',
    element: employee(<ConfirmRedemption />),
  },
  {
    path: '/redeem/delivery',
    element: employee(<DeliveryInfo />),
  },
  {
    path: '/redeem/success',
    element: employee(<RedemptionSuccess />),
  },

  // Employee routes (shared top navbar via EmployeeLayout)
  {
    path: '/',
    element: (
      <AuthGuard requiredRole="employee">
        <EmployeeLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: lazyPage(<ShopHome />) },
      { path: 'products/:id', element: lazyPage(<ProductDetail />) },
      { path: 'orders', element: lazyPage(<RedemptionHistory />) },
      { path: 'points', element: lazyPage(<PointsCenter />) },
    ],
  },

  // Admin routes (shared sidebar via AdminLayout)
  {
    path: '/admin',
    element: (
      <AuthGuard requiredRole="admin">
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: lazyPage(<Dashboard />) },
      { path: 'products', element: lazyPage(<AdminProducts />) },
      { path: 'products/new', element: lazyPage(<AdminEditProduct />) },
      { path: 'products/:id', element: lazyPage(<AdminProductDetail />) },
      { path: 'products/:id/edit', element: lazyPage(<AdminEditProduct />) },
      { path: 'categories', element: lazyPage(<AdminCategories />) },
      { path: 'points', element: lazyPage(<AdminPoints />) },
      { path: 'orders', element: lazyPage(<AdminOrders />) },
      { path: 'orders/:id', element: lazyPage(<AdminOrderDetail />) },
      { path: 'users', element: lazyPage(<AdminUsers />) },
      { path: 'users/:id/points', element: lazyPage(<AdminUserPoints />) },
      { path: 'team', element: lazyPage(<AdminTeam />) },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
