import jsPDF from 'jspdf';

export function generateBackgroundPdf(data) {
  const doc = new jsPDF({ format: 'a4', unit: 'pt', orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.name || '', pageWidth / 2, y + 16, { align: 'center' });
  y += 36;

  // Description box
  if (data.description) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(data.description, contentWidth - 12);
    const descH = Math.max(50, descLines.length * 14 + 16);
    doc.rect(margin, y, contentWidth, descH);
    doc.text(descLines, margin + 6, y + 14);
    y += descH + 14;
  }

  // Possessions
  if (data.possessions?.length > 0) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Possessions', margin, y + 12);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    data.possessions.forEach((p) => {
      doc.text(`•  ${p}`, margin + 8, y);
      y += 15;
    });
    y += 8;
  }

  // Advanced Skills
  if (data.advancedSkills?.length > 0) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Advanced Skills', margin, y + 12);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    data.advancedSkills.forEach((s) => {
      doc.text(s, margin + 8, y);
      y += 15;
    });
    y += 8;
  }

  // Special
  if (data.special) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Special', margin, y + 12);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const specialLines = doc.splitTextToSize(data.special, contentWidth);
    doc.text(specialLines, margin, y);
  }

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

export default generateBackgroundPdf;
