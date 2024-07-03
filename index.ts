import * as readline from 'readline';

class Course {
    constructor(public name: string, public fee: number) {}
}

class Student {
    private static idCounter: number = 0;
    public readonly studentID: string;
    public courses: Course[] = [];
    public balance: number = 0;

    constructor(public name: string) {
        Student.idCounter += 1;
        this.studentID = this.generateStudentID();
    }

    private generateStudentID(): string {
        return Student.idCounter.toString().padStart(5, '0');
    }

    enroll(course: Course): void {
        this.courses.push(course);
        this.balance += course.fee;
    }

    payTuition(amount: number): void {
        this.balance -= amount;
    }

    getStatus(): string {
        const enrolledCourses = this.courses.map(course => course.name).join(', ');
        return `
            Name: ${this.name}
            Student ID: ${this.studentID}
            Enrolled Courses: ${enrolledCourses || 'None'}
            Balance: $${this.balance.toFixed(2)}
        `;
    }
}

class StudentManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];

    addStudent(name: string): Student {
        const student = new Student(name);
        this.students.push(student);
        return student;
    }

    addCourse(name: string, fee: number): Course {
        const course = new Course(name, fee);
        this.courses.push(course);
        return course;
    }

    findStudent(studentID: string): Student | undefined {
        return this.students.find(student => student.studentID === studentID);
    }

    listCourses(): Course[] {
        return this.courses;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sms = new StudentManagementSystem();

function showMenu() {
    console.log(`
        1. Add Student
        2. Add Course
        3. Enroll Student in Course
        4. View Balance
        5. Pay Tuition
        6. Show Student Status
        7. Exit
    `);
    rl.prompt();
}

function handleUserInput(input: string) {
    switch (input.trim()) {
        case '1':
            rl.question('Enter student name: ', name => {
                const student = sms.addStudent(name);
                console.log(`Student added with ID: ${student.studentID}`);
                showMenu();
            });
            break;
        case '2':
            rl.question('Enter course name: ', courseName => {
                rl.question('Enter course fee: ', fee => {
                    sms.addCourse(courseName, parseFloat(fee));
                    console.log('Course added.');
                    showMenu();
                });
            });
            break;
        case '3':
            rl.question('Enter student ID: ', studentID => {
                const student = sms.findStudent(studentID);
                if (student) {
                    console.log('Available courses:');
                    sms.listCourses().forEach(course => console.log(`${course.name} - $${course.fee}`));
                    rl.question('Enter course name to enroll: ', courseName => {
                        const course = sms.listCourses().find(course => course.name === courseName);
                        if (course) {
                            student.enroll(course);
                            console.log('Student enrolled in course.');
                        } else {
                            console.log('Course not found.');
                        }
                        showMenu();
                    });
                } else {
                    console.log('Student not found.');
                    showMenu();
                }
            });
            break;
        case '4':
            rl.question('Enter student ID: ', studentID => {
                const student = sms.findStudent(studentID);
                if (student) {
                    console.log(`Balance: $${student.balance}`);
                } else {
                    console.log('Student not found.');
                }
                showMenu();
            });
            break;
        case '5':
            rl.question('Enter student ID: ', studentID => {
                const student = sms.findStudent(studentID);
                if (student) {
                    rl.question('Enter amount to pay: ', amount => {
                        student.payTuition(parseFloat(amount));
                        console.log('Payment successful.');
                        showMenu();
                    });
                } else {
                    console.log('Student not found.');
                    showMenu();
                }
            });
            break;
        case '6':
            rl.question('Enter student ID: ', studentID => {
                const student = sms.findStudent(studentID);
                if (student) {
                    console.log(student.getStatus());
                } else {
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
