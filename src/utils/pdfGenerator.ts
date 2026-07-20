import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFConfig {
  title: string;
  filename: string;
  columns: string[];
  data: any[][];
}

export const generatePDF = ({ title, filename, columns, data }: PDFConfig) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('es-EC');

  // Título
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // text-slate-800
  doc.text(title, 14, 22);

  // Fecha
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // text-slate-500
  doc.text(`Fecha de generación: ${date}`, 14, 30);

  // Tabla
  autoTable(doc, {
    startY: 40,
    head: [columns],
    body: data,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229], // bg-indigo-600
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [51, 65, 85], // text-slate-700
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // bg-slate-50
    },
  });

  // Pie de página
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // text-slate-400
    doc.text(
      `Página ${i} de ${pageCount} - Sistema de Condominio`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Guardar PDF
  doc.save(filename);
};
