import { formatCurrency } from "../utils/calculations";
import { formatDate } from "../utils/dateHelpers";
import PageHeader from "../components/ui/PageHeader";
import { useAppData } from "../context/AppDataContext";

function FuelExpensesPage() {
  const { fuelExpenses } = useAppData();

  return (
    <div>
      <PageHeader title="Fuel Expenses" description="Fuel cost scaffold for management-facing cost reviews." />
      <section className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/70 text-left text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Liters</th>
                <th className="px-5 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {fuelExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-5 py-3 text-white">{expense.vehicle}</td>
                  <td className="px-5 py-3 text-slate-300">{formatDate(expense.date)}</td>
                  <td className="px-5 py-3 text-slate-300">{expense.liters}</td>
                  <td className="px-5 py-3 text-slate-300">{formatCurrency(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default FuelExpensesPage;
