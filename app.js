const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const random = require("generaterandom");
const cors = require("cors");
const helmet = require("helmet");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 1000,
    },
  })
);
app.use(helmet());

app.use("/login", (req, res, next) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const { mail, password } = req.body;
  const user = db.users.find(
    (user) => user.mail === mail && user.password === password
  );
  if (!user) {
    res.json({
      status: false,
      detail: "Invalid Username/Password",
      summary: "Invalid Credentials",
      severity: "error",
      data: {
        user: {},
        isLoggedIn: false,
        token: "",
      },
    });
  } else {
    req.session.user = user;
    res.json({
      status: true,
      detail: null,
      summary: null,
      severity: null,
      data: {
        user: user,
        isLoggedIn: true,
        token: random.string(10),
      },
    });
  }
});

app.use("/signup", (req, res, next) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const { mail, password, isAdmin } = req.body;
  const user = db.users.find((user) => user.mail === mail);
  if (user) {
    return res.json({
      status: false,
      detail: "User already exist",
      summary: "Error",
      severity: "error",
      data: null,
    });
  }
  db.users.push({
    id: random.alphanumeric(10),
    mail: mail,
    password: password,
    isAdmin: isAdmin,
  });
  fs.writeFileSync("./db.json", JSON.stringify(db));
  return res.json({
    status: true,
    detail: "User created successfully",
    summary: "Success",
    severity: "success",
    data: null,
  });
});

app.use("/createquiz", (req, res, next) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const { id, name, startTime, endTime, marks, result,quizQuestions,noAttempts,attempted } = req.body;
  let newQuiz={ id:id,noAttempts, name, startTime, endTime, marks, result,quizQuestions };
  let quizIndex = db.quizlist.findIndex(quiz=>quiz.id===id);
  if(quizIndex>=0 && newQuiz.id){
    newQuiz.id=id
    db.quizlist[quizIndex]=newQuiz;
  }else{
    newQuiz.id=random.string(10);
    newQuiz.result=[];
    db.quizlist.push(newQuiz);
  }
  fs.writeFileSync("./db.json", JSON.stringify(db));
  return res.json({
    status: true,
    detail: "Quiz created successfully",
    summary: "Success",
    severity: "success",
    data: newQuiz,
  });
});

app.use("/editquiz", (req, res, next) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const { id } = req.body;
  const quizIndex=db.quizlist.findIndex(quiz=>quiz.id==id);
  if(quizIndex>=0){
  return res.json({
    status: true,
    detail: "",
    summary: "",
    severity: "",
    data: db.quizlist[quizIndex],
  });
  }else{
    return res.json({
      status: false,
      detail: "Quiz failed to edit",
      summary: "Error",
      severity: "error",
      data: null,
    });
  }

});

app.use("/deletequiz", (req, res, next) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const { id} = req.body;
  const quizIndex=db.quizlist.findIndex(quiz=>quiz.id==id);
  if(quizIndex>=0){
    db.quizlist=db.quizlist.filter(quiz=>quiz.id!==id);
    fs.writeFileSync("./db.json", JSON.stringify(db));
  return res.json({
    status: true,
    detail: "Quiz deleted successfully",
    summary: "Success",
    severity: "success",
    data: db.quizlist,
  });
  }else{
    return res.json({
      status: false,
      detail: "Quiz failed to delete",
      summary: "Error",
      severity: "error",
      data: null,
    });
  }

});

app.use("/getquiz", (req, res, next) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const { id} = req.body;
  const quizIndex=db.quizlist.findIndex(quiz=>auiz.id==id);
  if(quizIndex>0){
  return res.json({
    status: true,
    detail: "",
    summary: "",
    severity: "",
    data: db.quizlist[quizIndex],
  });
  }else{
    return res.json({
      status: false,
      detail: "Quiz does not exist",
      summary: "Error",
      severity: "error",
      data: null,
    });
  }

});

app.use("/getquizquestions", (req, res, next) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const { id} = req.body;
  const quizIndex=db.quizlist.findIndex(quiz=>auiz.id==id);
  if(quizIndex>0){
  return res.json({
    status: true,
    detail: "",
    summary: "",
    severity: "",
    data: db.quizlist[quizIndex]
  });
  }else{
    return res.json({
      status: false,
      detail: "Quiz does not exist",
      summary: "Error",
      severity: "error",
      data: null,
    });
  }

});

app.use("/getquizlist", (req, res, next) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  db.quizlist.forEach(quiz => {
    if(!req.session.user.isAdmin){
      quiz.result=quiz.result.filter((result)=>{
        return result.userId===req.session.user.mail
      });
    }
    delete quiz.quizQuestions;
  });
  return res.json({
    status: true,
    detail: "",
    summary: "",
    severity: "",
    data: db.quizlist,
  });

});

app.use("/submitquiz",(req,res,next)=>{
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const {userId,id,quizQuestions} = req.body;

  let quizIndex=db.quizlist.findIndex(quiz=>quiz.id===id);
  if(quizIndex>=0){
    let score=0;
    let tmarks=0;
    quizQuestions.forEach((question)=>{
      if(question.options[question.actualAnswer]===question.selectedAnswer){
        score++;
      }
      tmarks+=question.marks;
    });
    let percent = score/tmarks*100;
    let grade = percent>50?'Passed':'Failed';
    let resultIndex = db.quizlist[quizIndex].result.findIndex(r=>r.id===id);
    let result={
      id:id,
      userId:userId,
      score:score,
      grade:grade,
      attempts:1
    }
    if(resultIndex>=0){
      result.attempts=db.quizlist[quizIndex].result[resultIndex].attempts;
      result.attempts+=1;
      db.quizlist[quizIndex].result[resultIndex]=result;
    }else{
      db.quizlist[quizIndex].result.push(result);
    }
    fs.writeFileSync("./db.json", JSON.stringify(db));
    return res.json({
      status: true,
      detail: "Quiz submitted successfully",
      summary: "Success",
      severity: "success",
      data: null,
    });
  }else{
    return res.json({
      status: false,
      detail: "Failed to submit the quiz",
      summary: "Error",
      severity: "error",
      data: null,
    });
  }
})

app.use("*", (req, res, next) => {
  res.status(404);
  res.json({ message: "Page Not Found" });
});

app.listen(3000, () => {
  console.log("server started");
  if (fs.existsSync("./db.json")) {
    return;
  }
  fs.writeFileSync(
    "./db.json",
    `
  {
    "users": [

    ],
    quizlist:[]
  }
  `
  );
});
