export interface IQuiz{
  id:string;
  name:string;
  startTime:Date|null;
  endTime:Date|null;
  marks:number;
  attempts:string;
  result:string
}

export class Quiz{
  id:string;
  name:string;
  startTime:Date|null;
  endTime:Date|null;
  marks:number;
  attempts:string;
  result:string
  constructor(data?:IQuiz){
    this.id=data?data.id:"";
    this.name=data?data.name:"";
    this.startTime=data?data.startTime:null;
    this.endTime=data?data.endTime:null;
    this.marks=data?data.marks:0;
    this.attempts=data?data.attempts:"0/0";
    this.result=data?data.result:"";

  }
}