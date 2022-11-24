import {parse, unparse} from 'papaparse'
const LetterGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C', 'D', 'F']
const lbounds = [96.5,91.5,86.5,81.5,76.5,69.5,64.5,59.5,0]

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
    // console.log('updateCourse')
    let totgrade = 0.3*(course.midterm??0) + 0.3*(course.term??0) + 0.4*(course.final??0);
    let totcred = ((course.midterm&&0.3)??0) + ((course.term&&0.3)??0) + ((course.final&&0.4)??0);
    let ovearll = totcred==0?null:totgrade/totcred;
    let letGrade = ovearll==null?null:getGrade(ovearll);
    let GPA = letGrade==null?null:LevelToGrade[course.level][letGrade];
    let letter = letGrade==null?null:LetterGrades[letGrade];
    // console.log(ovearll, letGrade, GPA, letter)
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
    console.log(courses)
    for (let course of courses) {
        if (course.GPA!=null) {
            totGPA += course.GPA*course.weight;
            totWeight += course.weight;
        }
    }
    console.log(totGPA, totWeight)
    return totWeight==0?null:totGPA/totWeight;
}

const defaultCourses: Course[] = [
    initCourse('Math', Levels.Honor, 5),
    initCourse('Language', Levels.Honor, 5),
    initCourse('Literature', Levels.Honor, 5),
    initCourse('AP1', Levels.AP, 5),
    initCourse('AP2', Levels.AP, 5),
    initCourse('Chinese', Levels.Honor, 3),
    initCourse('Elective', Levels.Standard, 3),
]

const genScore = () => {
  // generate random score between 70 and 100
  return Math.floor(Math.random() * 30) + 70;
}

const getRandCourses = () => {
    let nwcourses: Course[] = structuredClone(defaultCourses);
    // enumerate indices of courses
    for (let i=0; i<nwcourses.length; i++) {
      nwcourses[i].midterm = genScore();
      nwcourses[i].final = genScore();
      nwcourses[i].term = genScore();
      nwcourses[i] = updateCourse(nwcourses[i]);
    }
    return nwcourses;
}

const exportToCSV= (dat: Course[]) => {
  const ret = window.btoa(unparse(dat));
  return ret;
}

const importFromCSV = (csvData: string) => {
  const ret = parse(window.atob(csvData), {header:true, dynamicTyping:true});
  return ret
}

function importFromJson(jsonData: string):Course[] {
  let data = JSON.parse(jsonData);
  return data;
}


export { LetterGrades, getGrade, Levels, LevelToGrade, defaultCourses, updateCourse, calcGPA, getRandCourses, initCourse, importFromJson, exportToCSV, importFromCSV}