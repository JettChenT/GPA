import { getGrade } from "./gradecalc"

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


export {cellClassRules, totClassRules, gradeClassRules};