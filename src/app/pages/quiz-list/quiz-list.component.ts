import { Subscription } from 'rxjs';
import { IUser, User } from './../../utils/Models/User';
import { DataStoreService } from './../../services/store/data-store.service';
import { Router } from '@angular/router';
import { IQuiz, Quiz } from './../../utils/Models/Quiz';
import { ITable } from './../../utils/Models/ITable';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit,OnDestroy {

  quizList:ITable;
  selectedQuiz:IQuiz;
  user:IUser;
  userSub!:Subscription;

  constructor(private confirmationService: ConfirmationService,private router:Router,private store:DataStoreService) {
    this.quizList={
      header:[
        {header:'Quiz Name',field:'name',type:'string'},
        {header:'Start Time',field:'startTime',type:'date'},
        {header:'End Time',field:'endTime',type:'date'},
        {header:'Marks',field:'marks',type:'number'},
        {header:'No of Attempts',field:'attempts',type:'string'},
        {header:'Result',field:'result',type:'string'}
      ],
      body:[
        {id:"1",name:"Quizz",startTime:new Date(),endTime:new Date(),marks:100,attempts:"10/10",result:"Not Evaluated"},
        {id:"2",name:"Quizz",startTime:new Date(),endTime:new Date(),marks:100,attempts:"10/10",result:"Not Evaluated"},
        {id:"3",name:"Quizz",startTime:new Date(),endTime:new Date(),marks:100,attempts:"10/10",result:"Not Evaluated"},
        {id:"4",name:"Quizz",startTime:new Date(),endTime:new Date(),marks:100,attempts:"10/10",result:"Not Evaluated"},
        {id:"5",name:"Quizz",startTime:new Date(),endTime:new Date(),marks:100,attempts:"10/10",result:"Not Evaluated"},
        {id:"6",name:"Quizz",startTime:new Date(),endTime:new Date(),marks:100,attempts:"10/10",result:"Not Evaluated"},
        {id:"7",name:"Quizz",startTime:new Date(),endTime:new Date(),marks:100,attempts:"10/10",result:"Not Evaluated"}
      ]
    }
    this.selectedQuiz=new Quiz();
    this.user=new User();
   }

  ngOnInit(): void {
    this.userSub=this.store.user.subscribe((user:IUser)=>{
      this.user=user;
      this.user.isAdmin=true;
    })
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }



  onAttempt(){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key:"attempt",
      accept: () => {
        this.router.navigateByUrl("/home/quiz");
      }
  });
  }



  onDelete(){

  }



}
