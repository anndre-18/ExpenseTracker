const fs = require('fs');
const filePath = 'task1.json'; 

const createStudent = (newStudent) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading :', err);
      return;
    }
    let students = [];
    try {
      students = JSON.parse(data); 
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      return;
    }
    
    students.push(newStudent);

   
    fs.writeFile(filePath, JSON.stringify(students, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing :', writeErr);
        return;
      }
      console.log('Student added successfully!');
    });
  });
};

const readStudents = () => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading :', err);
        return;
      }
      let students = [];
      try {
        students = JSON.parse(data); 
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
        return;
      }
      console.log(students); 
    });
  };

const updateStudent = (rollNo, updatedInfo) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    let students = [];
    try {
      students = JSON.parse(data); // Parse the existing data
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      return;
    }

    // Find the student by rollNo and update their details
    const studentIndex = students.findIndex(student => student.rollNo === rollNo);
    if (studentIndex === -1) {
      console.log('Student not found!');
      return;
    }
    students[studentIndex] = { ...students[studentIndex], ...updatedInfo };

    fs.writeFile(filePath, JSON.stringify(students, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing to the file:', writeErr);
        return;
      }
      console.log('Student details updated successfully!');
    });
  });
};

// Function to Delete
const deleteStudent = (rollNo) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    let students = [];
    try {
      students = JSON.parse(data); 
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      return;
    }

    // Find the student by rollNo and delete them
    const updatedStudents = students.filter(student => student.rollNo !== rollNo);

    if (students.length === updatedStudents.length) {
      console.log('Student not found!');
      return;
    }

    // Write the updated array back to the file
    fs.writeFile(filePath, JSON.stringify(updatedStudents, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing to the file:', writeErr);
        return;
      }
      console.log('Student deleted successfully!');
    });
  });
};

// Example Usage:
// Create a new student
const newStudent = { name: 'Aiswarya', rollNo: '202301', dept: 'CSE', dob: '2003-01-01' };
createStudent(newStudent);

// Read all students
readStudents();

// Update a student
const updatedInfo = { name: 'Benny', dept: 'IT' };
updateStudent('202301', updatedInfo);

// Delete a student
deleteStudent('202301');