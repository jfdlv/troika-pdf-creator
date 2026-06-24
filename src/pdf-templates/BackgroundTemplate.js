import jsPDF from 'jspdf';

const formatSkillName = (key) => {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export function generateBackgroundPdf(data) {
  const doc = new jsPDF({ format: 'a4', unit: 'pt', orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const title = data.backgroundName || data.name || '';

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, y + 16, { align: 'center' });
  y += 36;

  if (data.description) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(data.description, contentWidth - 12);
    const descH = Math.max(50, descLines.length * 14 + 16);
    doc.rect(margin, y, contentWidth, descH);
    doc.text(descLines, margin + 6, y + 14);
    y += descH + 14;
  }

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

  const advancedSkills = data.advancedSkills;
  if (advancedSkills && Object.keys(advancedSkills).length > 0) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Advanced Skills', margin, y + 12);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    Object.entries(advancedSkills).forEach(([key, value]) => {
      doc.text(`${value}  ${formatSkillName(key)}`, margin + 8, y);
      y += 15;
    });
    y += 8;
  }

  if (data.special) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Special', margin, y + 12);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const specialLines = doc.splitTextToSize(data.special, contentWidth);
    doc.text(specialLines, margin, y);
    y += specialLines.length * 14 + 8;
  }

  const mien = (data.mien || []).filter(Boolean);
  if (mien.length > 0) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Mien', margin, y + 12);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    mien.forEach((entry, i) => {
      doc.text(`${i + 1}.  ${entry}`, margin + 8, y);
      y += 15;
    });
  }

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

export default generateBackgroundPdf;
