import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, History } from 'lucide-react';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import { fetchCustomers, deleteCustomer } from '../utils/customerUtils';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        await loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'default_qty', label: 'Default Qty' },
  ];

  const renderActions = (customer) => (
    <>
      <Button
        variant="secondary"
        onClick={() => navigate(`/customers/edit/${customer.id}`)}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={() => navigate(`/customers/history/${customer.id}`)}
      >
        <History className="h-4 w-4" />
      </Button>
      <Button
        variant="danger"
        onClick={() => handleDelete(customer.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <Link to="/customers/add">
          <Button>Add Customer</Button>
        </Link>
      </div>
      <Card>
        <Table
          columns={columns}
          data={customers}
          actions={renderActions}
        />
      </Card>
    </div>
  );
}