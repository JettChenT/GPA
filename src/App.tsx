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
import MobilePopup from "./MobilePopup";

import "@sjmc11/tourguidejs/src/scss/tour.scss"; // Styles
import { TourGuideClient } from "@sjmc11/tourguidejs/src/Tour"; // JS
import steps from "./steps";

import { useSearchParams } from "react-router-dom";
import {AcademicCapIcon, ShareIcon, PlusCircleIcon, MinusCircleIcon} from "@heroicons/react/24/outline"

import { Footer } from "react-daisyui";

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
      ? (importFromCSV(window.decodeURIComponent(window.location.hash.substring(1)) ?? "").data as any)
      : defaultCourses
  );
  console.log(window.location.hash);
  let [shareText, setShareText] = useState("Share");
  let [GlobGPA, setGlobGPA] = useState(calcGPA(data));
  const gridRef = useRef<any>();

  const [columnDefs] = useState([
    { field: "name", editable: true, headerClass: "courses", rowDrag: true, singleClickEdit: false,minWidth: 120 },
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
      setGlobGPA(calcGPA(data));
      gridRef.current.api.refreshCells();
    });
  }, []);
  return (
    <div className="container md:mx-auto h-screen">
      <h1 className="text-3xl font-bold text-primary mb-5 mt-3" id="title">
        GPA Calculator
      </h1>
      <span className="text-neutral md:hidden">This is optimized for PCs, but here's the {" "}
        <span className="text-primary">
          <MobilePopup/>
        </span>
      </span>
      <div id="result">
        Your estimated GPA is: {" "}
          {GlobGPA!=null?
            <span className="text-primary">{GlobGPA.toFixed(3)}</span>
            :<span className="text-gray-400">Enter any of your scores to get an estimate</span>
          }
      </div>
      <br />

      <div className="ag-theme-alpine flex-auto h-2/3 my-2">
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={colDef}
          onCellValueChanged={onCellValueChanged}
          rowDragManaged={true}
          stopEditingWhenCellsLoseFocus={true}
          tabToNextCell={(params: TabToNextCellParams) => {
            var newind = params.previousCellPosition.rowIndex + (params.backwards ? -1 : 1);
            if(newind<0){newind=0}
            if(newind>=data.length){newind=data.length-1}
            return {
              ...params.previousCellPosition,
              rowIndex: newind
          }}}
        ></AgGridReact>
      </div>
      <div className="space-x-2">
        <button
          className="btn btn-primary"
          onClick={() => {
            let nwcourse = initCourse("Course", Levels.Standard, 1);
            data.push(nwcourse);
            setData(data);
            console.log(data);
            gridRef.current.api.redrawRows();
            gridRef.current.api.applyTransaction({
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
          className="btn btn-primary" 
          onClick={() => {
            const selected = gridRef.current.api.getFocusedCell();
            console.log(selected)
            data.splice(selected.rowIndex, 1);
            setData(data);
            console.log(data);
            gridRef.current.api.redrawRows();
            gridRef.current.api.setRowData(data);
            setGlobGPA(calcGPA(data));
          }}
        >
          <MinusCircleIcon className="w-5 h-5 inline-block mr-2"/>
          Delete Course
        </button>
        <button
          className="btn btn-primary"
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
          className="btn btn-primary"
        >
          <AcademicCapIcon className="w-5 h-5 inline-block mr-2"/>
          Tutorial
        </button>
        <br/>
        
        <div className="footer p-3 mt-5 footer-center text-base-content bg-base-200 rounded">
          <div className="grid grid-flow-col gap-3">
            <a id="aboutpage" className="link link-hover" href="https://github.com/JettChenT/GPA/blob/main/README.md">About</a>
            {" "}
            <a className="link link-hover" href="https://www.bilibili.com/video/BV1L44y1U74Q/">Demo</a>
            {" "}
            <MobilePopup/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
