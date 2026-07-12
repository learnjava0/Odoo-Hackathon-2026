import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function header(doc, title) {
  doc.setFillColor(251, 191, 36); // amber-400
  doc.rect(0, 0, 210, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("TransitOps — " + title, 14, 12);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Generated " + new Date().toLocaleString("en-IN"), 148, 12);
}

function currency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value ?? 0);
}

export function exportAnalyticsPdf({ fuelEfficiencyRows, operationalRows, roiRows, costPerVehicle, monthlyBreakdown, kpis }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  header(doc, "Reports & Analytics");

  // KPI summary row
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  const kpiLabels = ["Fuel Efficiency", "Fleet Utilization", "Operational Cost", "Vehicle ROI"];
  const kpiValues = [kpis.fuelEfficiency, kpis.fleetUtilization, kpis.operationalCost, kpis.vehicleRoi];
  kpiLabels.forEach((label, i) => {
    const x = 14 + i * 46;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, 22, 42, 18, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(label, x + 3, 28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(kpiValues[i], x + 3, 36);
  });

  // Fuel Efficiency table
  autoTable(doc, {
    startY: 46,
    head: [["Vehicle", "Fuel Efficiency (km/l)"]],
    body: fuelEfficiencyRows.map((r) => [r.vehicle, r.efficiency]),
    headStyles: { fillColor: [251, 191, 36], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
    tableWidth: 88,
    theme: "striped",
    didDrawPage: (data) => { if (data.pageNumber > 1) header(doc, "Reports & Analytics"); },
  });

  // Operational Cost table  
  autoTable(doc, {
    startY: 46,
    head: [["Category", "Amount"]],
    body: operationalRows.map((r) => [r.category, currency(r.amount)]),
    headStyles: { fillColor: [251, 191, 36], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 110, right: 14 },
    tableWidth: 86,
    theme: "striped",
  });

  const afterFirstTables = doc.lastAutoTable.finalY + 8;

  // Vehicle ROI table
  autoTable(doc, {
    startY: afterFirstTables,
    head: [["Vehicle", "ROI (%)"]],
    body: roiRows.map((r) => [r.vehicle, r.roi]),
    headStyles: { fillColor: [251, 191, 36], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
    tableWidth: 88,
    theme: "striped",
  });

  // Top Cost per Vehicle table
  autoTable(doc, {
    startY: afterFirstTables,
    head: [["Vehicle", "Total Cost"]],
    body: [...costPerVehicle].sort((a, b) => b.value - a.value).slice(0, 6).map((r) => [r.vehicle, currency(r.value)]),
    headStyles: { fillColor: [251, 191, 36], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 110, right: 14 },
    tableWidth: 86,
    theme: "striped",
  });

  const afterSecondTables = doc.lastAutoTable.finalY + 8;

  // Monthly Revenue table
  autoTable(doc, {
    startY: afterSecondTables,
    head: [["Month", "Revenue"]],
    body: monthlyBreakdown.map((r) => [r.label, currency(r.value)]),
    headStyles: { fillColor: [251, 191, 36], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
    tableWidth: 88,
    theme: "striped",
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}  |  TransitOps Fleet Management`, 14, 290);
  }

  doc.save("transitops-analytics.pdf");
}
