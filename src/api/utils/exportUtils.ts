import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ROBOTO_REGULAR_BASE64 } from "../../assets/fonts/robotoFont";
import type { TableColumn } from "../../types/TableColumn.ts";

function registerPolishFont(doc: jsPDF) {
  doc.addFileToVFS("Roboto-Regular.ttf", ROBOTO_REGULAR_BASE64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");
}

export function exportToPdf<T>(
  title: string,
  columns: TableColumn<T>[],
  rows: T[],
  fileName: string,
) {
  const exportable = columns.filter((c) => c.exportValue);
  const doc = new jsPDF({ orientation: "landscape" });
  registerPolishFont(doc);

  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.text(`Wygenerowano: ${new Date().toLocaleString("pl-PL")}`, 14, 21);

  autoTable(doc, {
    startY: 26,
    head: [exportable.map((c) => c.header)],
    body: rows.map((row) => exportable.map((c) => String(c.exportValue!(row)))),
    styles: { font: "Roboto", fontSize: 8 },
    headStyles: { fillColor: [107, 16, 32] },
  });

  doc.save(`${fileName}.pdf`);
}

export function exportToXlsx<T>(
  columns: TableColumn<T>[],
  rows: T[],
  fileName: string,
) {
  const exportable = columns.filter((c) => c.exportValue);
  const data = rows.map((row) =>
    Object.fromEntries(exportable.map((c) => [c.header, c.exportValue!(row)])),
  );
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dane");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
