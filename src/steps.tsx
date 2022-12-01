const steps = [
  {
    title: "Welcome",
    content: "This is a tool to help you estimate your GPA based on your current grades at SSBS.",
    target: "#title",
  },
  {
    title: "Courses",
    content: `
      Here are all of your courses. 
      Click on them to customize their name.
      `
    ,
    target: ".courses",
  },
  {
    title: "Enter Your Level",
    content: "Click on a cell in this column to customize your level for each course.",
    target: ".levels",
  },
  {
    title: "Grades",
    content: "Enter any of your grades in the Term, Midterm, and Final columns to get an estimated GPA.",
    target: ".grades",
  },
  {
    title: "Overall",
    content: `The Overall column shows the overall grade for each course, which is
      calculated as the weighted average of each score you entered
    `,
    target: ".overall",
  },
  {
    title: "Letter",
    content: "This column shows the corresponding letter grade.",
    target: ".letter",
  },
  {
    title: "GPA",
    content: "This column shows the GPA score calculated for each course.",
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
    content: "Click here to share a link to your GPA with others.",
    target: "#sharebtn",
  },
  {
    title: "About",
    content: "Go to this page for more information regarding this tool(eg. calculation mechanics, privacy protection...)",
    target: "#aboutpage"
  }
];

export default steps;
