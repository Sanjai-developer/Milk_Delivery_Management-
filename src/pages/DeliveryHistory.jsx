import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import { fetchDeliveryHistory } from '../utils/deliveryUtils';
import { formatDate } from '../utils/dateUtils';

export default function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: formatDate(new Date()),
    end: formatDate(new Date())
  });

  useEffect(() => {
    loadDeliveries();
  }, [dateRange]);

  async function loadDeliveries() {
    try {
      const data = await fetchDeliveryHistory(null, dateRange.start, dateRange.end);
      setDeliveries(data);
    } catch (error) {
      console.error('Error loading delivery history:', error);
    }
  }

  const columns = [
    { 
      key: 'delivery_date',
      label: 'Date',
      render: (row) => formatDate(row.delivery_date)
    },
    { 
      key: 'customer',
      label: 'Customer',
      render: (row) => row.customers.name
    },
    { key: 'qty_delivered', label: 'Quantity (L)' }
  ];

  return (
    <div className="space-y-6">
      <Card title="Delivery History">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                start: e.target.value
              }))}
            />
            <Input
              type="date"
              label="End Date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                end: e.target.value
              }))}
            />
          </div>
          
          <Table
            columns={columns}
            data={deliveries}
          />
        </div>
      </Card>
    </div>
  );
}