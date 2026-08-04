import { questions } from './data'
import { lessons } from './lessons'
import { agenticLessonsPart2 } from './lessons-agentic-part2'
import { agenticQuestionsPart2 } from './questions-agentic-part2'

Object.assign(lessons, agenticLessonsPart2)
questions.push(...agenticQuestionsPart2)
