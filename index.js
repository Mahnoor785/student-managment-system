"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var Course = /** @class */ (function () {
    function Course(name, fee) {
        this.name = name;
        this.fee = fee;
    }
    return Course;
}());
var Student = /** @class */ (function () {
    function Student(name) {
        this.name = name;
        this.courses = [];
        this.balance = 0;
        Student.idCounter += 1;
        this.studentID = this.generateStudentID();
    }
    Student.prototype.generateStudentID = function () {
        return Student.idCounter.toString().padStart(5, '0');
    };
    Student.prototype.enroll = function (course) {
        this.courses.push(course);
        this.balance += course.fee;
    };
    Student.prototype.payTuition = function (amount) {
        this.balance -= amount;
    };
    Student.prototype.getStatus = function () {
        var enrolledCourses = this.courses.map(function (course) { return course.name; }).join(', ');
        return "\n            Name: ".concat(this.name, "\n            Student ID: ").concat(this.studentID, "\n            Enrolled Courses: ").concat(enrolledCourses || 'None', "\n            Balance: $").concat(this.balance.toFixed(2), "\n        ");
    };
    Student.idCounter = 0;
    return Student;
}());
var StudentManagementSystem = /** @class */ (function () {
    function StudentManagementSystem() {
        this.students = [];
        this.courses = [];
    }
    StudentManagementSystem.prototype.addStudent = function (name) {
        var student = new Student(name);
        this.students.push(student);
        return student;
    };
    StudentManagementSystem.prototype.addCourse = function (name, fee) {
        var course = new Course(name, fee);
        this.courses.push(course);
        return course;
    };
    StudentManagementSystem.prototype.findStudent = function (studentID) {
        return this.students.find(function (student) { return student.studentID === studentID; });
    };
    StudentManagementSystem.prototype.listCourses = function () {
        return this.courses;
    };
    return StudentManagementSystem;
}());
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var sms = new StudentManagementSystem();
function showMenu() {
    console.log("\n        1. Add Student\n        2. Add Course\n        3. Enroll Student in Course\n        4. View Balance\n        5. Pay Tuition\n        6. Show Student Status\n        7. Exit\n    ");
    rl.prompt();
}
function handleUserInput(input) {
    switch (input.trim()) {
        case '1':
            rl.question('Enter student name: ', function (name) {
                var student = sms.addStudent(name);
                console.log("Student added with ID: ".concat(student.studentID));
                showMenu();
            });
            break;
        case '2':
            rl.question('Enter course name: ', function (courseName) {
                rl.question('Enter course fee: ', function (fee) {
                    sms.addCourse(courseName, parseFloat(fee));
                    console.log('Course added.');
                    showMenu();
                });
            });
            break;
        case '3':
            rl.question('Enter student ID: ', function (studentID) {
                var student = sms.findStudent(studentID);
                if (student) {
                    console.log('Available courses:');
                    sms.listCourses().forEach(function (course) { return console.log("".concat(course.name, " - $").concat(course.fee)); });
                    rl.question('Enter course name to enroll: ', function (courseName) {
                        var course = sms.listCourses().find(function (course) { return course.name === courseName; });
                        if (course) {
                            student.enroll(course);
                            console.log('Student enrolled in course.');
                        }
                        else {
                            console.log('Course not found.');
                        }
                        showMenu();
                    });
                }
                else {
                    console.log('Student not found.');
                    showMenu();
                }
            });
            break;
        case '4':
            rl.question('Enter student ID: ', function (studentID) {
                var student = sms.findStudent(studentID);
                if (student) {
                    console.log("Balance: $".concat(student.balance));
                }
                else {
                    console.log('Student not found.');
                }
                showMenu();
            });
            break;
        case '5':
            rl.question('Enter student ID: ', function (studentID) {
                var student = sms.findStudent(studentID);
                if (student) {
                    rl.question('Enter amount to pay: ', function (amount) {
                        student.payTuition(parseFloat(amount));
                        console.log('Payment successful.');
                        showMenu();
                    });
                }
                else {
                    console.log('Student not found.');
                    showMenu();
                }
            });
            break;
        case '6':
            rl.question('Enter student ID: ', function (studentID) {
                var student = sms.findStudent(studentID);
                if (student) {
                    console.log(student.getStatus());
                }
                else {
                    console.log('Student not found.');
                }
                showMenu();
            });
            break;
        case '7':
            rl.close();
            break;
        default:
            console.log('Invalid option.');
            showMenu();
            break;
    }
}
rl.on('line', handleUserInput);
showMenu();
