
let students = [];
let selectedStudent = null;

// ADD STUDENT
document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let id = document.getElementById("id").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let form = document.getElementById("form").value;

    // VALIDATION
    if (students.some(s => s.id === id)) {
        alert("Student ID must be unique!");
        return;
    }

    let student = {
        id,
        name,
        age,
        gender,
        form,
        performance: []
    };

    students.push(student);
    displayStudents();
    this.reset();
});

// DISPLAY STUDENTS
function displayStudents() {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach((student, index) => {
        let avg = calculateAverage(student);

        let promoteBtn = '';
        let currentForm = parseInt(student.form, 10);
        if (!isNaN(currentForm) && currentForm < 4) {
            promoteBtn = `<button onclick="promoteStudent(${index})">Promote</button>`;
        }
        table.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.form}</td>
                <td>${avg}</td>
                <td>
                    <button onclick="addPerformance(${index})">Add Marks</button>
                    ${promoteBtn}
                    <button onclick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// DELETE
function deleteStudent(index) {
    students.splice(index, 1);
    displayStudents();
}

// ADD PERFORMANCE
function addPerformance(index) {
    selectedStudent = index;
    document.getElementById("performanceSection").classList.remove("hidden");
}

// SAVE PERFORMANCE
function savePerformance() {
    let mathematics = Number(document.getElementById("mathematics").value);
    let english = Number(document.getElementById("english").value);
    let science = Number(document.getElementById("science").value);
    let socialStudies = Number(document.getElementById("socialStudies").value);

    let record = {
        form: students[selectedStudent].form,
        subjects: { mathematics, english, science, socialStudies }
    };

    students[selectedStudent].performance.push(record);

    alert("Performance Saved!");
    document.getElementById("performanceSection").classList.add("hidden");
    displayStudents();
}

// CALCULATE AVERAGE
function calculateAverage(student) {
    if (student.performance.length === 0) return "N/A";

    let last = student.performance[student.performance.length - 1].subjects;
    let avg = (last.mathematics + last.english + last.science + last.socialStudies) / 4;

    return avg.toFixed(1);
}

function promoteStudent(index) {
    let student = students[index];
    let avgStr = calculateAverage(student);
    if (avgStr === "N/A") {
        alert('No marks available for promotion.');
        return;
    }
    let avg = parseFloat(avgStr);
    if (isNaN(avg) || avg < 50) {
        alert(`${student.name} cannot be promoted (average ${avgStr}).`);
        return;
    }
    let currentForm = parseInt(student.form, 10);
    if (!isNaN(currentForm) && currentForm < 4) {
        student.form = String(currentForm + 1);
        alert(`${student.name} promoted to Form ${student.form}.`);
        displayStudents();
    } else {
        alert('Student is already in highest form.');
    }
}

// SEARCH LOGIC
function searchStudent(query) {
    let resultDiv = document.getElementById('searchResult');
    resultDiv.innerHTML = '';
    if (!query) {
        resultDiv.textContent = 'Enter a name or ID to search';
        return;
    }
    query = query.toLowerCase();
    let found = students.find(s => s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query));
    if (found) {
        let avg = calculateAverage(found);
        resultDiv.innerHTML = `
            <div class="result-card">
                <strong>${found.name} (${found.id})</strong><br>
                Form: ${found.form}<br>
                Avg: ${avg}
            </div>
        `;
    } else {
        resultDiv.textContent = 'No student found.';
    }
}

function clearSearch() {
    let input = document.getElementById('searchInput');
    input.value = '';
    document.getElementById('searchResult').innerHTML = '';
    updateSearchButtons();
}

function handleSearch() {
    let value = document.getElementById('searchInput').value.trim();
    if (!value) {
        alert('Please type something before searching.');
        return;
    }
    searchStudent(value);
}

// button state management
function updateSearchButtons() {
    let input = document.getElementById('searchInput');
    let val = input ? input.value.trim() : '';
    let searchBtn = document.getElementById('searchBtn');
    let clearBtn = document.getElementById('clearBtn');
    if (searchBtn) searchBtn.disabled = val === '';
    if (clearBtn) clearBtn.disabled = val === '';
}

let searchInputEl = document.getElementById('searchInput');
if (searchInputEl) {
    searchInputEl.addEventListener('input', updateSearchButtons);
    updateSearchButtons();
}