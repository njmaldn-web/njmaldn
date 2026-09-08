// Database Initializer (مع بيانات وأسماء حقيقية ونظام تصفية حسب الصف)
function initDatabase() {
  let storedUsers = JSON.parse(localStorage.getItem('sys_users')) || [];

  if (!storedUsers.some(u => u.username === 'admin')) {
    const defaultUsers = [
      { username: 'admin', password: '123', role: 'admin', name: 'إدارة النظام الإلكتروني' }
    ];

    // 1. قائمة أسماء طلاب حقيقية وتوزيعهم على الصفوف
    const realStudentsData = [
      { name: "أحمد محمد إبراهيم", class: "الصف الأول ثانوي" },
      { name: "عمر خالد يوسف", class: "الصف الأول ثانوي" },
      { name: "فاطمة الزهراء علي", class: "الصف الأول ثانوي" },
      { name: "سارة عبد الرحمن حسن", class: "الصف الأول ثانوي" },
      { name: "محمد عثمان سليمان", class: "الصف الأول ثانوي" },
      
      { name: "ياسين طارق عبد الله", class: "الصف الثاني ثانوي" },
      { name: "ريان حمزة أحمد", class: "الصف الثاني ثانوي" },
      { name: "شهد مصطفى كمال", class: "الصف الثاني ثانوي" },
      { name: "عبد العزيز محمود طه", class: "الصف الثاني ثانوي" },
      { name: "مريم خالد الشيخ", class: "الصف الثاني ثانوي" },

      { name: "مصعب صلاح الدين", class: "الصف الثالث ثانوي" },
      { name: "آية ناصر الشريف", class: "الصف الثالث ثانوي" },
      { name: "يوسف مجدي الفاضل", class: "الصف الثالث ثانوي" },
      { name: "هدى عصام الدين", class: "الصف الثالث ثانوي" },
      { name: "خالد وليد فتحي", class: "الصف الثالث ثانوي" }
    ];

    const defaultStudents = [];

    realStudentsData.forEach((std, index) => {
      const i = index + 1;
      const stdId = `std_${i}`;

      defaultStudents.push({
        id: stdId,
        name: std.name,
        class: std.class
      });

      // حساب الطالب
      defaultUsers.push({
        username: `student${i}`,
        password: '123',
        role: 'student',
        name: std.name,
        studentId: stdId
      });

      // حساب ولي الأمر المرتبط
      defaultUsers.push({
        username: `parent${i}`,
        password: '123',
        role: 'parent',
        name: `ولي أمر (${std.name})`,
        studentId: stdId
      });
    });

    // 2. قائمة معلمين بأسماء وتخصصات حقيقية
    const realTeachers = [
      { name: "د. عبد الله المكي", subject: "الرياضيات" },
      { name: "أ. أسامة نور الدائم", subject: "الفيزياء" },
      { name: "د. إيناس عبد الجليل", subject: "الكيمياء" },
      { name: "أ. محمد عبد الفتاح", subject: "اللغة العربية" },
      { name: "أ. سارة مجذوب", subject: "اللغة الإنجليزية" },
      { name: "د. ياسر مصطفى", subject: "الأحياء" },
      { name: "أ. طارق عبد المجيد", subject: "الحاسوب" }
    ];

    realTeachers.forEach((tch, index) => {
      defaultUsers.push({
        username: `teacher${index + 1}`,
        password: '123',
        role: 'teacher',
        name: `${tch.name} - ${tch.subject}`,
        subject: tch.subject
      });
    });

    localStorage.setItem('sys_users', JSON.stringify(defaultUsers));
    localStorage.setItem('sys_students', JSON.stringify(defaultStudents));
  }

  if (!localStorage.getItem('sys_attendance')) localStorage.setItem('sys_attendance', JSON.stringify([]));
  if (!localStorage.getItem('sys_homework')) localStorage.setItem('sys_homework', JSON.stringify([]));
  if (!localStorage.getItem('sys_notes')) localStorage.setItem('sys_notes', JSON.stringify([]));
  if (!localStorage.getItem('sys_grades')) localStorage.setItem('sys_grades', JSON.stringify([]));
}

const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

let currentUser = null;

// Auth Operations
function login() {
  const uInput = document.getElementById('username').value.trim();
  const pInput = document.getElementById('password').value.trim();
  
  const users = getData('sys_users');
  const user = users.find(u => u.username === uInput && u.password === pInput);

  if (user) {
    currentUser = user;
    document.getElementById('body-tag').classList.remove('login-page');
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('main-container').classList.remove('hidden');
    
    document.getElementById('welcome-msg').innerText = `أهلاً بك، ${user.name}`;
    
    if (user.role === 'admin') {
      document.getElementById('user-role-badge').innerText = 'مدير النظام';
      showAdminDashboard();
    } else if (user.role === 'teacher') {
      document.getElementById('user-role-badge').innerText = 'عضو هيئة التدريس';
      showTeacherDashboard();
    } else {
      document.getElementById('user-role-badge').innerText = user.role === 'parent' ? 'بوابة ولي الأمر' : 'بوابة الطالب';
      showStudentParentDashboard(user.studentId);
    }
  } else {
    alert('بيانات الدخول غير صحيحة!');
  }
}

function logout() {
  currentUser = null;
  document.getElementById('body-tag').classList.add('login-page');
  document.getElementById('main-container').classList.add('hidden');
  document.getElementById('admin-view').classList.add('hidden');
  document.getElementById('teacher-view').classList.add('hidden');
  document.getElementById('user-view').classList.add('hidden');
  document.getElementById('login-view').classList.remove('hidden');
}

// Admin Operations
function switchAdminTab(tabName) {
  document.getElementById('admin-tab-students').classList.add('hidden');
  document.getElementById('admin-tab-teachers').classList.add('hidden');
  document.getElementById('admin-tab-parents').classList.add('hidden');

  document.getElementById('btn-tab-students').classList.remove('active-tab');
  document.getElementById('btn-tab-teachers').classList.remove('active-tab');
  document.getElementById('btn-tab-parents').classList.remove('active-tab');

  if (tabName === 'students') {
    document.getElementById('admin-tab-students').classList.remove('hidden');
    document.getElementById('btn-tab-students').classList.add('active-tab');
  } else if (tabName === 'teachers') {
    document.getElementById('admin-tab-teachers').classList.remove('hidden');
    document.getElementById('btn-tab-teachers').classList.add('active-tab');
  } else if (tabName === 'parents') {
    document.getElementById('admin-tab-parents').classList.remove('hidden');
    document.getElementById('btn-tab-parents').classList.add('active-tab');
  }
}

function showAdminDashboard() {
  document.getElementById('admin-view').classList.remove('hidden');
  updateAdminStudentDropdown();
  renderAdminStudentsTable();
  renderAdminTeachersTable();
  renderAdminParentsTable();
  switchAdminTab('students');
}

function updateAdminStudentDropdown() {
  const students = getData('sys_students');
  const select = document.getElementById('add-prt-student-select');
  select.innerHTML = students.length ? '' : '<option value="">لا يوجد طلاب مسجلين</option>';
  students.forEach(s => {
    select.innerHTML += `<option value="${s.id}">${s.name} (${s.class})</option>`;
  });
}

function renderAdminStudentsTable() {
  const students = getData('sys_students');
  const table = document.getElementById('admin-students-table');
  table.innerHTML = students.length ? '' : '<tr><td colspan="4">لا يوجد طلاب مسجلين حالياً بالنظام</td></tr>';
  students.forEach(s => {
    table.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.class}</td>
        <td>
          <button onclick="editStudent('${s.id}')" class="btn-warning btn-action">تعديل</button>
          <button onclick="deleteStudent('${s.id}')" class="btn-danger btn-action">حذف</button>
        </td>
      </tr>
    `;
  });
}

function createStudent() {
  const name = document.getElementById('add-std-name').value.trim();
  const stdClass = document.getElementById('add-std-class').value;
  const username = document.getElementById('add-std-user').value.trim();
  const password = document.getElementById('add-std-pass').value.trim();

  if (!name || !stdClass || !username || !password) return alert('يرجى تعبئة كافة حقول الطالب');

  const users = getData('sys_users');
  if (users.some(u => u.username === username)) return alert('اسم المستخدم مستخدم مسبقاً!');

  const studentId = 'std_' + Date.now();
  const students = getData('sys_students');
  
  students.push({ id: studentId, name, class: stdClass });
  users.push({ username, password, role: 'student', name, studentId });

  setData('sys_students', students);
  setData('sys_users', users);

  alert('تم تسجيل الطالب بنجاح!');
  document.getElementById('add-std-name').value = '';
  document.getElementById('add-std-user').value = '';
  document.getElementById('add-std-pass').value = '';
  
  updateAdminStudentDropdown();
  renderAdminStudentsTable();
}

function editStudent(studentId) {
  const students = getData('sys_students');
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  const newName = prompt('تعديل اسم الطالب:', student.name);
  if (!newName) return;

  student.name = newName.trim();
  setData('sys_students', students);
  renderAdminStudentsTable();
}

function deleteStudent(studentId) {
  if (!confirm('هل تأكدت من حذف هذا الطالب؟')) return;
  let students = getData('sys_students').filter(s => s.id !== studentId);
  setData('sys_students', students);
  renderAdminStudentsTable();
}

function renderAdminTeachersTable() {
  const users = getData('sys_users').filter(u => u.role === 'teacher');
  const table = document.getElementById('admin-teachers-table');
  table.innerHTML = users.length ? '' : '<tr><td colspan="3">لا يوجد معلمين مسجلين</td></tr>';
  users.forEach(t => {
    table.innerHTML += `
      <tr>
        <td>${t.name}</td>
        <td>${t.username}</td>
        <td><button onclick="deleteUser('${t.username}')" class="btn-danger btn-action">حذف</button></td>
      </tr>
    `;
  });
}

function createTeacher() {
  const name = document.getElementById('add-tch-name').value.trim();
  const username = document.getElementById('add-tch-user').value.trim();
  const password = document.getElementById('add-tch-pass').value.trim();

  if (!name || !username || !password) return alert('يرجى تعبئة بيانات المعلم بالكامل');

  const users = getData('sys_users');
  users.push({ username, password, role: 'teacher', name });
  setData('sys_users', users);

  alert('تم إضافة المعلم بنجاح!');
  renderAdminTeachersTable();
}

function renderAdminParentsTable() {
  const users = getData('sys_users').filter(u => u.role === 'parent');
  const students = getData('sys_students');
  const table = document.getElementById('admin-parents-table');
  table.innerHTML = users.length ? '' : '<tr><td colspan="4">لا يوجد أولياء أمور مسجلين</td></tr>';

  users.forEach(p => {
    const student = students.find(s => s.id === p.studentId);
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.username}</td>
        <td>${student ? student.name + ' (' + student.class + ')' : 'غير مرتبط'}</td>
        <td><button onclick="deleteUser('${p.username}')" class="btn-danger btn-action">حذف</button></td>
      </tr>
    `;
  });
}

function createParent() {
  const name = document.getElementById('add-prt-name').value.trim();
  const studentId = document.getElementById('add-prt-student-select').value;
  const username = document.getElementById('add-prt-user').value.trim();
  const password = document.getElementById('add-prt-pass').value.trim();

  if (!name || !studentId || !username || !password) return alert('يرجى تعبئة الحقول بالكامل');

  const users = getData('sys_users');
  users.push({ username, password, role: 'parent', name, studentId });
  setData('sys_users', users);

  alert('تم ربط ولي الأمر بنجاح!');
  renderAdminParentsTable();
}

function deleteUser(username) {
  if (!confirm('حذف هذا الحساب؟')) return;
  let users = getData('sys_users').filter(u => u.username !== username);
  setData('sys_users', users);
  renderAdminTeachersTable();
  renderAdminParentsTable();
}

// Teacher Operations
function switchTeacherTab(tabName) {
  document.getElementById('tch-tab-grades').classList.add('hidden');
  document.getElementById('tch-tab-attendance').classList.add('hidden');
  document.getElementById('tch-tab-homework').classList.add('hidden');
  document.getElementById('tch-tab-notes').classList.add('hidden');

  document.getElementById('btn-tch-grades').classList.remove('active-tab');
  document.getElementById('btn-tch-attendance').classList.remove('active-tab');
  document.getElementById('btn-tch-homework').classList.remove('active-tab');
  document.getElementById('btn-tch-notes').classList.remove('active-tab');

  if (tabName === 'grades') {
    document.getElementById('tch-tab-grades').classList.remove('hidden');
    document.getElementById('btn-tch-grades').classList.add('active-tab');
  } else if (tabName === 'attendance') {
    document.getElementById('tch-tab-attendance').classList.remove('hidden');
    document.getElementById('btn-tch-attendance').classList.add('active-tab');
  } else if (tabName === 'homework') {
    document.getElementById('tch-tab-homework').classList.remove('hidden');
    document.getElementById('btn-tch-homework').classList.add('active-tab');
  } else if (tabName === 'notes') {
    document.getElementById('tch-tab-notes').classList.remove('hidden');
    document.getElementById('btn-tch-notes').classList.add('active-tab');
  }
}

function filterStudentsByClass(targetSelectId, selectedClass) {
  const students = getData('sys_students');
  const select = document.getElementById(targetSelectId);
  
  const filtered = selectedClass === 'ALL' 
    ? students 
    : students.filter(s => s.class === selectedClass);

  select.innerHTML = filtered.length ? '' : '<option value="">لا يوجد طلاب لهذا الصف</option>';
  filtered.forEach(s => {
    select.innerHTML += `<option value="${s.id}">${s.name} (${s.class})</option>`;
  });
}

function showTeacherDashboard() {
  document.getElementById('teacher-view').classList.remove('hidden');
  
  // تهيئة خيارات الطلاب الافتراضية
  filterStudentsByClass('grade-student', document.getElementById('grade-class-filter').value);
  filterStudentsByClass('attendance-student', document.getElementById('attendance-class-filter').value);
  filterStudentsByClass('note-student', document.getElementById('note-class-filter').value);

  renderTeacherGradesTable();
  renderTeacherHomeworks();
  switchTeacherTab('grades');
}

function saveGrade() {
  const studentId = document.getElementById('grade-student').value;
  const subject = document.getElementById('grade-subject').value.trim();
  const work = parseFloat(document.getElementById('grade-work').value);
  const exam = parseFloat(document.getElementById('grade-exam').value);

  if (!studentId || !subject || isNaN(work) || isNaN(exam)) return alert('يرجى ملء جميع الحقول بشكل صحيح');
  if (work < 0 || work > 40 || exam < 0 || exam > 60) return alert('الدرجات خارج النطاق المسموح (الأعمال: 0-40، الامتحان: 0-60)');

  const grades = getData('sys_grades');
  grades.push({ id: 'g_' + Date.now(), studentId, subject, work, exam, total: work + exam });
  setData('sys_grades', grades);

  alert('تم حفظ الدرجة بنجاح!');
  document.getElementById('grade-subject').value = '';
  document.getElementById('grade-work').value = '';
  document.getElementById('grade-exam').value = '';

  renderTeacherGradesTable();
}

function renderTeacherGradesTable() {
  const grades = getData('sys_grades');
  const students = getData('sys_students');
  const table = document.getElementById('teacher-grades-table');

  table.innerHTML = grades.length ? '' : '<tr><td colspan="6">لا توجد درجات مرصودة حتى الآن</td></tr>';

  grades.forEach(g => {
    const student = students.find(s => s.id === g.studentId);
    table.innerHTML += `
      <tr>
        <td>${student ? student.name + ' (' + student.class + ')' : 'غير معروف'}</td>
        <td>${g.subject}</td>
        <td>${g.work}</td>
        <td>${g.exam}</td>
        <td><strong>${g.total}</strong></td>
        <td><button onclick="deleteGrade('${g.id}')" class="btn-danger btn-action">حذف</button></td>
      </tr>
    `;
  });
}

function deleteGrade(gradeId) {
  if (!confirm('هل تريد حذف هذه الدرجة؟')) return;
  let grades = getData('sys_grades').filter(g => g.id !== gradeId);
  setData('sys_grades', grades);
  renderTeacherGradesTable();
}

function saveAttendance() {
  const studentId = document.getElementById('attendance-student').value;
  const date = document.getElementById('attendance-date').value;
  const status = document.getElementById('attendance-status').value;

  if (!studentId || !date) return alert('يرجى اختيار طالب وتاريخ الحضور');

  const attendance = getData('sys_attendance');
  attendance.push({ studentId, date, status });
  setData('sys_attendance', attendance);
  alert('تم تسجيل الحضور بنجاح!');
}

function saveHomework() {
  const targetClass = document.getElementById('hw-class').value;
  const subject = document.getElementById('hw-subject').value.trim();
  const desc = document.getElementById('hw-desc').value.trim();
  const dueDate = document.getElementById('hw-duedate').value;

  if (!subject || !desc || !dueDate) return alert('يرجى تعبئة كافة تفاصيل الواجب');

  const homework = getData('sys_homework');
  homework.push({ 
    id: 'hw_' + Date.now(), 
    teacherName: currentUser.name, 
    targetClass, 
    subject, 
    desc, 
    dueDate,
    createdAt: new Date().toLocaleDateString('ar-EG')
  });
  setData('sys_homework', homework);

  alert(`تم نشر الواجب الموجه لـ (${targetClass}) بنجاح!`);
  document.getElementById('hw-subject').value = '';
  document.getElementById('hw-desc').value = '';
  document.getElementById('hw-duedate').value = '';

  renderTeacherHomeworks();
}

function renderTeacherHomeworks() {
  const homeworks = getData('sys_homework');
  const container = document.getElementById('teacher-my-homeworks');

  if (!homeworks.length) {
    container.innerHTML = '<p style="color:#64748b;">لا توجد واجبات منشورة حتى الآن.</p>';
    return;
  }

  container.innerHTML = '';
  homeworks.slice().reverse().forEach(hw => {
    container.innerHTML += `
      <div style="border:1px solid #e2e8f0; padding:15px; border-radius:8px; margin-bottom:10px; background:#f8fafc;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="color:var(--primary);">${hw.subject} - <span style="color:var(--gold);">${hw.targetClass}</span></h4>
          <span style="font-size:12px; color:#64748b;">تسليم قبل: ${hw.dueDate}</span>
        </div>
        <p style="margin:10px 0; color:#334155;">${hw.desc}</p>
        <small style="color:#94a3b8;">بواسطة: ${hw.teacherName} | بتاريخ: ${hw.createdAt}</small>
        <div style="margin-top:8px;">
          <button onclick="deleteHomework('${hw.id}')" class="btn-danger btn-action">حذف الواجب</button>
        </div>
      </div>
    `;
  });
}

function deleteHomework(hwId) {
  if (!confirm('هل تريد حذف هذا الواجب؟')) return;
  let homeworks = getData('sys_homework').filter(h => h.id !== hwId);
  setData('sys_homework', homeworks);
  renderTeacherHomeworks();
}

function saveNote() {
  const studentId = document.getElementById('note-student').value;
  const text = document.getElementById('note-text').value.trim();

  if (!studentId || !text) return alert('يرجى اختيار طالب وإدخال الملاحظة');

  const notes = getData('sys_notes');
  notes.push({ studentId, teacherName: currentUser.name, text, date: new Date().toLocaleDateString('ar-EG') });
  setData('sys_notes', notes);

  alert('تم إرسال الملاحظة لولي الأمر والطالب بنجاح!');
  document.getElementById('note-text').value = '';
}

// Student & Parent Operations
function switchUserTab(tabName) {
  document.getElementById('usr-tab-grades').classList.add('hidden');
  document.getElementById('usr-tab-attendance').classList.add('hidden');
  document.getElementById('usr-tab-homework').classList.add('hidden');
  document.getElementById('usr-tab-notes').classList.add('hidden');

  document.getElementById('btn-usr-grades').classList.remove('active-tab');
  document.getElementById('btn-usr-attendance').classList.remove('active-tab');
  document.getElementById('btn-usr-homework').classList.remove('active-tab');
  document.getElementById('btn-usr-notes').classList.remove('active-tab');

  if (tabName === 'grades') {
    document.getElementById('usr-tab-grades').classList.remove('hidden');
    document.getElementById('btn-usr-grades').classList.add('active-tab');
  } else if (tabName === 'attendance') {
    document.getElementById('usr-tab-attendance').classList.remove('hidden');
    document.getElementById('btn-usr-attendance').classList.add('active-tab');
  } else if (tabName === 'homework') {
    document.getElementById('usr-tab-homework').classList.remove('hidden');
    document.getElementById('btn-usr-homework').classList.add('active-tab');
  } else if (tabName === 'notes') {
    document.getElementById('usr-tab-notes').classList.remove('hidden');
    document.getElementById('btn-usr-notes').classList.add('active-tab');
  }
}

function getGradeRating(total) {
  if (total >= 90) return '<span style="color:green; font-weight:bold;">ممتاز</span>';
  if (total >= 80) return '<span style="color:blue; font-weight:bold;">جيد جداً</span>';
  if (total >= 70) return '<span style="color:darkcyan; font-weight:bold;">جيد</span>';
  if (total >= 60) return '<span style="color:orange; font-weight:bold;">مقبول</span>';
  if (total >= 50) return '<span style="color:brown; font-weight:bold;">ضعيف</span>';
  return '<span style="color:red; font-weight:bold;">راسب</span>';
}

function showStudentParentDashboard(studentId) {
  document.getElementById('user-view').classList.remove('hidden');
  
  const students = getData('sys_students');
  const student = students.find(s => s.id === studentId);
  
  if (!student) return;

  document.getElementById('student-info-header').innerHTML = `
    <h3 style="color: var(--primary);">الطالب: <span style="color:var(--gold);">${student.name}</span></h3>
    <p style="color:#64748b; font-weight:600;">الصف الدراسي: ${student.class}</p>
  `;

  document.getElementById('report-student-detail').innerText = `اسم الطالب: ${student.name} | الصف: ${student.class}`;

  // 1. النتائج والدرجات
  const grades = getData('sys_grades').filter(g => g.studentId === studentId);
  const gradesTable = document.getElementById('student-grades-table');
  const summaryBox = document.getElementById('report-summary');

  if (!grades.length) {
    gradesTable.innerHTML = '<tr><td colspan="5">لم يتم رصد نتائج هذا الفصل حتى الآن</td></tr>';
    summaryBox.innerHTML = '';
  } else {
    gradesTable.innerHTML = '';
    let totalObtained = 0;
    let maxTotal = grades.length * 100;

    grades.forEach(g => {
      totalObtained += g.total;
      gradesTable.innerHTML += `
        <tr>
          <td>${g.subject}</td>
          <td>${g.work}</td>
          <td>${g.exam}</td>
          <td><strong>${g.total}</strong></td>
          <td>${getGradeRating(g.total)}</td>
        </tr>
      `;
    });

    const percentage = ((totalObtained / maxTotal) * 100).toFixed(1);
    summaryBox.innerHTML = `
      <p>المجموع الكلي: <strong>${totalObtained} / ${maxTotal}</strong></p>
      <p>النسبة المئوية العامة: <span style="color:var(--accent); font-size: 18px;">${percentage}%</span></p>
    `;
  }

  // 2. الحضور والغياب
  const attendance = getData('sys_attendance').filter(a => a.studentId === studentId);
  const attTable = document.getElementById('attendance-list');
  attTable.innerHTML = attendance.length ? '' : '<tr><td colspan="2">لا توجد سجلات حضور</td></tr>';
  attendance.forEach(a => {
    attTable.innerHTML += `<tr><td>${a.date}</td><td><span class="badge ${a.status === 'حاضر' ? 'badge-present' : 'badge-absent'}">${a.status}</span></td></tr>`;
  });

  // 3. الواجبات المنزلية (تظهر فقط الواجبات الموجهة لصف الطالب)
  const allHomeworks = getData('sys_homework');
  const studentHomeworks = allHomeworks.filter(hw => hw.targetClass === student.class);
  const hwContainer = document.getElementById('student-homework-container');

  if (!studentHomeworks.length) {
    hwContainer.innerHTML = `<p style="color:#64748b;">لا توجد واجبات منزلية منشورة لـ (${student.class}) حالياً.</p>`;
  } else {
    hwContainer.innerHTML = '';
    studentHomeworks.slice().reverse().forEach(hw => {
      hwContainer.innerHTML += `
        <div style="border:1px solid #e2e8f0; padding:15px; border-radius:8px; margin-bottom:12px; background:#fff;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="color:var(--primary);">${hw.subject}</h4>
            <span style="font-size:12px; color:var(--danger); font-weight:bold;">آخر موعد: ${hw.dueDate}</span>
          </div>
          <p style="margin:10px 0; color:#334155;">${hw.desc}</p>
          <small style="color:#64748b;">المعلم: ${hw.teacherName} | تاريخ النشر: ${hw.createdAt}</small>
        </div>
      `;
    });
  }

  // 4. الملاحظات والتقارير
  const notes = getData('sys_notes').filter(n => n.studentId === studentId);
  const notesContainer = document.getElementById('notes-list');

  if (!notes.length) {
    notesContainer.innerHTML = '<p style="color:#64748b;">لا توجد ملاحظات مسجلة.</p>';
  } else {
    notesContainer.innerHTML = '';
    notes.slice().reverse().forEach(n => {
      notesContainer.innerHTML += `
        <div style="border-right:4px solid var(--accent); padding:12px; background:#f8fafc; margin-bottom:10px; border-radius:4px;">
          <p style="margin-bottom:5px; color:#1e293b;">${n.text}</p>
          <small style="color:#64748b;">المعلم/المصدر: ${n.teacherName || 'إدارة النظام'} | التاريخ: ${n.date}</small>
        </div>
      `;
    });
  }

  switchUserTab('grades');
}

// Start Database Application
initDatabase();

