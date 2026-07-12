import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";

function ForbiddenPage() {
  return (
    <div>
      <PageHeader title="Forbidden" description="Role-based access guard placeholder." />
      <section className="panel panel-body">
        <p className="text-sm text-slate-300">You do not have access to this section with the current role.</p>
        <Link className="mt-4 inline-block text-sm font-medium text-cyan-400" to="/dashboard">
          Return to dashboard
        </Link>
      </section>
    </div>
  );
}

export default ForbiddenPage;
