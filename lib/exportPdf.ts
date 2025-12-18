import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportToPDF(elementId: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const canvas = await html2canvas(el);
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF();
  pdf.addImage(img, "PNG", 10, 10, 190, 0);
  pdf.save("report.pdf");
}
