import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { fetchCustomers } from '../utils/customerUtils';
import { recordDeliveries } from '../utils/deliveryUtils';
import { Minus, Plus } from 'lucide-react';

export default function DailyDelivery() {
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const data = await fetchCustomers();
      const initialDeliveries = {};
      data.forEach(customer => {
        initialDeliveries[customer.id] = customer.default_qty;
      });
      setCustomers(data);
      setDeliveries(initialDeliveries);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }

  const handleQuantityChange = (customerId, change) => {
    setDeliveries(prev => ({
      ...prev,
      [customerId]: Math.max(0, Number(prev[customerId]) + change)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const deliveryRecords = Object.entries(deliveries).map(([customer_id, qty_delivered]) => ({
        customer_id,
        qty_delivered,
        delivery_date: new Date().toISOString().split('T')[0]
      }));
      await recordDeliveries(deliveryRecords);
      alert('Delivery records saved successfully!');
    } catch (error) {
      console.error('Error saving delivery records:', error);
      alert('Error saving delivery records');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card title="Daily Delivery">
        <div className="space-y-4">
          {customers.map(customer => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <span className="font-medium">{customer.name}</span>
              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => handleQuantityChange(customer.id, -0.5)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-medium">
                  {deliveries[customer.id]} L
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handleQuantityChange(customer.id, 0.5)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end pt-6">
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Delivery Records'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}