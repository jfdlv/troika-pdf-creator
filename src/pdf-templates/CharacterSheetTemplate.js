import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import _ from 'lodash';

export function generateCharacterSheetPdf(characterInfo, damageTable) {
  const doc = new jsPDF({ format: 'letter', unit: 'pt', orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // --- Build derived data ---
  const advancedSkillsObject = {};
  const weaponsArray = [];
  let possessions = [...(characterInfo.background?.possessions || [])];

  for (const key in characterInfo.background?.advancedSkills) {
    const formatted = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    advancedSkillsObject[formatted] = characterInfo.background.advancedSkills[key];
    if (formatted.includes('Fighting')) {
      weaponsArray.push(formatted.replace('Fighting', '').trim());
    }
  }

  while (possessions.length < 12) possessions.push('');

  // --- Header: Name + Background ---
  const halfW = contentWidth / 2 - 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  doc.rect(margin, y, halfW, 18);
  doc.text('Name:', margin + 4, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(characterInfo.name || '', margin + 38, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.rect(margin + halfW + 10, y, halfW, 18);
  doc.text('Background:', margin + halfW + 14, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    characterInfo.background?.backgroundName?.toLowerCase() || '',
    margin + halfW + 72,
    y + 12
  );

  y += 26;

  // --- Stats row: Skill, Stamina, Luck + Special ---
  const statW = 60;
  const statsTotal = 3 * statW + 2 * 6;
  const specialW = contentWidth - statsTotal - 8;
  const specialX = margin + statsTotal + 8;

  // Compute special text first so the row height can flex around it
  doc.setFontSize(7);
  const specialLines = doc.splitTextToSize(characterInfo.background?.special || '', specialW - 8);
  const rowH = Math.max(38, specialLines.length * 8 + 24);

  [['Skill', characterInfo.skill], ['Stamina', characterInfo.stamina], ['Luck', characterInfo.luck]].forEach(([label, value], i) => {
    const x = margin + i * (statW + 6);
    doc.rect(x, y, statW, rowH);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label, x + statW / 2, y + 10, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(20);
    doc.text(String(value ?? ''), x + statW / 2, y + 30, { align: 'center' });
  });

  doc.rect(specialX, y, specialW, rowH);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Special', specialX + 4, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(specialLines, specialX + 4, y + 20);

  y += rowH + 10;

  // --- Weapons / Attacks table ---
  if (weaponsArray.length > 0) {
    const attackHead = [['Weapon', '1', '2', '3', '4', '5', '6', '7+']];
    const attackRows = weaponsArray.map((weapon) => {
      const dmg = damageTable[weapon.toLowerCase()] || [];
      const row = [weapon, ...dmg];
      while (row.length < 8) row.push('');
      return row.slice(0, 8);
    });

    autoTable(doc, {
      startY: y,
      head: attackHead,
      body: attackRows,
      theme: 'grid',
      styles: { fontSize: 8, halign: 'center' },
      headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: 'bold' },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // --- Two-column layout: Advanced Skills | Inventory ---
  const colW = (contentWidth - 10) / 2;
  const twoColStartY = y;

  // Advanced Skills table (left column)
  const advRows = _.map(advancedSkillsObject, (value, key) => [
    value ? key : '',
    value ? String(value) : '',
    value ? String(characterInfo.skill) : '',
    value ? String(value + characterInfo.skill) : '',
  ]);

  autoTable(doc, {
    startY: twoColStartY,
    head: [['Advanced Skills / Spells', 'Rank', 'Skill', 'Total']],
    body: advRows,
    theme: 'grid',
    styles: { fontSize: 7 },
    headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: 'bold', fontSize: 7 },
    columnStyles: { 0: { cellWidth: colW * 0.46 } },
    margin: { left: margin, right: margin + colW + 10 },
  });

  const advEndY = doc.lastAutoTable.finalY;

  // Inventory (right column)
  const invX = margin + colW + 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Inventory', invX + colW / 2, twoColStartY + 10, { align: 'center' });
  const invH = Math.max(advEndY - twoColStartY, 22 + possessions.length * 14 + 4);
  doc.rect(invX, twoColStartY, colW, invH);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  possessions.forEach((item, i) => {
    const itemY = twoColStartY + 22 + i * 14;
    doc.text(`${i + 1}.`, invX + 4, itemY);
    if (item) {
      doc.text(item.toLowerCase(), invX + 20, itemY - 1);
    }
    doc.line(invX + 18, itemY + 1, invX + colW - 4, itemY + 1);
  });

  y = Math.max(advEndY, twoColStartY + 22 + 12 * 14) + 12;

  // --- Notes / Mien section ---
  const notesH = 90;
  doc.rect(margin, y, contentWidth, notesH);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Wearing / Notes / Miens', pageWidth / 2, y + 11, { align: 'center' });

  if (characterInfo.background?.mien?.length > 0) {
    autoTable(doc, {
      startY: y + 14,
      head: [['#', 'Mien']],
      body: characterInfo.background.mien.map((val, i) => [String(i + 1), val]),
      theme: 'grid',
      styles: { fontSize: 7 },
      headStyles: { fillColor: [220, 220, 220], textColor: 0, fontSize: 7 },
      margin: { left: margin + 2, right: margin + colW + 10 },
    });
  }

  if (characterInfo.notes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const notesLines = doc.splitTextToSize(characterInfo.notes, colW - 4);
    doc.text(notesLines, margin + colW + 14, y + 22);
  }

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

export default generateCharacterSheetPdf;
