import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true)

    let response = null

    try {
        response = await generateInterviewReport({
            jobDescription,
            selfDescription,
            resumeFile
        })

        setReport(response.interviewReport)
        return response.interviewReport

    } catch (error) {
        console.log("API Failed → Using fallback template", error)

        //  Fallback Template
        const fallbackReport = {
            _id: Date.now().toString(),
            title: jobDescription?.slice(0, 30) || "Sample Role",
            createdAt: new Date().toISOString(),
            matchScore: 75,

            technicalQuestions: [
                {
                    question: "What is closure in JavaScript?",
                    intention: "Check core JS concepts",
                    answer: "A closure is a function that remembers variables from its outer scope even after execution."
                },
                {
                    question: "Explain REST API",
                    intention: "Test backend basics",
                    answer: "REST APIs use HTTP methods like GET, POST to communicate between client and server."
                }
            ],

            behavioralQuestions: [
                {
                    question: "Describe a difficult project",
                    intention: "Evaluate resilience",
                    answer: "Explain situation, action, and result clearly."
                },
                {
                    question: "How do you handle deadlines?",
                    intention: "Check time management",
                    answer: "Prioritize tasks, break work, and communicate early."
                }
            ],

            preparationPlan: [
                {
                    day: 1,
                    focus: "Core Concepts",
                    tasks: [
                        "Revise fundamentals",
                        "Practice coding",
                        "Watch tutorials"
                    ]
                },
                {
                    day: 2,
                    focus: "Mock Interviews",
                    tasks: [
                        "Practice questions",
                        "Review mistakes",
                        "Improve weak areas"
                    ]
                }
            ],

            skillGaps: [
                { skill: "System Design", severity: "high" },
                { skill: "Algorithms", severity: "mid" },
                { skill: "Communication", severity: "low" }
            ]
        }

        setReport(fallbackReport)
        setReports(prev => [fallbackReport, ...(prev || [])])

        return fallbackReport

    } finally {
        setLoading(false)
    }
}

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}