export default function Table({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {actions && <th className="relative px-6 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={`${row.id}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}