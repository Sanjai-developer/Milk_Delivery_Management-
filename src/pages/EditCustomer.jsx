import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { fetchCustomer, updateCustomer } from '../utils/customerUtils';

export default function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    default_qty: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadCustomer();
  }, [id]);

  async function loadCustomer() {
    try {
      const customer = await fetchCustomer(id);
      setFormData(customer);
    } catch (error) {
      setError('Error loading customer');
      console.error(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(id, {
        ...formData,
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
      <Card title="Edit Customer">
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
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}