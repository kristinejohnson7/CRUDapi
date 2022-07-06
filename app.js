const http = require("http");
const express = require("express");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const port = 3001;

app.use(express.json());

const saveStudentsData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("students.json", stringifyData);
};

const getStudentData = () => {
  const jsonData = fs.readFileSync("students.json");
  return JSON.parse(jsonData);
};

const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(11);
};

const alphabetizeStudentsLastName = (arr, order) => {
  if (order === "asc") {
    return arr.sort((a, b) =>
      a.lastName.toLowerCase() < b.lastName.toLowerCase()
        ? -1
        : b.lastName.toLowerCase() > a.lastName.toLowerCase()
        ? 1
        : 0
    );
  }
  if (order === "desc") {
    return arr.sort((a, b) =>
      a.lastName.toLowerCase() < b.lastName.toLowerCase()
        ? 1
        : b.lastName.toLowerCase() > a.lastName.toLowerCase()
        ? -1
        : 0
    );
  }
};

//CREATE METHODS

//New student
app.post("/students/add", (req, res) => {
  const students = getStudentData();
  const requiredFields = [
    req.body.firstName,
    req.body.lastName,
    req.body.grade,
    req.body.classes,
  ];
  if (requiredFields.some((field) => field == undefined)) {
    return res
      .status(401)
      .send({ error: true, message: "Student data missing information" });
  }

  const newStudent = {
    id: generateUniqueId(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    createdOn: new Date(),
    updatedOn: "",
    grade: req.body.grade,
    classes: req.body.classes,
  };

  students.push(newStudent);
  saveStudentsData(students);
  res.send({ success: true, message: "Student added successfully" });
});

//READ METHODS

//Get all students
app.get("/students", (req, res) => {
  let students = getStudentData();
  const { sort, limit } = req.query;
  if (sort === "asc") {
    students = alphabetizeStudentsLastName(students, "asc");
  }
  if (sort === "desc") {
    students = alphabetizeStudentsLastName(students, "desc");
  }
  if (!!limit) {
    students.splice(limit);
  }
  res.send(students);
});

//Get classes for a student
app.get("/students/classes/:id", (req, res) => {
  const students = getStudentData();
  const found = students.find((student) => student.id == req.params.id);

  if (found) {
    res.status(200).json(found.classes);
  } else {
    res.sendStatus(404);
  }
});

//UPDATE METHODS

//update student profile
app.put("/student/:id", (req, res) => {
  const students = getStudentData();
  const found = students.find((student) => student.id === req.params.id);

  if (found) {
    const updated = {
      id: found.id,
      firstName: req.body.firstName || found.firstName,
      lastName: req.body.lastName || found.lastName,
      createdOn: req.body.createdOn || found.createdOn,
      updatedOn: new Date(),
      grade: req.body.grade || found.grade,
      classes: found.classes,
    };
    const targetIndex = students.indexOf(found);
    students.splice(targetIndex, 1, updated);
    saveStudentsData(students);
    res.send({ success: true, message: "Student updated successfully" });
  } else {
    res.sendStatus(404);
  }
});

//update classes
app.put("/student/classes/:id", (req, res) => {
  const students = getStudentData();
  let studentIndex = 0;
  const found = students.find((student, index) => {
    studentIndex = index;
    return student.id == req.params.id;
  });

  if (found) {
    const newClasses = [...found.classes];
    req.body.classes.forEach((className) => {
      if (newClasses.indexOf(className) < 0) {
        newClasses.push(className);
      }
    });
    students[studentIndex] = { ...students[studentIndex], classes: newClasses };
    saveStudentsData(students);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

//DELETE METHODS

//delete student
app.delete("/students/:id", (req, res) => {
  const students = getStudentData();
  const id = req.params.id;

  const filteredStudents = students.filter((student) => student.id !== id);

  if (students.length === filteredStudents.length) {
    return res
      .status(409)
      .send({ error: true, message: "Student does not exist" });
  }
  saveStudentsData(filteredStudents);
  res.send({ success: true, message: "Student deleted successfully" });
});

//delete classes
app.delete("/students/classes/:id", (req, res) => {
  const { className } = req.query;
  const students = getStudentData();
  let studentIndex = 0;
  const found = students.find((student, index) => {
    studentIndex = index;
    return student.id == req.params.id;
  });
  if (found) {
    const filteredClasses = found.classes.filter(
      (course) => course !== className
    );
    students[studentIndex] = {
      ...students[studentIndex],
      classes: filteredClasses,
    };
    saveStudentsData(students);
    res
      .status(200)
      .send({ success: true, message: "Class deleted successfully" });
  } else {
    res.sendStatus(404);
  }
});

server.listen(port, () => console.log(`server is listening on port ${port}`));
