const steps = [
  {
    title: "Welcome",
    content: "This is a tool to help you estimate your GPA based on your current grades at SSBS.",
    target: "#title",
  },
  {
    title: "Courses",
    content: "Here are the names to all of your courses, click on them to customize their name.",
    target: ".courses",
  },
  {
    title: "Enter Your Level",
    content: "The levels are the different classes you can take. Each level has a different GPA value. Click on a cell in this column to customize your level for each course.",
    target: ".levels",
  },
  {
    title: "Grades",
    content: "Enter any of your grades in the Term, Midterm, and Final columns to get an estimated GPA.",
    target: ".grades",
  },
  {
    title: "Overall",
    content: `The Overall column shows your overall grade for each course. 
        This is equal to 0.3*Termscore+0.3*Midterm+0.4*Final. 
        If you have not entered a grade for a course, the overall grade will be estimated based on existing grades.
        For example, a Midterm of 80 and a Final of 90 without a termscore would result in an overall grade of (0.3*80+0.4*90)/(0.3+0.4) = 85.71
    `,
    target: ".overall",
  },
  {
    title: "Letter",
    content: "The Letter column shows the letter grade for each course computed from the overall grade.",
    target: ".letter",
  },
  {
    title: "GPA",
    content: "The GPA column shows the GPA value for each course derived from its letter grade",
    target: ".gpacol",
    },
  {
    title: "Final GPA",
    content: "Enter any of your scores and the final GPA will be computed for you here.",
    target: '#result',
  },
  {
    title: "Add a Course",
    content: "Click here to add a new course.",
    target: "#addcourse",
  },
  {
    title: "Share",
    content: "Click here to share a link to your GPA with others. Note: Your data will *not* be stored on any servers.",
    target: "#sharebtn",
  }
];

export default steps;
