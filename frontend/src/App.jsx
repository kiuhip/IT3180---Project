import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Households from './pages/Households';
import Residents from './pages/Residents';
import Fees from './pages/Fees';
import Payments from './pages/Payments';
import Statistics from './pages/Statistics';
import Layout from './components/Layout';
import TamTru from './pages/TamTru';
import TamVang from './pages/TamVang';
import PhiDongGop from './pages/PhiDongGop';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="households" element={<Households />} />
        <Route path="residents" element={<Residents />} />
        <Route path="fees" element={<Fees />} />
        <Route path="payments" element={<Payments />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="tamtru" element={<TamTru />} />
        <Route path="tamvang" element={<TamVang />} />
        <Route path="phidonggop" element={<PhiDongGop />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

