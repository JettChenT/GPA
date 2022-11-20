const LetterGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C', 'D', 'F']
const lbounds = [97,92,87,82,77,70,65,60,0]

const getGrade = (score: number|null) => {
  // Returns the index of the grade
  if(score==null)return null;
  for (let i = 0; i < lbounds.length; i++) {
    if (score >= lbounds[i]) {
      return i
    }
  }
  return -1
}

enum Levels {
  Standard='S',
  HonorMinus='H-',
  Honor='H',
  AdvancedHonor='AH',
  AP='AP'
}

const LevelToGrade = {
  'S': [4,4,3.7,3.3,3.0,2.7,2.0,1.4,0],
  'H-': [4.3,4.3,4.0,3.6,3.3,3.0,2.3,1.7,0],
  'H': [4.5,4.5,4.2,3.8,3.5,3.2,2.5,1.9,0],
  'AH': [4.7,4.7,4.4,4.0,3.7,3.4,2.7,2.1,0],
  'AP': [5,5,4.7,4.3,4.0,3.7,3.0,2.4,0]
}

export type Course = {
  name: string,
  level: Levels,
  weight: number,
  midterm: number | null,
  final: number | null,
  term: number | null,
  overall: number | null,
  letter: string | null,
  GPA: number | null
}

function updateCourse(course: Course): Course {
    // Calculate the GPA for a course
    console.log('updateCourse')
    let totgrade = 0.3*(course.midterm??0) + 0.3*(course.term??0) + 0.4*(course.final??0);
    let totcred = ((course.midterm&&0.3)??0) + ((course.term&&0.3)??0) + ((course.final&&0.4)??0);
    let ovearll = totcred==0?null:totgrade/totcred;
    let letGrade = ovearll==null?null:getGrade(ovearll);
    let GPA = letGrade==null?null:LevelToGrade[course.level][letGrade];
    let letter = letGrade==null?null:LetterGrades[letGrade];
    console.log(ovearll, letGrade, GPA, letter)
    return {
        ...course,
        overall: ovearll,
        letter: letter,
        GPA: GPA
    }
}

function initCourse(name: string, level: Levels, weight: number): Course{
    return {
        name: name,
        level: level,
        weight: weight,
        midterm: null,
        final: null,
        term: null,
        overall: null,
        letter: null,
        GPA: null
    }
}

const calcGPA = (courses: Course[]) => {
    let totGPA = 0;
    let totWeight = 0;
    for (let course of courses) {
        if (course.GPA!=null) {
            totGPA += course.GPA*course.weight;
            totWeight += course.weight;
        }
    }
    return totWeight==0?null:totGPA/totWeight;
}

const defaultCourses: Course[] = [
    initCourse('Math', Levels.Standard, 5),
    initCourse('Language', Levels.Honor, 5),
    initCourse('Literature', Levels.Honor, 5),
    initCourse('AP1', Levels.AP, 5),
    initCourse('AP2', Levels.AP, 5),
    initCourse('Chinese', Levels.Standard, 3),
    initCourse('Elective', Levels.Standard, 3),
]

export { LetterGrades, getGrade, Levels, LevelToGrade, defaultCourses, updateCourse, calcGPA }