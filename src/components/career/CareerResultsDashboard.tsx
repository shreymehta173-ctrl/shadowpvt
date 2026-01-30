import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  BookOpen, 
  ArrowRight,
  RefreshCw,
  MessageCircle,
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Target,
  AlertTriangle,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { AssessmentAnswers } from './CareerAssessment';
import { ScoreDimensions, getQuestionsForClass } from '@/data/assessmentQuestions';
import { CareerPath, getCareerPathsForClass, calculateCareerScores } from '@/data/careerGroups';

interface CareerResult {
  career: CareerPath;
  score: number;
  confidence: number;
  reasons: string[];
}

interface CareerResultsDashboardProps {
  answers: AssessmentAnswers;
  scores: ScoreDimensions;
  onRetake: () => void;
  onChatWithMentor: () => void;
}

const dimensionLabels: Record<keyof ScoreDimensions, string> = {
  technical_orientation: 'Technical',
  biological_orientation: 'Life Sciences',
  data_orientation: 'Analytical',
  creative_orientation: 'Creative',
  business_orientation: 'Business',
  financial_orientation: 'Finance',
  social_orientation: 'Social',
  hands_on_orientation: 'Practical',
  pressure_tolerance: 'Stress Resilience',
  exam_tolerance: 'Exam Readiness',
};

export function CareerResultsDashboard({ 
  answers, 
  scores, 
  onRetake, 
  onChatWithMentor 
}: CareerResultsDashboardProps) {
  const [results, setResults] = useState<CareerResult[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (answers.completedClass) {
      const careers = getCareerPathsForClass(answers.completedClass);
      const scored = calculateCareerScores(scores, careers);
      setResults(scored);
    }
  }, [answers.completedClass, scores]);

  const topMatch = results[0];
  const alternatives = results.slice(1, 3);
  const otherOptions = results.slice(3);

  // Calculate max score for normalization
  const maxDimensionScore = Math.max(...Object.values(scores), 1);

  // Generate PDF Report
  const downloadAsPDF = useCallback(() => {
    const reportDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const questions = answers.completedClass ? getQuestionsForClass(answers.completedClass) : [];
    const answeredQuestions = questions.map((q, index) => {
      const response = answers.responses[q.id];
      const selectedOption = q.options.find(opt => opt.value === response);
      return {
        number: index + 1,
        question: q.question,
        answer: selectedOption?.label || 'Not answered',
      };
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>PrepMate Career Assessment Report</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, sans-serif; 
      max-width: 850px; 
      margin: 0 auto; 
      padding: 40px; 
      color: #1e293b; 
      background: #f8fafc;
      line-height: 1.6;
    }
    
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #0d9488 100%);
      color: white;
      padding: 40px;
      border-radius: 16px;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .header h1 { font-size: 32px; margin: 0 0 8px; }
    .header p { margin: 0; opacity: 0.9; font-size: 14px; }
    
    .section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #3730a3;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .disclaimer {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }
    
    .disclaimer-title { font-weight: 600; color: #92400e; }
    .disclaimer-text { color: #78350f; font-size: 14px; }
    
    .top-match {
      background: linear-gradient(135deg, #eef2ff, #e0e7ff);
      border: 2px solid #4f46e5;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
    }
    
    .match-score {
      font-size: 48px;
      font-weight: 800;
      color: #4f46e5;
    }
    
    .career-card {
      padding: 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    
    .score-bar {
      background: #e2e8f0;
      border-radius: 4px;
      height: 8px;
      margin-top: 4px;
    }
    
    .score-fill {
      background: linear-gradient(90deg, #4f46e5, #0d9488);
      border-radius: 4px;
      height: 100%;
    }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    
    .qa-item { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
    .qa-question { font-weight: 600; color: #475569; margin-bottom: 4px; }
    .qa-answer { color: #1e293b; }
    
    .footer {
      text-align: center;
      padding: 24px;
      color: #64748b;
      font-size: 12px;
    }
    
    @media print { body { background: white; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 PrepMate Career Assessment Report</h1>
    <p>Shape Your Future, Plan Your Success</p>
    <p style="margin-top: 16px; font-size: 12px; opacity: 0.8;">by Team Shadow • Generated on ${reportDate}</p>
  </div>
  
  <div class="disclaimer">
    <div class="disclaimer-title">⚠️ Important Disclaimer</div>
    <div class="disclaimer-text">
      This assessment is a decision support tool. Results should be discussed with parents, teachers, 
      and career counselors before making important academic decisions.
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">📊 Assessment Summary</div>
    <div class="grid-2">
      <div>
        <strong>Assessment Type:</strong><br>
        ${answers.completedClass === '10th' ? 'After 10th Standard' : 
          answers.completedClass === '12th_science' ? `After 12th Science (${answers.stream12th})` :
          'After 12th Commerce'}
      </div>
      <div>
        <strong>Questions Answered:</strong> ${Object.keys(answers.responses).length} / 15
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">🏆 Top Career Recommendation</div>
    ${topMatch ? `
    <div class="top-match">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="margin: 0; font-size: 24px;">${topMatch.career.icon} ${topMatch.career.name}</h3>
          <p style="color: #64748b; margin: 8px 0;">${topMatch.career.category}</p>
        </div>
        <div class="match-score">${topMatch.score}%</div>
      </div>
      <p style="margin-top: 16px;">${topMatch.career.description}</p>
      <div style="margin-top: 16px;">
        <strong>Why this fits you:</strong>
        <ul style="margin: 8px 0; padding-left: 20px;">
          ${topMatch.reasons.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
      <div class="grid-2" style="margin-top: 16px;">
        <div><strong>Salary Range:</strong> ${topMatch.career.salaryRange}</div>
        <div><strong>Growth:</strong> ${topMatch.career.growthOutlook}</div>
      </div>
    </div>
    ` : ''}
    
    <h4 style="margin-top: 24px;">Alternative Paths</h4>
    ${alternatives.map(r => `
    <div class="career-card">
      <div style="display: flex; justify-content: space-between;">
        <span><strong>${r.career.icon} ${r.career.name}</strong></span>
        <span style="color: #4f46e5; font-weight: 600;">${r.score}%</span>
      </div>
      <p style="font-size: 14px; color: #64748b; margin: 8px 0;">${r.career.description}</p>
    </div>
    `).join('')}
  </div>
  
  <div class="section">
    <div class="section-title">📈 Your Profile Strengths</div>
    <div class="grid-2">
      ${Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([key, value]) => `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px;">
            <span>${dimensionLabels[key as keyof ScoreDimensions]}</span>
            <span style="font-weight: 600;">${value}</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${Math.min((value / 15) * 100, 100)}%"></div>
          </div>
        </div>
        `).join('')}
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">📝 Complete Question History</div>
    ${answeredQuestions.map(qa => `
    <div class="qa-item">
      <div class="qa-question">Q${qa.number}. ${qa.question}</div>
      <div class="qa-answer">→ ${qa.answer}</div>
    </div>
    `).join('')}
  </div>
  
  <div class="footer">
    <p>PrepMate by Team Shadow • Shape Your Future, Plan Your Success</p>
    <p>This report is confidential and for educational purposes only.</p>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrepMate_Career_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded! Open in browser and print as PDF.');
  }, [answers, scores, topMatch, alternatives]);

  // Generate CSV
  const downloadAsCSV = useCallback(() => {
    const questions = answers.completedClass ? getQuestionsForClass(answers.completedClass) : [];
    
    let csv = 'PrepMate Career Assessment Report\n';
    csv += `Assessment Type,${answers.completedClass === '10th' ? 'After 10th' : answers.completedClass === '12th_science' ? `After 12th Science (${answers.stream12th})` : 'After 12th Commerce'}\n`;
    csv += `Generated,${new Date().toLocaleString()}\n\n`;
    
    csv += 'CAREER RECOMMENDATIONS\n';
    csv += 'Rank,Career,Category,Match Score,Growth,Salary Range\n';
    results.forEach((r, i) => {
      csv += `${i + 1},"${r.career.name}","${r.career.category}",${r.score}%,${r.career.growthOutlook},"${r.career.salaryRange}"\n`;
    });
    
    csv += '\nPROFILE DIMENSIONS\n';
    csv += 'Dimension,Score\n';
    Object.entries(scores).forEach(([key, value]) => {
      csv += `"${dimensionLabels[key as keyof ScoreDimensions]}",${value}\n`;
    });
    
    csv += '\nQUESTION RESPONSES\n';
    csv += 'Question,Response\n';
    questions.forEach((q, i) => {
      const response = answers.responses[q.id];
      const selectedOption = q.options.find(opt => opt.value === response);
      csv += `"Q${i + 1}. ${q.question}","${selectedOption?.label || 'Not answered'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrepMate_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('CSV report downloaded!');
  }, [answers, scores, results]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 bg-white">
            Assessment Complete
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Your Career Recommendations
          </h1>
          <p className="text-slate-600">
            Based on your responses, here are the paths that align best with your profile
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Decision Support Tool</p>
              <p className="text-sm text-amber-700">
                These recommendations are based on your assessment responses. Discuss with parents, 
                teachers, and counselors before making academic decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Top Match Card */}
        {topMatch && (
          <Card className="mb-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white shadow-lg overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-6 w-6 text-amber-500" />
                <span className="font-semibold text-amber-700">Best Match for You</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${topMatch.career.color} flex items-center justify-center text-4xl shadow-lg shrink-0`}>
                  {topMatch.career.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{topMatch.career.name}</h2>
                      <p className="text-slate-600">{topMatch.career.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-indigo-600">{topMatch.score}%</div>
                      <div className="text-sm text-slate-500">match</div>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 mt-4">{topMatch.career.description}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topMatch.reasons.map((reason, i) => (
                      <Badge key={i} variant="secondary" className="bg-indigo-100 text-indigo-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {reason}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1">Salary Range</div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {topMatch.career.salaryRange}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1">Growth</div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {topMatch.career.growthOutlook}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1">Work Environment</div>
                      <div className="font-semibold text-slate-900 text-sm">{topMatch.career.workEnvironment}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1">Entrance Exams</div>
                      <div className="font-semibold text-slate-900 text-sm">
                        {topMatch.career.entranceExams?.slice(0, 2).join(', ') || 'Various'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-white border">
            <TabsTrigger value="overview">All Options</TabsTrigger>
            <TabsTrigger value="profile">Your Profile</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Alternative Paths */}
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Alternative Paths</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {alternatives.map((result) => (
                <Card 
                  key={result.career.id} 
                  className="border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
                  onClick={() => setExpandedCard(expandedCard === result.career.id ? null : result.career.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${result.career.color} flex items-center justify-center text-2xl shrink-0`}>
                        {result.career.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-slate-900 truncate">{result.career.name}</h4>
                          <Badge variant="outline" className="shrink-0">{result.score}%</Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{result.career.category}</p>
                        
                        {expandedCard === result.career.id && (
                          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                            <p className="text-sm text-slate-600">{result.career.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-slate-500">{result.career.salaryRange}</span>
                              <span className="text-green-600">{result.career.growthOutlook} Growth</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {expandedCard === result.career.id ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Other Options */}
            {otherOptions.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Other Options to Consider</h3>
                <div className="space-y-3">
                  {otherOptions.map((result) => (
                    <Card key={result.career.id} className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{result.career.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{result.career.name}</h4>
                            <p className="text-sm text-slate-500">{result.career.category}</p>
                          </div>
                          <Badge variant="secondary">{result.score}%</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  Your Profile Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(scores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">
                            {dimensionLabels[key as keyof ScoreDimensions]}
                          </span>
                          <span className="text-sm font-semibold text-indigo-600">{value}</span>
                        </div>
                        <Progress 
                          value={Math.min((value / 15) * 100, 100)} 
                          className="h-2 bg-slate-100"
                        />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare" className="mt-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Career Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold">Career</th>
                        <th className="text-center py-3 px-2 font-semibold">Match</th>
                        <th className="text-left py-3 px-2 font-semibold">Salary</th>
                        <th className="text-left py-3 px-2 font-semibold">Growth</th>
                        <th className="text-left py-3 px-2 font-semibold">Exams</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={r.career.id} className={i === 0 ? 'bg-indigo-50' : ''}>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span>{r.career.icon}</span>
                              <span className="font-medium">{r.career.name}</span>
                            </div>
                          </td>
                          <td className="text-center py-3 px-2">
                            <Badge variant={i === 0 ? 'default' : 'secondary'}>{r.score}%</Badge>
                          </td>
                          <td className="py-3 px-2 text-slate-600">{r.career.salaryRange}</td>
                          <td className="py-3 px-2 text-slate-600">{r.career.growthOutlook}</td>
                          <td className="py-3 px-2 text-slate-600">
                            {r.career.entranceExams?.slice(0, 2).join(', ') || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Button
            onClick={onChatWithMentor}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Chat with AI Mentor
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={downloadAsPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadAsCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            onClick={onRetake}
            className="gap-2 text-slate-600"
          >
            <RefreshCw className="h-4 w-4" />
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
