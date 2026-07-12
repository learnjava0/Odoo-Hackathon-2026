import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="panel max-w-xl p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-600">403</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Access blocked for your current role</h1>
        <p className="mt-3 text-slate-600">TransitOps hides restricted pages from navigation and routes you here when access is outside your role scope.</p>
        <Link to="/">
          <Button className="mt-6">Return to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
