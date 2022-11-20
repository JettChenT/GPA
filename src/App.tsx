import { useCallback, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { getGrade, Levels, LevelToGrade, LetterGrades, Course, defaultCourses, updateCourse, calcGPA} from './gradecalc'
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { TabToNextCellParams, CellPosition, CellPositionUtils } from 'ag-grid-community';

const numberParser = (params: { newValue: any }) => {
  const num = params.newValue?Number(params.newValue):NaN;
  return isNaN(num) ? null : num;
}

const cellClassRules = {
  'bg-green-300/50': (params: { value: number }) => getGrade(params.value) === 0,
  'bg-green-200/50': (params: { value: number }) => getGrade(params.value) === 1,
  'bg-green-100/50': (params: { value: number }) => getGrade(params.value) === 2,
  'bg-yellow-100/50': (params: { value: number }) => getGrade(params.value) === 3,
  'bg-yellow-200/50': (params: { value: number }) => getGrade(params.value) === 4,
  'bg-yellow-300/50': (params: { value: number }) => getGrade(params.value) === 5,
  'bg-red-200/50': (params: { value: number }) => getGrade(params.value) === 6,
  'bg-red-300/50': (params: { value: number }) => getGrade(params.value) === 7,
  'bg-red-400/50': (params: { value: number }) => getGrade(params.value) === 8,
  'bg-slate-200/50': (params: { value: any }) => getGrade(params.value) === null,
}

const totClassRules = {
  'bg-green-300/50': (params: { value: number }) => getGrade(params.value) === 0,
  'bg-green-200/50': (params: { value: number }) => getGrade(params.value) === 1,
  'bg-green-100/50': (params: { value: number }) => getGrade(params.value) === 2,
  'bg-yellow-100/50': (params: { value: number }) => getGrade(params.value) === 3,
  'bg-yellow-200/50': (params: { value: number }) => getGrade(params.value) === 4,
  'bg-yellow-300/50': (params: { value: number }) => getGrade(params.value) === 5,
  'bg-red-200/50': (params: { value: number }) => getGrade(params.value) === 6,
  'bg-red-300/50': (params: { value: number }) => getGrade(params.value) === 7,
  'bg-red-400/50': (params: { value: number }) => getGrade(params.value) === 8,
}

const gradeClassRules = {
  'bg-green-300/50': (params: { value: any}) => params.value === 'A+',
  'bg-green-200/50': (params: { value: any}) => params.value === 'A',
  'bg-green-100/50': (params: { value: any}) => params.value === 'A-',
  'bg-yellow-100/50': (params: { value:any}) => params.value === 'B+',
  'bg-yellow-200/50': (params: { value:any}) => params.value === 'B',
  'bg-yellow-300/50': (params: { value:any}) => params.value === 'B-',
  'bg-red-200/50': (params: { value: any}) => params.value === 'C',
  'bg-red-300/50': (params: { value: any}) => params.value === 'D',
  'bg-red-400/50': (params: { value: any}) => params.value === 'F',
}


function App() {
  // const table = useReactTable()

  let [data, setData] = useState(defaultCourses)
  let [GlobGPA, setGlobGPA] = useState(calcGPA(data))

  const [columnDefs] = useState([
    { field: 'name', editable:true},
    { field: 'level', editable:true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['S', 'H-', 'H', 'AH', 'AP'] } },
    { field: 'weight'},
    { field: 'term', editable:true, valueParser: numberParser, cellClassRules: cellClassRules},
    { field: 'midterm', editable:true, valueParser: numberParser, cellClassRules: cellClassRules},
    { field: 'final' , editable:true, valueParser: numberParser, cellClassRules: cellClassRules},
    { field: 'overall', valueGetter: (params: any) => {
      const newCourse = updateCourse(params.data);
      return newCourse.overall;
    }, cellClassRules: totClassRules},
    { field: 'letter', valueGetter: (params: any) => {
      const newCourse = updateCourse(params.data);
      return newCourse.letter;
    }, cellClassRules: gradeClassRules},
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
      <h1 className='text-3xl font-bold text-blue-700 mb-5'>G10 GPA Calculator</h1>
      {GlobGPA?
        <span>Your estimated GPA is: <span className='text-blue-700'>{GlobGPA}</span></span>  
      :<span>Enter any of your scores to get an estimated GPA.</span>}
      
      <div className='ag-theme-alpine flex-auto h-3/4'>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={colDef}
          onCellValueChanged={onCellValueChanged}
          tabToNextCell={(params: TabToNextCellParams) =>  {
            return {
              ...params.previousCellPosition,
              rowIndex: params.previousCellPosition.rowIndex + 1,
            }
          }}
        >
        </AgGridReact>
      </div>
    </div>
  )
}

export default App
