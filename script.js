const API_URL = const API_URL = 'https://student-info-backend-7hnb.onrender.com/students';

const maxDisplay = 50;

const form = document.getElementById('studentForm');
const studentsList = document.getElementById('studentsList');
const searchInput = document.getElementById('searchInput');

let students = [];

// Fetch students from backend
async function fetchStudents() {
  try {
    const res = await fetch(API_URL);
    students = await res.json();
    displayStudents(students);
  } catch (error) {
    alert('Failed to fetch students.');
  }
}

// Display students in table (limit to maxDisplay)
function displayStudents(data) {
  studentsList.innerHTML = '';

  const filtered = data.slice(0, maxDisplay);

  if (filtered.length === 0) {
    studentsList.innerHTML = `<tr><td colspan="8" class="text-center">No students found.</td></tr>`;
    return;
  }

  filtered.forEach((student) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.studentID}</td>
      <td>${student.fullName}</td>
      <td>${student.gender}</td>
      <td>${student.gmail}</td>
      <td>${student.program}</td>
      <td>${student.yearLevel}</td>
      <td>${student.university}</td>
      <td>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${student.studentID}">
          Delete
        </button>
      </td>
    `;
    studentsList.appendChild(tr);
  });

  // Attach delete handlers
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      deleteStudent(id);
    });
  });
}

// Add new student
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newStudent = {
    studentID: form.studentID.value.trim(),
    fullName: form.fullName.value.trim(),
    gender: form.gender.value,
    gmail: form.gmail.value.trim(),
    program: form.program.value.trim(),
    yearLevel: form.yearLevel.value.trim(),
    university: form.university.value.trim(),
  };

  // Basic validation
  if (
    !newStudent.studentID ||
    !newStudent.fullName ||
    !newStudent.gender ||
    !newStudent.gmail ||
    !newStudent.program ||
    !newStudent.yearLevel ||
    !newStudent.university
  ) {
    alert('Please fill all fields.');
    return;
  }

  // Gmail format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newStudent.gmail)) {
    alert('Invalid Gmail format.');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Failed to add student.');
      return;
    }

    alert('Student added successfully.');
    form.reset();
    fetchStudents();
  } catch (error) {
    alert('Error adding student.');
  }
});

// Delete student
async function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to delete student.');
      return;
    }

    alert('Student deleted successfully.');
    fetchStudents();
  } catch (error) {
    alert('Error deleting student.');
  }
}

// Search/filter
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = students.filter((student) => {
    return (
      student.fullName.toLowerCase().includes(query) ||
      student.program.toLowerCase().includes(query) ||
      student.gender.toLowerCase().includes(query)
    );
  });

  displayStudents(filtered);
});

// Initial fetch
fetchStudents();
