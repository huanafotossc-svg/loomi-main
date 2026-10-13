import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CreatorLayout, HotelLayout, AuthLayout } from './layouts';

// Auth Screens
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LandingScreen } from './screens/LandingScreen';

// Creator Screens
import { FeedScreen } from './screens/FeedScreen';
import { JobDetailsScreen } from './screens/JobDetailsScreen';
import { ChatScreen } from './screens/ChatScreen';
import { CreatorProfileScreen } from './screens/CreatorProfileScreen';
import { SavedJobsScreen } from './screens/SavedJobsScreen';
import { ApplicationsScreen } from './screens/ApplicationsScreen';
import { SearchDiscoveryScreen } from './screens/SearchDiscoveryScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { EarningsScreen } from './screens/EarningsScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { JobDeliveryScreen } from './screens/JobDeliveryScreen';
import { PortfolioManagementScreen } from './screens/PortfolioManagementScreen';
import { CreatorSettingsScreen } from './screens/CreatorSettingsScreen';
import { HotelPublicProfileScreen } from './screens/HotelPublicProfileScreen';
import { PackageManagementScreen } from './screens/PackageManagementScreen';
import { CreatorPublicProfileScreen } from './screens/CreatorPublicProfileScreen';

// Hotel Screens
import { HotelDashboardScreen } from './screens/HotelDashboardScreen';
import { CreateJobWizard } from './screens/CreateJobWizard';
import { JobManagementScreen } from './screens/JobManagementScreen';
import { ApplicantsListScreen } from './screens/ApplicantsListScreen';
import { HotelProfileScreen } from './screens/HotelProfileScreen';
import { HotelSettingsScreen } from './screens/HotelSettingsScreen';
import { TeamManagementScreen } from './screens/TeamManagementScreen';
import { BillingPaymentScreen } from './screens/BillingPaymentScreen';
import { HotelDeliveryReviewScreen } from './screens/HotelDeliveryReviewScreen';
import { ReviewsRatingsScreen } from './screens/ReviewsRatingsScreen';
import { HotelAnalyticsReportsScreen } from './screens/HotelAnalyticsReportsScreen';
import { HelpSupportScreen } from './screens/HelpSupportScreen';
import { TermsPrivacyScreen } from './screens/TermsPrivacyScreen';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
          </Route>

          {/* Creator Routes - with layout */}
          <Route element={<CreatorLayout />}>
            <Route path="/feed" element={<FeedScreen />} />
            <Route path="/job/:jobId" element={<JobDetailsScreen />} />
            <Route path="/hotel/:hotelId" element={<HotelPublicProfileScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/chat/:chatId" element={<ChatScreen />} />
            <Route path="/profile" element={<CreatorProfileScreen />} />
            <Route path="/edit-profile" element={<EditProfileScreen />} />
            <Route path="/saved" element={<SavedJobsScreen />} />
            <Route path="/applications" element={<ApplicationsScreen />} />
            <Route path="/search" element={<SearchDiscoveryScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/earnings" element={<EarningsScreen />} />
            <Route path="/portfolio" element={<PortfolioManagementScreen />} />
            <Route path="/manage-packages" element={<PackageManagementScreen />} />
            <Route path="/creator-settings" element={<CreatorSettingsScreen />} />
            <Route path="/job/:jobId/delivery" element={<JobDeliveryScreen />} />
            <Route path="/help" element={<HelpSupportScreen />} />
            <Route path="/terms" element={<TermsPrivacyScreen />} />
            <Route path="/reviews" element={<ReviewsRatingsScreen />} />
          </Route>

          {/* Hotel Routes - with layout */}
          <Route element={<HotelLayout />}>
            <Route path="/dashboard" element={<HotelDashboardScreen />} />
            <Route path="/create-job" element={<CreateJobWizard />} />
            <Route path="/jobs" element={<JobManagementScreen />} />
            <Route path="/job/:jobId/manage" element={<JobManagementScreen />} />
            <Route path="/job/:jobId/applicants" element={<ApplicantsListScreen />} />
            <Route path="/applicants" element={<ApplicantsListScreen />} />
            <Route path="/hotel-chat" element={<ChatScreen />} />
            <Route path="/analytics" element={<HotelAnalyticsReportsScreen />} />
            <Route path="/delivery-review" element={<HotelDeliveryReviewScreen />} />
            <Route path="/hotel-settings" element={<HotelSettingsScreen />} />
            <Route path="/billing" element={<BillingPaymentScreen />} />
            <Route path="/team" element={<TeamManagementScreen />} />
            <Route path="/hotel-profile" element={<HotelProfileScreen />} />
            <Route path="/creator/:creatorId" element={<CreatorPublicProfileScreen />} />
          </Route>

          {/* Landing Page */}
          <Route path="/" element={<LandingScreen />} />
          <Route path="/landing" element={<LandingScreen />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
