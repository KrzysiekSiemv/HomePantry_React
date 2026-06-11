import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PantryPage from './pages/PantryPage';
import AddProductPage from './pages/AddProductPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Navigate to="/pantry" replace />} />
        <Route path="pantry" element={<PantryPage />} />
        <Route path="add" element={<AddProductPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={
            <div className='text-center py-5'>
              <h2>404 - Strona nie istnieje</h2>
            </div>
        } />
      </Route>
    </Routes>
  );
}