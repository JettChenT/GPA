import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import {
  getGrade,
  Levels,
  LevelToGrade,
  LetterGrades,
  Course,
  defaultCourses,
  updateCourse,
  calcGPA,
  getRandCourses,
  initCourse,
  exportToCSV,
  importFromCSV,
} from "./gradecalc";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  TabToNextCellParams,
  CellPosition,
  CellPositionUtils,
} from "ag-grid-community";

import { gradeClassRules, cellClassRules, totClassRules } from "./styling";

import "@sjmc11/tourguidejs/src/scss/tour.scss"; // Styles
import { TourGuideClient } from "@sjmc11/tourguidejs/src/Tour"; // JS
import steps from "./steps";

import { useSearchParams } from "react-router-dom";
import {AcademicCapIcon, ShareIcon, PlusCircleIcon} from "@heroicons/react/24/outline"

const numberParser = (params: { newValue: any }) => {
  const num = params.newValue ? Number(params.newValue) : NaN;
  return isNaN(num) ? null : num;
};

const tg = new TourGuideClient({
  steps: steps,
  backdropColor: "rgba(0,0,0,0.25)",
});

const discell = (n: number | null) => {
  return n ? n.toFixed(1) : null;
};

function App() {
  // const table = useReactTable()
  const [searchParams] = useSearchParams();
  let [data, setData] = useState(
    window.location.hash
      ? (importFromCSV(window.location.hash.substring(1) ?? "").data as any)
      : defaultCourses
  );
  console.log(window.location.hash);
  let [shareText, setShareText] = useState("Share");
  let [GlobGPA, setGlobGPA] = useState(calcGPA(data));
  const gridRef = useRef<any>();

  const [columnDefs] = useState([
    { field: "name", editable: true, headerClass: "courses", rowDrag: true, minWidth: 120 },
    {
      field: "level",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["S", "H-", "H", "AH", "AP"] },
      headerClass: "levels",
      minWidth: 70,
    },
    {
      field: "weight",
      headerClass: "weights",
      editable: true,
      valueParser: numberParser,
      minWidth:100,
    },
    {
      field: "term",
      editable: true,
      valueParser: numberParser,
      cellClassRules: cellClassRules,
      valueGetter: (o: any) => discell(o.data.term),
      headerClass: "grades",
      minWidth:100
    },
    {
      field: "midterm",
      editable: true,
      valueParser: numberParser,
      cellClassRules: cellClassRules,
      valueGetter: (o: any) => discell(o.data.midterm),
      headerClass: "grades",
      minWidth:100
    },
    {
      field: "final",
      editable: true,
      valueParser: numberParser,
      cellClassRules: cellClassRules,
      valueGetter: (o: any) => discell(o.data.final),
      headerClass: "grades",
      minWidth:100
    },
    {
      field: "overall",
      valueGetter: (params: any) => {
        const newCourse = updateCourse(params.data);
        return discell(newCourse.overall);
      },
      cellClassRules: totClassRules,
      headerClass: "overall",
      minWidth:100
    },
    {
      field: "letter",
      valueGetter: (params: any) => {
        const newCourse = updateCourse(params.data);
        return newCourse.letter;
      },
      cellClassRules: gradeClassRules,
      headerClass: "letter",
      minWidth:100
    },
    {
      field: "GPA",
      valueGetter: (params: any) => {
        const newCourse = updateCourse(params.data);
        return newCourse.GPA;
      },
      headerClass: "gpacol",
      minWidth:100
    },
  ]);

  const colDef = useMemo(
    () => ({
      flex: 1,
      sortable: true,
      resizable: false,
      singleClickEdit: true,
      // editable: true,
    }),
    []
  );
  const onCellValueChanged = useCallback(
    (event: { data: Course; rowIndex: number | null }) => {
      let newdat = updateCourse(event.data);
      event.data = newdat;
      console.log(event.rowIndex);
      if (event.rowIndex != null) {
        data[event.rowIndex] = newdat;
        setData(data);
        setGlobGPA(calcGPA(data));
      }
      setShareText("Share");
    },
    []
  );

  useEffect(() => {
    tg.onAfterExit(() => {
      setData(defaultCourses);
      console.log("Exiting...");
      console.log(defaultCourses);
      setGlobGPA(null);
      gridRef.current.api.refreshCells();
    });
  }, []);
  return (
    <div className="container md:mx-auto h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-5 mt-3" id="title">
        GPA Calculator
      </h1>
      <span className="text-gray-500 md:hidden">Note: use a computer for a better experience</span>
      <div id="result">
        Your estimated GPA is: {" "}
          {GlobGPA?
            <span className="text-blue-600">{GlobGPA.toFixed(3)}</span>
            :<span className="text-gray-500">Enter any of your scores to get an estmate</span>
          }
      </div>
      <br />

      <div className="ag-theme-alpine flex-auto h-2/3 mt-2">
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={colDef}
          onCellValueChanged={onCellValueChanged}
          rowDragManaged={true}
          tabToNextCell={(params: TabToNextCellParams) => {
            return {
              ...params.previousCellPosition,
              rowIndex: Math.min(
                params.previousCellPosition.rowIndex + 1,
                params.api.getDisplayedRowCount() - 1
              ),
            };
          }}
        ></AgGridReact>
      </div>
      <div className="space-x-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
          onClick={() => {
            let nwcourse = initCourse("Course", Levels.Standard, 1);
            setData(data);
            console.log(data);
            gridRef.current.api.redrawRows();
            gridRef.current.api.updateRowData({
              add: [nwcourse],
              addIndex: data.length,
            });
          }}
          id="addcourse"
        >
          <PlusCircleIcon className="w-5 h-5 inline-block mr-2"/>
          Add Course
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
          onClick={() => {
            const res = exportToCSV(data);
            const udat = encodeURIComponent(res);
            const nurl = `${window.location.origin}/#${udat}`;
            navigator.clipboard.writeText(nurl);
            setShareText("Copied to clipboard!");
          }}
          id="sharebtn"
        >
          <ShareIcon className="w-5 h-5 inline-block mr-2"/>
          {shareText}
        </button>
        <button
          onClick={() => {
            let dat = getRandCourses();
            setData(dat);
            gridRef.current.api.updateRowData({});
            setGlobGPA(calcGPA(dat));
            tg.start();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
        >
          <AcademicCapIcon className="w-5 h-5 inline-block mr-2"/>
          Tutorial
        </button>
      </div>
    </div>
  );
}

export default App;
