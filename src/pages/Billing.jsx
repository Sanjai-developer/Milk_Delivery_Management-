import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import { fetchCustomers } from '../utils/customerUtils';
import { fetchDeliveryHistory, getMilkRate, updateMilkRate } from '../utils/deliveryUtils';
import { formatDate, formatCurrency, getMonthRange } from '../utils/dateUtils';
import { generateBillPDF } from '../utils/pdfUtils';

export default function Billing() {
  const [customers, setCustomers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(formatDate(new Date()));
  const [milkRate, setMilkRate] = useState(null);
  const [newRate, setNewRate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const [customersData, rateData] = await Promise.all([
        fetchCustomers(),
        getMilkRate()
      ]);
      setCustomers(customersData);
      setMilkRate(rateData);
      setNewRate(rateData.rate_per_liter);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  const handleUpdateRate = async () => {
    try {
      const updatedRate = await updateMilkRate(Number(newRate));
      setMilkRate(updatedRate);
      alert('Rate updated successfully!');
    } catch (error) {
      console.error('Error updating rate:', error);
      alert('Error updating rate');
    }
  };

  const handleGenerateBill = async (customer) => {
    setLoading(true);
    try {
      const { start, end } = getMonthRange(selectedMonth);
      const deliveries = await fetchDeliveryHistory(customer.id, start, end);
      
      const doc = generateBillPDF(
        customer,
        deliveries,
        milkRate.rate_per_liter,
        formatDate(selectedMonth)
      );
      
      doc.save(`bill-${customer.name}-${formatDate(selectedMonth)}.pdf`);
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('Error generating bill');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Customer Name' },
    { key: 'phone', label: 'Phone' }
  ];

  const renderActions = (customer) => (
    <Button
      onClick={() => handleGenerateBill(customer)}
      disabled={loading}
    >
      Generate Bill
    </Button>
  );

  return (
    <div className="space-y-6">
      <Card title="Update Milk Rate">
        <div className="flex items-end gap-4">
          <Input
            label="Rate per liter"
            type="number"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
            min="0"
            step="0.5"
          />
          <Button onClick={handleUpdateRate}>
            Update Rate
          </Button>
        </div>
        {milkRate && (
          <p className="mt-4 text-sm text-gray-600">
            Current rate: {formatCurrency(milkRate.rate_per_liter)} per liter
          </p>
        )}
      </Card>

      <Card title="Generate Bills">
        <div className="space-y-6">
          <Input
            type="month"
            label="Select Month"
            value={selectedMonth.substring(0, 7)}
            onChange={(e) => setSelectedMonth(`${e.target.value}-01`)}
          />
          
          <Table
            columns={columns}
            data={customers}
            actions={renderActions}
          />
        </div>
      </Card>
    </div>
  );
}