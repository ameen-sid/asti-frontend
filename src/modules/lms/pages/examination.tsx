import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type {
  QuestionPaper,
  QuestionItem,
} from "../models/questionPaper";
import { questionPaperService } from "../services/questionPaperService";
import "../../../styles/previewQuestionPaper.css";
import ExaminationTimer from "../../../shared/components/examinationTimer";

type SelectedAnswers = {
  [questionId: string]: string;
};

// Helper to ensure every question has MCQ options
const getDisplayOptions = (q: QuestionItem) => {
  if (q.options && q.options.length > 0) {
    return q.options;
  }

  return [
    {
      id: `${q.id}-opt-a`,
      label: "A",
      text: "Option A",
    },
    {
      id: `${q.id}-opt-b`,
      label: "B",
      text: "Option B",
    },
    {
      id: `${q.id}-opt-c`,
      label: "C",
      text: "Option C",
    },
    {
      id: `${q.id}-opt-d`,
      label: "D",
      text: "Option D",
    },
  ];
};

export function Examination() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Retrieve qpId / paperId from any available source
  const rawId =
    searchParams.get("qpId") ||
    searchParams.get("paperId") ||
    searchParams.get("id") ||
    searchParams.get("qp_id") ||
    location.state?.paperId ||
    location.state?.qpId ||
    location.state?.qp_id ||
    location.state?.id ||
    location.state?.questionPaperId ||
    sessionStorage.getItem("asti_selected_paper_id") ||
    "";

  // Clean invalid placeholder strings
  const paperId =
    rawId === "No Paper ID Provided" || rawId === "undefined" || rawId === "null"
      ? ""
      : rawId;

  const employeeId =
    location.state?.employeeId ||
    searchParams.get("employeeId") ||
    sessionStorage.getItem("asti_selected_employee_id") ||
    "";

  const employeeName =
    location.state?.employeeName ||
    searchParams.get("employeeName") ||
    sessionStorage.getItem("asti_selected_employee_name") ||
    "";

  const paperCode =
    location.state?.paperCode ||
    searchParams.get("paperCode") ||
    "";

  const [paper, setPaper] =
    useState<QuestionPaper | null>(null);

  const [selectedAnswers, setSelectedAnswers] =
    useState<SelectedAnswers>({});

  const [errorMessage, setErrorMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  /*
   * Load question paper
   */
  useEffect(() => {
    let found = paperId ? questionPaperService.getById(paperId) : null;
    if (!found && paperCode && paperCode !== "No Paper Code Provided") {
      found = questionPaperService.getById(paperCode);
    }
    // Fallback to default paper so user can always see and take the exam
    if (!found) {
      found = questionPaperService.getDefaultPaper();
    }

    if (found) {
      setPaper(found);
      sessionStorage.setItem("asti_selected_paper_id", String(found.id));
    }
  }, [paperId, paperCode]);

  /*
   * Select answer
   */
  const handleAnswerChange = (
    questionId: string,
    optionId: string
  ) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }));

    setErrorMessage("");
  };

  /*
   * Submit examination
   */
  const handleSubmitExam = async () => {
    if (!paper) return;

    const totalQuestions = (
      paper.sections || []
    ).reduce(
      (sum, section) =>
        sum + (section.questions || []).length,
      0
    );

    const answeredQuestions =
      Object.keys(selectedAnswers).length;

    if (answeredQuestions < totalQuestions) {
      setErrorMessage(
        `Please answer all questions. ${answeredQuestions}/${totalQuestions} answered.`
      );

      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const submissionData = {
        paperId: paper.id,
        paperCode: paper.code,
        employeeId,
        answers: Object.entries(
          selectedAnswers
        ).map(([questionId, optionId]) => ({
          questionId,
          optionId,
        })),
      };

      console.log(
        "EXAM SUBMISSION:",
        submissionData
      );

      /*
       * Later call your API here
       *
       * Example:
       *
       * await examinationService.submitExam(
       *   submissionData
       * );
       */

      // Navigate after successful submission
      // navigate("/lms/examination-result", {
      //   state: {
      //     paperId: paper.id,
      //     employeeId,
      //   },
      // });

      alert("Examination submitted successfully.");
    } catch (error) {
      console.error(
        "Failed to submit examination:",
        error
      );

      setErrorMessage(
        "Failed to submit examination."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  /*
   * Paper not found
   */
  if (!paper) {
    return (
      <div className="pqp-not-found">
        <div className="pqp-not-found-inner">
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />

            <polyline points="14 2 14 8 20 8" />
          </svg>

          <h5 className="mt-3 fw-bold text-dark">
            Question Paper Not Found
          </h5>

          <p
            className="text-muted"
            style={{ fontSize: "0.9rem" }}
          >
            Unable to load the examination paper.
          </p>

          <button
            className="btn btn-primary px-4 mt-2"
            onClick={() =>
              navigate(
                "/lms/training-material"
              )
            }
          >
            Back to Training
          </button>
        </div>
      </div>
    );
  }

  /*
   * Calculate totals
   */
  const totalQuestions = (
    paper.sections || []
  ).reduce(
    (sum, section) =>
      sum +
      (section.questions || []).length,
    0
  );

  const totalMarks = (
    paper.sections || []
  ).reduce(
    (sum, section) =>
      sum +
      section.questions.reduce(
        (questionSum, question) =>
          questionSum +
          (question.marks || 0),
        0
      ),
    0
  );

  const answeredQuestions =
    Object.keys(selectedAnswers).length;

  return (
    <div className="pqp-page">
      {/* ========================= */}
      {/* TOP NAVBAR */}
      {/* ========================= */}

      <div className="pqp-topbar">
        <div className="pqp-topbar-left">
          <button
            className="pqp-back-btn"
            onClick={handleBack}
            title="Go back"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="pqp-topbar-title-block">
            <span className="pqp-topbar-title">
              Examination
            </span>

            <span className="pqp-topbar-subtitle">
              Answer all questions before
              submitting
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="pqp-topbar-actions">
          <ExaminationTimer duration = {paper.allowedTime}/>
          <div
          className="w-auto mx-2"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#64748b",
            }}
          >
            Answered:{answeredQuestions}/{totalQuestions}
          </div>

          <button
            className="pqp-btn-print"
            onClick={handleSubmitExam}
            disabled={submitting}
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>

                Submit Examination
              </>
            )}
          </button>
        </div>
      </div>

      {/* ERROR */}

      {errorMessage && (
        <div
          className="alert alert-danger mx-auto mt-3"
          style={{
            maxWidth: "1100px",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* ========================= */}
      {/* EXAM PAPER */}
      {/* ========================= */}

      <div className="pqp-content">
        <div className="pqp-paper">
          {/* ========================= */}
          {/* PAPER HEADER */}
          {/* ========================= */}

          <div className="pqp-paper-header">
            <img
              className="pqp-paper-logo"
              src="/asti-logo.png"
              alt="ASTI Logo"
              onError={(e) => {
                (
                  e.target as HTMLImageElement
                ).style.display = "none";
              }}
            />

            <div className="pqp-paper-title-block">
              <div className="pqp-paper-main-title">
                {paper.title}
              </div>

              {paper.subTitle && (
                <div className="pqp-paper-subtitle">
                  {paper.subTitle}
                </div>
              )}
            </div>
          </div>

          {/* ========================= */}
          {/* EMPLOYEE DETAILS */}
          {/* ========================= */}

          {(employeeId || employeeName) && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                padding: "12px 16px",
                marginBottom: "16px",
                borderRadius: "6px",
                display: "flex",
                gap: "40px",
                flexWrap: "wrap",
              }}
            >
              {employeeId && (
                <div>
                  <strong>
                    Employee ID:
                  </strong>{" "}
                  {employeeId}
                </div>
              )}

              {employeeName && (
                <div>
                  <strong>
                    Employee Name:
                  </strong>{" "}
                  {employeeName}
                </div>
              )}

              <div>
                <strong>
                  Paper Code:
                </strong>{" "}
                {paperCode || paper.code}
              </div>
            </div>
          )}

          {/* ========================= */}
          {/* PAPER INFO */}
          {/* ========================= */}

          <div className="pqp-info-table-wrap">
            <table className="pqp-info-table">
              <thead>
                <tr>
                  <th>
                    Paper Code / Ref
                  </th>

                  <th>Department</th>

                  <th>
                    Sub Dept / Line
                  </th>

                  <th>Time Allowed</th>

                  <th>Pass Score</th>

                  <th>
                    Total Questions
                  </th>

                  <th>Total Marks</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    {paper.code ||
                      "ASTI-QP"}
                  </td>

                  <td>
                    {paper.department}
                  </td>

                  <td>
                    {paper.subDepartment} –{" "}
                    {paper.lineSection}
                  </td>

                  <td>
                    {paper.allowedTime}{" "}
                    Mins
                  </td>

                  <td>
                    {paper.passingScore}%
                  </td>

                  <td>
                    {totalQuestions}
                  </td>

                  <td>
                    {totalMarks}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ========================= */}
          {/* INSTRUCTIONS */}
          {/* ========================= */}

          <div className="pqp-instructions">
            <strong>
              Instructions:
            </strong>
            &nbsp;Read all questions
            carefully before answering.
            Select only one answer for each
            question. All questions must be
            answered before submitting the
            examination.
          </div>

          {/* ========================= */}
          {/* QUESTIONS */}
          {/* ========================= */}

          {(paper.sections || []).map(
            (section, sectionIndex) => {
              let questionGlobalOffset = 0;

              for (
                let i = 0;
                i < sectionIndex;
                i++
              ) {
                questionGlobalOffset +=
                  (
                    paper.sections[i]
                      ?.questions || []
                  ).length;
              }

              const sectionMarks =
                section.questions.reduce(
                  (sum, question) =>
                    sum +
                    (question.marks ||
                      0),
                  0
                );

              const displaySubtitle =
                section.subtitle
                  ?.replace(
                    /Short Answer Questions/gi,
                    "Multiple Choice Questions"
                  )
                  ?.replace(
                    /Long Answer Questions/gi,
                    "Multiple Choice Questions"
                  ) ||
                section.subtitle ||
                "Multiple Choice Questions";

              return (
                <div
                  key={section.id}
                  className="pqp-section"
                >
                  {/* SECTION HEADER */}

                  <div className="pqp-section-header">
                    <span className="pqp-section-name">
                      {section.name}:{" "}
                      {displaySubtitle}
                    </span>

                    <span className="pqp-section-meta">
                      {
                        section.questions
                          .length
                      }{" "}
                      Q(s)
                      &nbsp;·&nbsp;
                      {sectionMarks} Marks
                    </span>
                  </div>

                  {/* QUESTIONS */}

                  {section.questions.map(
                    (
                      question,
                      questionIndex
                    ) => {
                      const questionNumber =
                        questionGlobalOffset +
                        questionIndex +
                        1;

                      const options =
                        getDisplayOptions(
                          question
                        );

                      return (
                        <div
                          key={
                            question.id
                          }
                          className="pqp-question"
                        >
                          {/* QUESTION */}

                          <div className="pqp-q-row">
                            <span className="pqp-q-num">
                              Q
                              {
                                questionNumber
                              }
                              .
                            </span>

                            <span className="pqp-q-text">
                              {
                                question.questionText
                              }
                            </span>

                            <span className="pqp-q-marks">
                              [
                              {
                                question.marks
                              }{" "}
                              {question.marks >
                              1
                                ? "Marks"
                                : "Mark"}
                              ]
                            </span>
                          </div>

                          {/* OPTIONS */}

                          <div className="pqp-options-grid">
                            {options.map(
                              (option) => {
                                const selected =
                                  selectedAnswers[
                                    question.id
                                  ] ===
                                  option.id;

                                return (
                                  <label
                                    key={
                                      option.id
                                    }
                                    className={`pqp-option ${
                                      selected
                                        ? "pqp-option-selected"
                                        : ""
                                    }`}
                                    style={{
                                      cursor:
                                        "pointer",
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${question.id}`}
                                      value={
                                        option.id
                                      }
                                      checked={
                                        selected
                                      }
                                      onChange={() =>
                                        handleAnswerChange(
                                          question.id,
                                          option.id
                                        )
                                      }
                                    />

                                    <span className="pqp-option-letter">
                                      (
                                      {
                                        option.label
                                      }
                                      )
                                    </span>

                                    <span className="pqp-option-text">
                                      {
                                        option.text
                                      }
                                    </span>
                                  </label>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              );
            }
          )}

          {/* ========================= */}
          {/* FOOTER */}
          {/* ========================= */}

          <div className="pqp-paper-footer">
            <span>
              — End of Question Paper —
            </span>

            <span>
              Answered:{" "}
              {answeredQuestions}/
              {totalQuestions}
              &nbsp;|&nbsp; Total Marks:{" "}
              {totalMarks}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Examination;