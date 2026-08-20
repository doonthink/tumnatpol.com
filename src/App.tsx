import { Profile } from './admin/profile/Profile';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { AdminLayout } from './admin/AdminLayout';
import { PageList } from './admin/pages/PageList';
import { PageForm } from './admin/pages/PageForm';
import { BlogList } from './admin/blogs/BlogList';
import { BlogForm } from './admin/blogs/BlogForm';
import { CategoryList } from './admin/categories/CategoryList';
import { ServiceList } from './admin/services/ServiceList';
import { ServiceForm } from './admin/services/ServiceForm';
import { ServiceCategoryList } from './admin/services/ServiceCategoryList';
import { Services } from './pages/Services';
import { SingleService } from './pages/SingleService';
import { Blog } from './pages/Blog';
import { SingleBlog } from './pages/SingleBlog';
import { VideoGallery } from './pages/video/VideoGallery';
import { VideoDetail } from './pages/video/VideoDetail';
import { DynamicPage } from './pages/DynamicPage';
import { Register } from './pages/Register';
import BusinessHelpCheck from './pages/BusinessHelpCheck';

// New Admin Pages
import { Dashboard } from './admin/dashboard/Dashboard';
import { MembershipList } from './admin/membership/MembershipList';
import { MembershipForm } from './admin/membership/MembershipForm';
import { FinancialDashboard } from './admin/financial/FinancialDashboard';
import { SettingsPage } from './admin/settings/SettingsPage';
import { AnalyticsDashboard } from './admin/analytics/AnalyticsDashboard';
import { MediaLibrary } from './admin/media/MediaLibrary';
import { PackageList } from './admin/packages/PackageList';
import { PackageForm } from './admin/packages/PackageForm';
import { BannerList } from './admin/banners/BannerList';
import { VideoList } from './admin/videos/VideoList';
import { VideoForm } from './admin/videos/VideoForm';
import { VideoCategoryList } from './admin/videos/VideoCategoryList';
import { NewsletterList } from './admin/newsletters/NewsletterList';
import { BusinessCheckList } from './admin/business-checks/BusinessCheckList';

import { Login } from './admin/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:slug" element={<SingleService />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<SingleBlog />} />
          <Route path="/video" element={<VideoGallery />} />
          <Route path="/video/:slug" element={<VideoDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/business-help-check" element={<BusinessHelpCheck />} />
          
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="banners" element={<BannerList />} />
              <Route path="pages" element={<PageList />} />
              <Route path="pages/new" element={<PageForm />} />
              <Route path="pages/edit/:id" element={<PageForm />} />
              
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/new" element={<BlogForm />} />
              <Route path="blogs/edit/:id" element={<BlogForm />} />
              
              <Route path="categories" element={<CategoryList />} />
              
              <Route path="services" element={<ServiceList />} />
              <Route path="services/new" element={<ServiceForm />} />
              <Route path="services/edit/:id" element={<ServiceForm />} />
              <Route path="service-categories" element={<ServiceCategoryList />} />
              
              <Route path="membership" element={<MembershipList />} />
              <Route path="membership/:id" element={<MembershipForm />} />
              <Route path="financial" element={<FinancialDashboard />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="newsletters" element={<NewsletterList />} />
              <Route path="videos" element={<VideoList />} />
              <Route path="videos/create" element={<VideoForm />} />
              <Route path="videos/edit/:id" element={<VideoForm />} />
              <Route path="video-categories" element={<VideoCategoryList />} />
              <Route path="packages" element={<PackageList />} />
              <Route path="packages/:id" element={<PackageForm />} />
              <Route path="business-checks" element={<BusinessCheckList />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="/:slug" element={<DynamicPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}
