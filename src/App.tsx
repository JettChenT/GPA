import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { getGrade, Levels, LevelToGrade, LetterGrades, Course, defaultCourses, updateCourse, calcGPA, getRandCourses, initCourse} from './gradecalc'
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { TabToNextCellParams, CellPosition, CellPositionUtils } from 'ag-grid-community';

import { gradeClassRules, cellClassRules, totClassRules } from './styling';

import "@sjmc11/tourguidejs/src/scss/tour.scss" // Styles
import {TourGuideClient} from "@sjmc11/tourguidejs/src/Tour" // JS
import steps from './steps';

const numberParser = (params: { newValue: any }) => {
  const num = params.newValue?Number(params.newValue):NaN;
  return isNaN(num) ? null : num;
}

const tg = new TourGuideClient({
  steps:steps,
  backdropColor: "rgba(0,0,0,0.25)",
});

function App() {
  // const table = useReactTable()

  let [data, setData] = useState(defaultCourses)
  let [GlobGPA, setGlobGPA] = useState(calcGPA(data))
  const gridRef = useRef<any>()


  const [columnDefs] = useState([
    { field: 'name', editable:true, headerClass:'courses', rowDrag:true},
    { field: 'level', editable:true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['S', 'H-', 'H', 'AH', 'AP'] }, headerClass:'levels'},
    { field: 'weight', headerClass:'weights', editable:true, valueParser: numberParser},
    { field: 'term', editable:true, valueParser: numberParser, cellClassRules: cellClassRules, headerClass:'grades'},
    { field: 'midterm', editable:true, valueParser: numberParser, cellClassRules: cellClassRules, headerClass:'grades'},
    { field: 'final' , editable:true, valueParser: numberParser, cellClassRules: cellClassRules, headerClass:'grades'},
    { field: 'overall', valueGetter: (params: any) => {
      const newCourse = updateCourse(params.data);
      return newCourse.overall;
    }, cellClassRules: totClassRules, headerClass:'overall'},
    { field: 'letter', valueGetter: (params: any) => {
      const newCourse = updateCourse(params.data);
      return newCourse.letter;
    }, cellClassRules: gradeClassRules, headerClass:'letter'},
    { field: 'GPA', valueGetter: (params: any) => {
      const newCourse = updateCourse(params.data);
      return newCourse.GPA;
    }, headerClass:'gpacol'},
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

  useEffect(() => {
    tg.onAfterExit(() => {
      setData(defaultCourses);
      console.log('Exiting...')
      console.log(defaultCourses);
      setGlobGPA(null);
      gridRef.current.api.refreshCells();
    });
  }, []);
  return (
    <div className='container md:mx-auto h-screen'>
      <h1 className='text-3xl font-bold text-blue-700 mb-5' id='title'>GPA Calculator</h1>
      <div id='result'>Your estimated GPA is: {" "}
         <span className='text-blue-700'>{GlobGPA}</span>
      </div>
      <br/>
      
      <div className='ag-theme-alpine flex-auto h-2/3 mt-2'>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={colDef}
          onCellValueChanged={onCellValueChanged}
          rowDragManaged={true}
          tabToNextCell={(params: TabToNextCellParams) =>  {
            return {
              ...params.previousCellPosition,
              rowIndex: Math.min(params.previousCellPosition.rowIndex + 1, params.api.getDisplayedRowCount()-1),
            }
          }
        }
        >
        </AgGridReact>
      </div>
      <div className='space-x-2'>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4'
          onClick={() => {
            let nwcourse = initCourse('Course', Levels.Standard, 1);
            setData(data)
            console.log(data)
            // gridRef.current.api.refreshCells();
            gridRef.current.api.redrawRows();
            gridRef.current.api.updateRowData({
              add: [nwcourse],
              addIndex: data.length
            })
          }}
        >
          Add Course
        </button>
        <button 
          onClick={() => {
            let dat = getRandCourses();
            setData(dat);
            gridRef.current.api.updateRowData({})
            setGlobGPA(calcGPA(dat));
            tg.start();
          }}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4'
        >Tutorial</button>
      </div>
    </div>
  )
}

export default App
