import { jsPDF } from 'jspdf';
import { TraitDimensions } from '@/data/assessmentQuestions';
import { CareerMatchResult } from '@/hooks/useCareerGuidance';

interface TraitProfile {
  dominant: string[];
  workStyle: string;
  learningStyle: string;
}

export async function exportToPDF(
  completedClass: 'after_10th' | 'after_12th_science' | 'after_12th_commerce',
  stream: string | undefined,
  scores: TraitDimensions,
  traitProfile: TraitProfile,
  careerMatches: CareerMatchResult[],
  studentName?: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = 20;

  // Colors
  const primaryColor = [15, 118, 110]; // Teal
  const accentColor = [245, 158, 11]; // Amber
  const textColor = [31, 41, 55];
  const mutedColor = [107, 114, 128];

  // Helper functions
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const { color = textColor, size = 10, style = 'normal' } = options;
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.text(text, x, y);
    return y + (size * 0.4);
  };

  const addLine = (y: number, color = mutedColor) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.line(margin, y, pageWidth - margin, y);
    return y + 5;
  };

  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // Header with gradient effect
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Logo text
  addText('PrepMate', margin, 18, { color: [255, 255, 255], size: 24, style: 'bold' });
  addText('Career Assessment Report', margin, 28, { color: [255, 255, 255], size: 12 });
  addText('by Team Shadow', margin, 36, { color: [200, 230, 230], size: 9 });

  // Date
  const date = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  addText(date, pageWidth - margin - 40, 28, { color: [255, 255, 255], size: 9 });

  yPos = 60;

  // Student Info Section
  const pathwayLabel = completedClass === 'after_10th' 
    ? 'After 10th Standard' 
    : completedClass === 'after_12th_science'
      ? `After 12th Science (${stream || 'General'})`
      : 'After 12th Commerce';

  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 25, 3, 3, 'F');
  
  if (studentName) {
    yPos = addText(`Student: ${studentName}`, margin + 5, yPos + 5, { size: 11, style: 'bold' });
  }
  yPos = addText(`Assessment Type: ${pathwayLabel}`, margin + 5, yPos + 3, { size: 10 });
  yPos += 15;

  // Behavioral Profile Section
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
  addText('BEHAVIORAL PROFILE', margin + 5, yPos + 6, { color: [255, 255, 255], size: 11, style: 'bold' });
  yPos += 15;

  // Dominant Traits
  yPos = addText('Dominant Traits:', margin, yPos, { size: 10, style: 'bold', color: primaryColor });
  yPos = addText(traitProfile.dominant.join(' • '), margin, yPos + 2, { size: 10 });
  yPos += 8;

  // Work Style
  yPos = addText('Work Style:', margin, yPos, { size: 10, style: 'bold', color: primaryColor });
  yPos = addText(traitProfile.workStyle, margin, yPos + 2, { size: 10 });
  yPos += 8;

  // Learning Style
  yPos = addText('Learning Style:', margin, yPos, { size: 10, style: 'bold', color: primaryColor });
  yPos = addText(traitProfile.learningStyle, margin, yPos + 2, { size: 10 });
  yPos += 15;

  // Trait Scores Chart
  checkNewPage(100);
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
  addText('TRAIT ANALYSIS', margin + 5, yPos + 6, { color: [255, 255, 255], size: 11, style: 'bold' });
  yPos += 15;

  // Trait bars
  const maxScore = Math.max(...Object.values(scores), 1);
  const traitLabels: Record<string, string> = {
    analytical_reasoning: 'Analytical Thinking',
    system_thinking: 'Systems Thinking',
    people_involvement: 'People-Oriented',
    persuasion_influence: 'Influential',
    creative_expression: 'Creative',
    visual_thinking: 'Visual Thinker',
    precision_orientation: 'Detail-Focused',
    risk_appetite: 'Risk Comfort',
    learning_depth_tolerance: 'Deep Learner',
    ambiguity_tolerance: 'Adaptable',
    execution_drive: 'Action-Oriented',
    planning_drive: 'Strategic Planner',
  };

  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);

  sortedScores.forEach(([key, value], index) => {
    checkNewPage(15);
    const label = traitLabels[key] || key;
    const percentage = Math.round((value / maxScore) * 100);
    const barWidth = ((pageWidth - 2 * margin - 80) * percentage) / 100;
    
    addText(label, margin, yPos, { size: 9 });
    
    // Background bar
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin + 60, yPos - 4, pageWidth - 2 * margin - 80, 6, 2, 2, 'F');
    
    // Value bar
    const barColor = percentage >= 70 ? [16, 185, 129] : percentage >= 40 ? [59, 130, 246] : [156, 163, 175];
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    doc.roundedRect(margin + 60, yPos - 4, Math.max(barWidth, 4), 6, 2, 2, 'F');
    
    addText(`${percentage}%`, pageWidth - margin - 12, yPos, { size: 9, style: 'bold' });
    
    yPos += 10;
  });

  yPos += 10;

  // Career Recommendations
  checkNewPage(60);
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
  addText('CAREER RECOMMENDATIONS', margin + 5, yPos + 6, { color: [255, 255, 255], size: 11, style: 'bold' });
  yPos += 15;

  // Top match highlight
  const topMatch = careerMatches[0];
  if (topMatch) {
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, yPos - 3, pageWidth - 2 * margin, 50, 3, 3, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos - 3, pageWidth - 2 * margin, 50, 3, 3, 'S');
    
    addText('★ TOP MATCH', margin + 5, yPos + 3, { size: 8, style: 'bold', color: [16, 185, 129] });
    yPos = addText(`${topMatch.career.name}`, margin + 5, yPos + 12, { size: 14, style: 'bold', color: primaryColor });
    yPos = addText(`Match Score: ${topMatch.score}%`, margin + 5, yPos + 2, { size: 10, style: 'bold', color: [16, 185, 129] });
    
    // Description (wrap text)
    const description = topMatch.career.description;
    const splitDesc = doc.splitTextToSize(description, pageWidth - 2 * margin - 10);
    splitDesc.slice(0, 2).forEach((line: string) => {
      yPos = addText(line, margin + 5, yPos + 2, { size: 9, color: mutedColor });
    });
    
    yPos += 15;

    // Education Path
    yPos = addText('Education Journey:', margin, yPos, { size: 10, style: 'bold' });
    yPos = addText(topMatch.career.educationPath.join(' → '), margin, yPos + 2, { size: 9 });
    yPos += 5;

    // Key Details
    const details = [
      `Salary Range: ${topMatch.career.salaryRange}`,
      `Growth Outlook: ${topMatch.career.growthOutlook}`,
    ];
    details.forEach(detail => {
      yPos = addText(detail, margin, yPos + 2, { size: 9 });
    });
    
    // Reasons
    if (topMatch.reasons.length > 0) {
      yPos += 5;
      yPos = addText('Why this suits you:', margin, yPos, { size: 10, style: 'bold' });
      topMatch.reasons.slice(0, 3).forEach(reason => {
        yPos = addText(`• ${reason}`, margin + 5, yPos + 2, { size: 9 });
      });
    }
  }

  yPos += 15;

  // Alternative careers
  const alternatives = careerMatches.slice(1, 4);
  if (alternatives.length > 0) {
    checkNewPage(60);
    yPos = addText('Alternative Career Paths:', margin, yPos, { size: 11, style: 'bold' });
    yPos += 5;

    alternatives.forEach((match, index) => {
      checkNewPage(35);
      
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, yPos - 2, pageWidth - 2 * margin, 28, 2, 2, 'F');
      
      yPos = addText(`${index + 2}. ${match.career.name}`, margin + 5, yPos + 5, { size: 11, style: 'bold' });
      yPos = addText(`Match Score: ${match.score}%`, pageWidth - margin - 40, yPos - 4, { size: 9, color: primaryColor });
      
      const desc = doc.splitTextToSize(match.career.description, pageWidth - 2 * margin - 10);
      yPos = addText(desc[0], margin + 5, yPos + 2, { size: 9, color: mutedColor });
      yPos = addText(`Education: ${match.career.educationPath[0]}`, margin + 5, yPos + 2, { size: 8 });
      
      yPos += 12;
    });
  }

  // Footer
  yPos = pageHeight - 25;
  addLine(yPos - 5, [200, 200, 200]);
  
  doc.setFillColor(248, 250, 252);
  doc.rect(0, yPos - 2, pageWidth, 30, 'F');
  
  addText('Generated by PrepMate - Shape Your Career Path', margin, yPos + 5, { size: 8, color: mutedColor });
  addText('This is a guidance tool. Please discuss with counselors before making decisions.', margin, yPos + 12, { size: 7, color: mutedColor });
  addText('© Team Shadow', pageWidth - margin - 25, yPos + 5, { size: 8, color: mutedColor });

  // Save
  doc.save('PrepMate_Career_Report.pdf');
}

export function exportToCSV(
  completedClass: 'after_10th' | 'after_12th_science' | 'after_12th_commerce',
  stream: string | undefined,
  scores: TraitDimensions,
  traitProfile: TraitProfile,
  careerMatches: CareerMatchResult[],
  studentName?: string
) {
  const pathwayLabel = completedClass === 'after_10th' 
    ? 'After 10th Standard' 
    : completedClass === 'after_12th_science'
      ? `After 12th Science (${stream || 'General'})`
      : 'After 12th Commerce';

  const traitLabels: Record<string, string> = {
    analytical_reasoning: 'Analytical Thinking',
    system_thinking: 'Systems Thinking',
    people_involvement: 'People-Oriented',
    persuasion_influence: 'Influential',
    creative_expression: 'Creative',
    visual_thinking: 'Visual Thinker',
    precision_orientation: 'Detail-Focused',
    risk_appetite: 'Risk Comfort',
    learning_depth_tolerance: 'Deep Learner',
    ambiguity_tolerance: 'Adaptable',
    execution_drive: 'Action-Oriented',
    planning_drive: 'Strategic Planner',
  };

  const rows: string[][] = [];
  
  // Header
  rows.push(['PrepMate Career Assessment Report']);
  rows.push(['Generated', new Date().toISOString()]);
  if (studentName) rows.push(['Student', studentName]);
  rows.push(['Assessment Type', pathwayLabel]);
  rows.push([]);
  
  // Profile
  rows.push(['BEHAVIORAL PROFILE']);
  rows.push(['Dominant Traits', traitProfile.dominant.join(', ')]);
  rows.push(['Work Style', traitProfile.workStyle]);
  rows.push(['Learning Style', traitProfile.learningStyle]);
  rows.push([]);
  
  // Traits
  rows.push(['TRAIT SCORES']);
  rows.push(['Trait', 'Score', 'Percentage']);
  const maxScore = Math.max(...Object.values(scores), 1);
  Object.entries(scores).forEach(([key, value]) => {
    rows.push([traitLabels[key] || key, value.toString(), `${Math.round((value / maxScore) * 100)}%`]);
  });
  rows.push([]);
  
  // Careers
  rows.push(['CAREER RECOMMENDATIONS']);
  rows.push(['Rank', 'Career', 'Match %', 'Salary Range', 'Growth', 'Education Path']);
  careerMatches.slice(0, 5).forEach((match, i) => {
    rows.push([
      (i + 1).toString(),
      match.career.name,
      `${match.score}%`,
      match.career.salaryRange,
      match.career.growthOutlook,
      match.career.educationPath.join(' → ')
    ]);
  });

  const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PrepMate_Career_Report.csv';
  a.click();
  URL.revokeObjectURL(url);
}
