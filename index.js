document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('student-form');
    const recordsBody = document.getElementById('records-body');
    const addButton = document.getElementById('add-button');

    let editIndex = null; // Declare editIndex at the top level

    // Helper functions for local storage
    const getStoredStudents = () => JSON.parse(localStorage.getItem('students')) || [];
    const saveStudents = (students) => localStorage.setItem('students', JSON.stringify(students));

    // Render student records in the table
    const renderStudents = () => {
        recordsBody.innerHTML = ''; // Clear the table
        const students = getStoredStudents();
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="edit-button" data-index="${index}">Edit</button>
                    <button class="delete-button" data-index="${index}">Delete</button>
                </td>
            `;
            recordsBody.appendChild(row);
        });

        // Attach event listeners to buttons dynamically
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    };

    // Add a new student record
    const addStudent = () => {
        const name = document.getElementById('student-name').value.trim();
        const id = document.getElementById('student-id').value.trim();
        const email = document.getElementById('email').value.trim();
        const contact = document.getElementById('contact').value.trim();

        // Validation
        if (!name || !id || !email || !contact) {
            alert('All fields are required!');
            return;
        }

        const students = getStoredStudents();
        students.push({ name, id, email, contact });
        saveStudents(students);
        renderStudents();
        form.reset();
    };

    // Edit a student record
    const handleEdit = (event) => {
        const index = event.target.getAttribute('data-index');
        const students = getStoredStudents();
        const student = students[index];

        // Store the index of the student being edited
        editIndex = index; // Use the top-level editIndex variable

        // Fill the form with the student's current data
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-id').value = student.id;
        document.getElementById('email').value = student.email;
        document.getElementById('contact').value = student.contact;

        // Add a save changes button if not already present
        if (!document.getElementById('save-button')) {
            const saveButton = document.createElement('button');
            saveButton.id = 'save-button';
            saveButton.textContent = 'Save Changes';
            saveButton.addEventListener('click', saveChanges);
            form.appendChild(saveButton);
        }
    };

    // Save changes to a student record
    const saveChanges = () => {
        const name = document.getElementById('student-name').value.trim();
        const id = document.getElementById('student-id').value.trim();
        const email = document.getElementById('email').value.trim();
        const contact = document.getElementById('contact').value.trim();

        // Validation
        if (!name || !id || !email || !contact) {
            alert('All fields are required!');
            return;
        }

        const students = getStoredStudents();
        students[editIndex] = { name, id, email, contact };
        saveStudents(students);
        renderStudents();
        form.reset();

        // Remove the save button after saving changes
        const saveButton = document.getElementById('save-button');
        if (saveButton) {
            saveButton.remove();
        }

        // Reset editIndex
        editIndex = null;
    };

    // Delete a student record
    const handleDelete = (event) => {
        const index = event.target.getAttribute('data-index');
        const students = getStoredStudents();

        // Remove the student from the list
        students.splice(index, 1);
        saveStudents(students);
        renderStudents();
    };

    // Add event listener to the "Add Student" button
    addButton.addEventListener('click', addStudent);

    // Initial render of students
    renderStudents();
});