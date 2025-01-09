import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { createCustomer } from '../utils/customerUtils';
import { useAuth } from '../contexts/AuthContext';

export default function AddCustomer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    default_qty: '1'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer({
        ...formData,
        user_id: user.id,
        default_qty: Number(formData.default_qty)
      });
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Add New Customer">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          )}
          
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Default Quantity (liters)"
            type="number"
            name="default_qty"
            value={formData.default_qty}
            onChange={handleChange}
            min="0"
            step="0.5"
            required
          />
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Customer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}