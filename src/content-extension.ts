import { questions } from './data'
import { lessons } from './lessons'
import { agenticLessonsPart2 } from './lessons-agentic-part2'
import { agenticLessonsPart3 } from './lessons-agentic-part3'
import { agenticQuestionsPart2 } from './questions-agentic-part2'
import { agenticQuestionsPart3 } from './questions-agentic-part3'

Object.assign(lessons, agenticLessonsPart2, agenticLessonsPart3)
questions.push(...agenticQuestionsPart2, ...agenticQuestionsPart3)
