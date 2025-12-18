import * as XLSX from "xlsx";

export function exportToExcel(data: any[], name: string) {
  const sheet = XLSX.utils.json_to_sheet(data);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Report");
  XLSX.writeFile(book, `${name}.xlsx`);
}
