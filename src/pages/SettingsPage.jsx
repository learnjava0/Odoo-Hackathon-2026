import PageHeader from "../components/ui/PageHeader";

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Admin-only placeholder for configuration and policy controls." />
      <section className="panel panel-body">
        <p className="text-sm text-slate-300">
          This page is intentionally light for the scaffold commit and is ready for settings modules later.
        </p>
      </section>
    </div>
  );
}

export default SettingsPage;
