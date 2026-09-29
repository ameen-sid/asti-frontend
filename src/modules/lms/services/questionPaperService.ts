import type { QuestionPaper, SectionItem } from '../models/questionPaper';

const STORAGE_KEY = 'asti_question_papers';

export const SAMPLE_HINDI_SECTIONS: SectionItem[] = [
  {
    id: "sec-1",
    name: "Section A",
    subtitle: "सुरक्षा एवं बुनियादी कार्यप्रणाली (Safety & Basic SOP)",
    questions: [
      {
        id: "q-1-1",
        type: "Multiple Choice (MCQ)",
        questionText: "कार्य शुरू करने से पहले क्या करना चाहिए?",
        options: [
          { id: "opt-1a", label: "A", text: "P.I.S. भरनी चाहिए" },
          { id: "opt-1b", label: "B", text: "5'S करना चाहिए" },
          { id: "opt-1c", label: "C", text: "सहकर्मियों के साथ बातें करना चाहिए" },
          { id: "opt-1d", label: "D", text: "Both A & B" },
        ],
        correctOptionId: "opt-1d",
        marks: 1,
        negativeMarks: 0,
        difficulty: "Easy",
        isRequired: true,
      },
      {
        id: "q-1-2",
        type: "Multiple Choice (MCQ)",
        questionText: "कार्य शुरू करने से पहले क्या पहनना चाहिए?",
        options: [
          { id: "opt-2a", label: "A", text: "आवश्यक PPE" },
          { id: "opt-2b", label: "B", text: "सिर्फ कैप" },
          { id: "opt-2c", label: "C", text: "सिर्फ ग्लव्स" },
          { id: "opt-2d", label: "D", text: "कुछ भी पहनना जरूरी नहीं है" },
        ],
        correctOptionId: "opt-2a",
        marks: 1,
        negativeMarks: 0,
        difficulty: "Easy",
        isRequired: true,
      },
      {
        id: "q-1-3",
        type: "Multiple Choice (MCQ)",
        questionText: "5S क्या है?",
        options: [
          { id: "opt-3a", label: "A", text: "Sort, Set in Order, Shine, Standardize और Sustain" },
          { id: "opt-3b", label: "B", text: "Safety, Speed, Skill, System और Standard" },
          { id: "opt-3c", label: "C", text: "सिर्फ मशीन की सफाई करने की प्रक्रिया" },
          { id: "opt-3d", label: "D", text: "सिर्फ Material रखने की प्रक्रिया" },
        ],
        correctOptionId: "opt-3a",
        marks: 1,
        negativeMarks: 0,
        difficulty: "Medium",
        isRequired: true,
      },
    ],
  },
  {
    id: "sec-2",
    name: "Section B",
    subtitle: "गुणवत्ता एवं सामग्री प्रबंधन (Quality & Material Control)",
    questions: [
      {
        id: "q-2-1",
        type: "Multiple Choice (MCQ)",
        questionText: "पार्ट गलत लग जाये तो क्या प्रॉब्लम हो सकती है?",
        options: [
          { id: "opt-4a", label: "A", text: "असेंबली गलत हो सकती है" },
          { id: "opt-4b", label: "B", text: "क्वालिटी प्रॉब्लम हो सकती है" },
          { id: "opt-4c", label: "C", text: "पार्ट रिजेक्ट हो सकता है" },
          { id: "opt-4d", label: "D", text: "उपरोक्त सभी" },
        ],
        correctOptionId: "opt-4d",
        marks: 1,
        negativeMarks: 0,
        difficulty: "Medium",
        isRequired: true,
      },
      {
        id: "q-2-2",
        type: "Multiple Choice (MCQ)",
        questionText: "लाल और पीले टेप का क्या मतलब है?",
        options: [
          { id: "opt-5a", label: "A", text: "लाल टेप NG/Rejected और पीला टेप Hold/Suspected Material दर्शाता है" },
          { id: "opt-5b", label: "B", text: "दोनों OK Material दर्शाते हैं" },
          { id: "opt-5c", label: "C", text: "दोनों केवल Decoration के लिए होते हैं" },
          { id: "opt-5d", label: "D", text: "इनका कोई मतलब नहीं होता" },
        ],
        correctOptionId: "opt-5a",
        marks: 1,
        negativeMarks: 0,
        difficulty: "Medium",
        isRequired: true,
      },
      {
        id: "q-2-3",
        type: "Multiple Choice (MCQ)",
        questionText: "काम करते समय पीस फ्लोर पर गिर जाये तो क्या करना चाहिए?",
        options: [
          { id: "opt-6a", label: "A", text: "उठाकर सीधे लाइन में लगा देना चाहिए" },
          { id: "opt-6b", label: "B", text: "गिरे हुए पीस को अलग रखकर Supervisor/Quality को बताना चाहिए" },
          { id: "opt-6c", label: "C", text: "पीस को छुपा देना चाहिए" },
          { id: "opt-6d", label: "D", text: "बिना चेक किये अगले Process में भेज देना चाहिए" },
        ],
        correctOptionId: "opt-6b",
        marks: 1,
        negativeMarks: 0,
        difficulty: "Medium",
        isRequired: true,
      },
    ],
  },
  {
    id: "sec-3",
    name: "Section C",
    subtitle: "लाइन संचालन एवं समस्या निवारण (Line Operations & Escalation)",
    questions: [
      {
        id: "q-3-1",
        type: "Multiple Choice (MCQ)",
        questionText: "मॉडल बदलते समय क्या सावधानी रखनी चाहिए?",
        options: [
          { id: "opt-7a", label: "A", text: "Line Clearance करना चाहिए" },
          { id: "opt-7b", label: "B", text: "नये मॉडल और पार्ट की पुष्टि करनी चाहिए" },
          { id: "opt-7c", label: "C", text: "पुराने मॉडल का Material हटाकर Work Instruction Check करनी चाहिए" },
          { id: "opt-7d", label: "D", text: "उपरोक्त सभी" },
        ],
        correctOptionId: "opt-7d",
        marks: 2,
        negativeMarks: 0,
        difficulty: "Hard",
        isRequired: true,
      },
      {
        id: "q-3-2",
        type: "Multiple Choice (MCQ)",
        questionText: "कॉम्पोनेन्ट लगाते समय कोई प्रॉब्लम आये तो क्या करना चाहिए?",
        options: [
          { id: "opt-8a", label: "A", text: "जबरदस्ती कॉम्पोनेन्ट लगा देना चाहिए" },
          { id: "opt-8b", label: "B", text: "काम रोककर Supervisor/Line Leader/Quality को बताना चाहिए" },
          { id: "opt-8c", label: "C", text: "कॉम्पोनेन्ट को छोड़कर आगे काम करना चाहिए" },
          { id: "opt-8d", label: "D", text: "बिना बताए दूसरा कॉम्पोनेन्ट लगाना चाहिए" },
        ],
        correctOptionId: "opt-8b",
        marks: 2,
        negativeMarks: 0,
        difficulty: "Hard",
        isRequired: true,
      },
    ],
  },
];

export const INITIAL_SAMPLE_PAPER: QuestionPaper = {
  id: "QP-ASTI-01",
  courseId: 1,
  courseName: "Connector Assembly Training",
  departmentId: 1,
  title: "ऑपरेटर तकनीकी एवं सुरक्षा मूल्यांकन प्रश्न पत्र",
  subTitle: "Technical & Safety Evaluation Assessment",
  description: "मानकीकृत कार्यप्रणाली (SOP), 5S, PPE एवं गुणवत्ता नियंत्रण से संबंधित आवश्यक मूल्यांकन प्रश्न पत्र।",
  code: "ASTI-QP-SOP-01",
  department: "Production",
  subDepartment: "Section A",
  lineSection: "Line 1",
  allowedTime: 30,
  passingScore: 70,
  status: "PUBLISHED",
  sections: SAMPLE_HINDI_SECTIONS,
  createdAt: "2026-09-16",
  updatedAt: "2026-09-16",
};

export const questionPaperService = {
  getAll(): QuestionPaper[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([INITIAL_SAMPLE_PAPER]));
      return [INITIAL_SAMPLE_PAPER];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([INITIAL_SAMPLE_PAPER]));
        return [INITIAL_SAMPLE_PAPER];
      }
      if (!parsed.some((p: QuestionPaper) => p.id === 'QP-ASTI-01')) {
        const merged = [INITIAL_SAMPLE_PAPER, ...parsed];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([INITIAL_SAMPLE_PAPER]));
      return [INITIAL_SAMPLE_PAPER];
    }
  },

  getByCourseId(courseId: number | string | null | undefined): QuestionPaper[] {
    if (!courseId && courseId !== 0) return [];
    const list = this.getAll();
    return list.filter((p) => String(p.courseId) === String(courseId));
  },

  getByDepartmentId(deptId: number | string | null | undefined): QuestionPaper[] {
    if (!deptId && deptId !== 0) return [];
    const list = this.getAll();
    return list.filter((p) => String(p.departmentId) === String(deptId));
  },

  getById(id: string | number | null | undefined): QuestionPaper | null {
    if (!id) return null;
    const strId = String(id).trim();
    if (
      !strId ||
      strId.toLowerCase() === 'no paper id provided' ||
      strId.toLowerCase() === 'undefined' ||
      strId.toLowerCase() === 'null'
    ) {
      return null;
    }
    const list = this.getAll();
    // 1. Direct ID match (case-insensitive)
    const exact = list.find((p) => String(p.id).trim().toLowerCase() === strId.toLowerCase());
    if (exact) return exact;

    // 2. Code match (e.g., if code like ASTI-QP-SOP-01 is passed instead of ID)
    const byCode = list.find((p) => p.code && String(p.code).trim().toLowerCase() === strId.toLowerCase());
    if (byCode) return byCode;

    // 3. Match without prefix or substring
    const byPartial = list.find((p) => String(p.id).toLowerCase().includes(strId.toLowerCase()) || (p.code && String(p.code).toLowerCase().includes(strId.toLowerCase())));
    if (byPartial) return byPartial;

    return null;
  },

  getDefaultPaper(): QuestionPaper {
    const list = this.getAll();
    return list[0] || INITIAL_SAMPLE_PAPER;
  },

  save(paper: Partial<QuestionPaper> & { title: string }): QuestionPaper {
    const list = this.getAll();
    const now = new Date().toISOString().split('T')[0];

    if (paper.id) {
      // Update existing paper
      const existingIdx = list.findIndex((p) => String(p.id) === String(paper.id));
      if (existingIdx >= 0) {
        const updated: QuestionPaper = {
          ...list[existingIdx],
          ...paper,
          updatedAt: now,
        } as QuestionPaper;
        list[existingIdx] = updated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        return updated;
      }
    }

    // Create New paper
    const newId = `QP-${Date.now().toString().slice(-4)}`;
    const newPaper: QuestionPaper = {
      id: newId,
      title: paper.title || 'ऑपरेटर तकनीकी एवं सुरक्षा मूल्यांकन प्रश्न पत्र',
      subTitle: paper.subTitle || 'Technical Assessment',
      description: paper.description || '',
      code: paper.code || 'ASTI-QP-SOP-01',
      courseId: paper.courseId,
      courseName: paper.courseName,
      departmentId: paper.departmentId,
      department: paper.department || 'Production',
      subDepartment: paper.subDepartment || 'Section A',
      lineSection: paper.lineSection || 'Line 1',
      allowedTime: Number(paper.allowedTime) || 30,
      passingScore: Number(paper.passingScore) || 70,
      status: paper.status || 'PUBLISHED',
      sections: (paper.sections as SectionItem[]) || SAMPLE_HINDI_SECTIONS,
      trainingFiles: paper.trainingFiles || [],
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newPaper, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return newPaper;
  },

  delete(id: string | number): boolean {
    const list = this.getAll();
    const filtered = list.filter((p) => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

