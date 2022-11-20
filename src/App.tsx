import { useCallback, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { getGrade, Levels, LevelToGrade, LetterGrades, Course, defaultCourses, updateCourse, calcGPA} from './gradecalc'
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const numberParser = (params: { newValue: any }) => {
  const num = params.newValue?Number(params.newValue):NaN;
  return isNaN(num) ? null : num;
}

function App() {
  // const table = useReactTable()

  let [data, setData] = useState(defaultCourses)
  let [GlobGPA, setGlobGPA] = useState(calcGPA(data))

  const [columnDefs] = useState([
    { field: 'name', editable:true},
    { field: 'level', editable:true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['S', 'H-', 'H', 'AH', 'AP'] } },
    { field: 'weight'},
    { field: 'term', editable:true, valueParser: numberParser},
    { field: 'midterm', editable:true, valueParser: numberParser},
    { field: 'final' , editable:true, valueParser: numberParser},
    { field: 'overall', valueGetter: (params: any) => {
      const newCourse = updateCourse(params.data);
      return newCourse.overall;
    }},
    { field: 'letter', valueGetter: (params: any) => {
      const newCourse = updateCourse(params.data);
      return newCourse.letter;
    }},
    { field: 'GPA', valueGetter: (params: any) => {
      const newCourse = updateCourse(params.data);
      return newCourse.GPA;
    }},
  ])

  const colDef = useMemo(() => ({
    flex: 1,
    sortable: true,
    resizable: true,
    singleClickEdit: true,
    // editable: true,
  }), [])

  const onCellValueChanged = useCallback((event: { data: Course, rowIndex: number |null }) => {
    let newdat = updateCourse(event.data);
    event.data = newdat;
    console.log(event.rowIndex);
    if (event.rowIndex!=null) {
      data[event.rowIndex] = newdat;
      setData(data);
      setGlobGPA(calcGPA(data));
    }
    console.log(data);
  }, []);

  return (
    <div className='container md:mx-auto h-screen'>
      <h1 className='text-3xl text-blue-700'>G10 GPA Calculator</h1>
      <br></br>
      {GlobGPA?
        <span>Your estimated GPA is: {GlobGPA}</span>  
      :<span>Enter any of your scores to get an estimated GPA.</span>}
      
      <div className='ag-theme-alpine flex-auto h-3/4'>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={colDef}
          onCellValueChanged={onCellValueChanged}
        >
        </AgGridReact>
      </div>
    </div>
  )
}

export default App
