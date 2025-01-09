import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Milk, Users, Calendar, History, FileText, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Milk className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Milk Delivery</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Users className="h-5 w-5" />
                <span>Customers</span>
              </Link>
              
              <Link to="/daily-delivery" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Calendar className="h-5 w-5" />
                <span>Daily Delivery</span>
              </Link>
              
              <Link to="/delivery-history" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <History className="h-5 w-5" />
                <span>History</span>
              </Link>
              
              <Link to="/billing" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FileText className="h-5 w-5" />
                <span>Billing</span>
              </Link>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}