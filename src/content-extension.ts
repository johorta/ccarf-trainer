import { questions } from './data'
import { lessons } from './lessons'
import { agenticLessonsPart2 } from './lessons-agentic-part2'
import { agenticLessonsPart3 } from './lessons-agentic-part3'
import { claudeCodeLessonsPart1 } from './lessons-claude-code-part1'
import { claudeCodeLessonsPart2 } from './lessons-claude-code-part2'
import { agenticQuestionsPart2 } from './questions-agentic-part2'
import { agenticQuestionsPart3 } from './questions-agentic-part3'
import { claudeCodeQuestionsPart1 } from './questions-claude-code-part1'
import { claudeCodeQuestionsPart2 } from './questions-claude-code-part2'

Object.assign(
  lessons,
  agenticLessonsPart2,
  agenticLessonsPart3,
  claudeCodeLessonsPart1,
  claudeCodeLessonsPart2,
)

questions.push(
  ...agenticQuestionsPart2,
  ...agenticQuestionsPart3,
  ...claudeCodeQuestionsPart1,
  ...claudeCodeQuestionsPart2,
)
