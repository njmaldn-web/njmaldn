// --- 1. Setup Data & Clean Missing Teachers Homework ---
function initDatabase() {
  const defaultUsers = [
    { username: 'admin', password: '123', role: 'admin', name: 'المدير العام' },
    { username: 'teacher1', password: '123', role: 'teacher', name: 'أ. أحمد (معلم)' },
    { username: 'parent1', password: '123', role: 'parent', name: 'سعود (ولي أمر)', studentId: 'std1' },
    { username: 'student1', password: '123', role: 'student', name: 'علي سعود (طالب)', studentId: 'std1' }
  ];

  let storedUsers = JSON.parse(localStorage.getItem('sys_users')) || [];
  if (!storedUsers.some(u => u.username === 'admin')) {
    storedUsers = defaultUsers;
    localStorage.setItem('sys_users', JSON.stringify(storedUsers));
  }

  if (!localStorage.getItem('sys_students')) {
    const students = [{ id: 'std1', name: 'علي سعود', class: 'الصف الخامس' }];
    localStorage.setItem('sys_students', JSON.stringify(students));
  }

  if (!localStorage.getItem('sys_attendance')) localStorage.setItem('sys_attendance', JSON.stringify([]));
  if (!localStorage.getItem('sys_homework')) localStorage.setItem('sys_homework', JSON.stringify([]));
  if (!localStorage.getItem('sys_homework_submissions')) localStorage.setItem('sys_homework_submissions', JSON.stringify([]));
  if (!localStorage.getItem('sys_notes')) localStorage.setItem('sys_notes', JSON.stringify([]));
  if (!localStorage.getItem('sys_notifications')) localStorage.setItem('sys_notifications', JSON.stringify([]));

  cleanOrphanedHomeworks();
}

function cleanOrphanedHomeworks() {
  const users = getData('sys_users');
  const teacherUsernames = users.filter(u => u.role === 'teacher').map(u => u.username);
  
  let homeworks = getData('sys_homework');
  const validHomeworks = homeworks.filter(h => teacherUsernames.includes(h.teacherUsername));

  if (homeworks.length !== validHomeworks.length) {
    setData('sys_homework', validHomeworks);
    const validHwIds = validHomeworks.map(h => h.id);
    
    let submissions = getData('sys_homework_submissions').filter(s => validHwIds.includes(s.hwId));
    setData('sys_homework_submissions', submissions);
  }
}

const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

let currentUser = null;

// --- 2. Auth Logic ---
function login() {
  cleanOrphanedHomeworks();
  const uInput = document.getElementById('username').value.trim();
  const pInput = document.getElementById('password').value.trim();
  
  const users = getData('sys_users');
  const user = users.find(u => u.username === uInput && u.password === pInput);

  if (user) {
    currentUser = user;
    
    document.getElementById('body-tag').classList.remove('login-page');
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('main-container').classList.remove('hidden');
    
    document.getElementById('welcome-msg').innerText = `مرحباً، ${user.name}`;
    
    if (user.role === 'admin') {
      document.getElementById('user-role-badge').innerText = 'حساب مدير النظام';
      showAdminDashboard();
    } else if (user.role === 'teacher') {
      document.getElementById('user-role-badge').innerText = 'حساب معلم';
      showTeacherDashboard();
    } else {
      document.getElementById('user-role-badge').innerText = user.role === 'parent' ? 'حساب ولي أمر' : 'حساب طالب';
      showStudentParentDashboard(user.studentId);
    }
  } else {
    alert('اسم المستخدم أو كلمة المرور غير صحيحة!');
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
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

// --- 3. Admin Views ---
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
  select.innerHTML = students.length ? '' : '<option value="">لا يوجد طلاب حالياً</option>';
  students.forEach(s => {
    select.innerHTML += `<option value="${s.id}">${s.name} (${s.class})</option>`;
  });
}

function renderAdminStudentsTable() {
  const students = getData('sys_students');
  const table = document.getElementById('admin-students-table');
  table.innerHTML = students.length ? '' : '<tr><td colspan="4">لا يوجد طلاب مسجلين</td></tr>';
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
  const stdClass = document.getElementById('add-std-class').value.trim();
  const username = document.getElementById('add-std-user').value.trim();
  const password = document.getElementById('add-std-pass').value.trim();

  if (!name || !stdClass || !username || !password) return alert('يرجى تعبئة كافة الحقول الخاصة بالطالب');

  const users = getData('sys_users');
  if (users.some(u => u.username === username)) return alert('اسم المستخدم موجود بالفعل!');

  const studentId = 'std_' + Date.now();
  const students = getData('sys_students');
  
  students.push({ id: studentId, name, class: stdClass });
  users.push({ username, password, role: 'student', name: name + ' (طالب)', studentId });

  setData('sys_students', students);
  setData('sys_users', users);

  alert('تم إنشاء حساب الطالب بنجاح!');
  document.getElementById('add-std-name').value = '';
  document.getElementById('add-std-class').value = '';
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
  if (newName === null) return;
  
  const newClass = prompt('تعديل الصف الدراسي:', student.class);
  if (newClass === null) return;

  if (newName.trim() === '' || newClass.trim() === '') return alert('لا يمكن ترك الاسم أو الصف فارغاً');

  student.name = newName.trim();
  student.class = newClass.trim();

  const users = getData('sys_users');
  const userAccount = users.find(u => u.studentId === studentId && u.role === 'student');
  if (userAccount) {
    userAccount.name = student.name + ' (طالب)';
    setData('sys_users', users);
  }

  setData('sys_students', students);
  alert('تم تعديل بيانات الطالب بنجاح');
  renderAdminStudentsTable();
  updateAdminStudentDropdown();
}

function deleteStudent(studentId) {
  if (!confirm('هل أنت تأكد من حذف هذا الطالب نهائياً؟')) return;

  let students = getData('sys_students').filter(s => s.id !== studentId);
  setData('sys_students', students);

  let users = getData('sys_users').filter(u => u.studentId !== studentId);
  setData('sys_users', users);

  alert('تم حذف الطالب بنجاح');
  renderAdminStudentsTable();
  updateAdminStudentDropdown();
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
        <td>
          <button onclick="editTeacher('${t.username}')" class="btn-warning btn-action">تعديل</button>
          <button onclick="deleteUser('${t.username}')" class="btn-danger btn-action">حذف المعلم</button>
        </td>
      </tr>
    `;
  });
}

function createTeacher() {
  const name = document.getElementById('add-tch-name').value.trim();
  const username = document.getElementById('add-tch-user').value.trim();
  const password = document.getElementById('add-tch-pass').value.trim();

  if (!name || !username || !password) return alert('يرجى تعبئة كافة الحقول الخاصّة بالمعلم');

  const users = getData('sys_users');
  if (users.some(u => u.username === username)) return alert('اسم المستخدم موجود بالفعل!');

  users.push({ username, password, role: 'teacher', name: name + ' (معلم)' });
  setData('sys_users', users);

  alert('تم إنشاء حساب المعلم بنجاح!');
  document.getElementById('add-tch-name').value = '';
  document.getElementById('add-tch-user').value = '';
  document.getElementById('add-tch-pass').value = '';

  renderAdminTeachersTable();
}

function editTeacher(username) {
  const users = getData('sys_users');
  const teacher = users.find(u => u.username === username && u.role === 'teacher');
  if (!teacher) return;

  const newName = prompt('تعديل اسم المعلم:', teacher.name.replace(' (معلم)', ''));
  if (newName === null || newName.trim() === '') return;

  const newPass = prompt('تعديل كلمة المرور (اتركه فارغاً للإبقاء على الحالية):');
  
  teacher.name = newName.trim() + ' (معلم)';
  if (newPass && newPass.trim() !== '') teacher.password = newPass.trim();

  setData('sys_users', users);
  alert('تم تعديل بيانات المعلم بنجاح');
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
        <td>${student ? student.name : 'غير مرتبط'}</td>
        <td>
          <button onclick="editParent('${p.username}')" class="btn-warning btn-action">تعديل</button>
          <button onclick="deleteUser('${p.username}')" class="btn-danger btn-action">حذف</button>
        </td>
      </tr>
    `;
  });
}

function createParent() {
  const name = document.getElementById('add-prt-name').value.trim();
  const studentId = document.getElementById('add-prt-student-select').value;
  const username = document.getElementById('add-prt-user').value.trim();
  const password = document.getElementById('add-prt-pass').value.trim();

  if (!name || !studentId || !username || !password) return alert('يرجى تعبئة كافة الحقول واختيار الطالب المرتبط');

  const users = getData('sys_users');
  if (users.some(u => u.username === username)) return alert('اسم المستخدم موجود بالفعل!');

  users.push({ username, password, role: 'parent', name: name + ' (ولي أمر)', studentId });
  setData('sys_users', users);

  alert('تم إنشاء حساب ولي الأمر بنجاح!');
  document.getElementById('add-prt-name').value = '';
  document.getElementById('add-prt-user').value = '';
  document.getElementById('add-prt-pass').value = '';

  renderAdminParentsTable();
}

function editParent(username) {
  const users = getData('sys_users');
  const parent = users.find(u => u.username === username && u.role === 'parent');
  if (!parent) return;

  const newName = prompt('تعديل اسم ولي الأمر:', parent.name.replace(' (ولي أمر)', ''));
  if (newName === null || newName.trim() === '') return;

  const newPass = prompt('تعديل كلمة المرور (اتركه فارغاً للإبقاء على الحالية):');

  parent.name = newName.trim() + ' (ولي أمر)';
  if (newPass && newPass.trim() !== '') parent.password = newPass.trim();

  setData('sys_users', users);
  alert('تم تعديل بيانات ولي الأمر بنجاح');
  renderAdminParentsTable();
}

function deleteUser(username) {
  if (!confirm('هل أنت تأكد من حذف هذا الحساب نهائياً؟')) return;

  let users = getData('sys_users').filter(u => u.username !== username);
  setData('sys_users', users);

  cleanOrphanedHomeworks();

  alert('تم حذف الحساب وتنظيف البيانات المرتبطة بنجاح');
  renderAdminTeachersTable();
  renderAdminParentsTable();
}

// --- 4. Teacher Actions ---
function switchTeacherTab(tabName) {
  document.getElementById('tch-tab-attendance').classList.add('hidden');
  document.getElementById('tch-tab-homework').classList.add('hidden');
  document.getElementById('tch-tab-notes').classList.add('hidden');

  document.getElementById('btn-tch-attendance').classList.remove('active-tab');
  document.getElementById('btn-tch-homework').classList.remove('active-tab');
  document.getElementById('btn-tch-notes').classList.remove('active-tab');

  if (tabName === 'attendance') {
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

function showTeacherDashboard() {
  document.getElementById('teacher-view').classList.remove('hidden');
  
  const students = getData('sys_students');
  const studentSelects = [document.getElementById('attendance-student'), document.getElementById('note-student')];
  
  studentSelects.forEach(select => {
    select.innerHTML = students.length ? '' : '<option value="">لا يوجد طلاب</option>';
    students.forEach(s => {
      select.innerHTML += `<option value="${s.id}">${s.name} (${s.class})</option>`;
    });
  });

  document.getElementById('attendance-date').valueAsDate = new Date();
  renderTeacherMyHomeworks();
  renderTeacherSubmissions();
  switchTeacherTab('attendance');
}

function saveAttendance() {
  const studentId = document.getElementById('attendance-student').value;
  const date = document.getElementById('attendance-date').value;
  const status = document.getElementById('attendance-status').value;

  if (!studentId || !date) return alert('يرجى اختيار طالب وتحديد التاريخ');

  const attendance = getData('sys_attendance');
  attendance.push({ studentId, date, status });
  setData('sys_attendance', attendance);
  alert('تم حفظ حالة الحضور بنجاح!');
}

function saveHomework() {
  const subject = document.getElementById('hw-subject').value.trim();
  const desc = document.getElementById('hw-desc').value.trim();
  const dueDate = document.getElementById('hw-duedate').value;

  if (!subject || !desc || !dueDate) return alert('يرجى إكمال كافة حقول الواجب');

  const homework = getData('sys_homework');
  homework.push({ 
    id: 'hw_' + Date.now(), 
    teacherUsername: currentUser.username,
    subject, 
    desc, 
    dueDate 
  });
  
  setData('sys_homework', homework);

  alert('تم إرسال الواجب المنزلي بنجاح!');
  document.getElementById('hw-subject').value = '';
  document.getElementById('hw-desc').value = '';
  document.getElementById('hw-duedate').value = '';
  
  renderTeacherMyHomeworks();
  renderTeacherSubmissions();
}

function renderTeacherMyHomeworks() {
  const allHomeworks = getData('sys_homework');
  const myHomeworks = allHomeworks.filter(h => h.teacherUsername === currentUser.username);
  const container = document.getElementById('teacher-my-homeworks');

  if (!myHomeworks.length) {
    container.innerHTML = '<p style="color:#777;">لم تقم بإضافة أي واجبات حتى الآن.</p>';
    return;
  }

  container.innerHTML = '';
  myHomeworks.forEach(h => {
    container.innerHTML += `
      <div class="hw-item">
        <h4>المادة: ${h.subject}</h4>
        <p><strong>الوصف:</strong> ${h.desc}</p>
        <small style="color:var(--danger)">تاريخ التسليم: ${h.dueDate}</small>
        <div style="margin-top: 10px; text-align: left;">
          <button onclick="editHomework('${h.id}')" class="btn-warning btn-action">تعديل الواجب</button>
          <button onclick="deleteHomework('${h.id}')" class="btn-danger btn-action">حذف الواجب</button>
        </div>
      </div>
    `;
  });
}

function editHomework(hwId) {
  const homeworks = getData('sys_homework');
  const hw = homeworks.find(h => h.id === hwId);
  if (!hw) return;

  const newSubject = prompt('تعديل مادة الواجب:', hw.subject);
  if (newSubject === null) return;

  const newDesc = prompt('تعديل وصف الواجب:', hw.desc);
  if (newDesc === null) return;

  const newDueDate = prompt('تعديل تاريخ التسليم (YYYY-MM-DD):', hw.dueDate);
  if (newDueDate === null) return;

  if (!newSubject.trim() || !newDesc.trim() || !newDueDate.trim()) return alert('لا يمكن ترك الحقول فارغة');

  hw.subject = newSubject.trim();
  hw.desc = newDesc.trim();
  hw.dueDate = newDueDate.trim();

  setData('sys_homework', homeworks);
  alert('تم تعديل الواجب بنجاح!');
  renderTeacherMyHomeworks();
}

function deleteHomework(hwId) {
  if (!confirm('هل أنت تأكد من حذف هذا الواجب؟ سيؤدي ذلك لحذف إجابات الطلاب الخاصة به أيضاً.')) return;

  let homeworks = getData('sys_homework').filter(h => h.id !== hwId);
  setData('sys_homework', homeworks);

  let submissions = getData('sys_homework_submissions').filter(s => s.hwId !== hwId);
  setData('sys_homework_submissions', submissions);

  alert('تم حذف الواجب وإجاباته بنجاح');
  renderTeacherMyHomeworks();
  renderTeacherSubmissions();
}

function renderTeacherSubmissions() {
  const myHomeworks = getData('sys_homework').filter(h => h.teacherUsername === currentUser.username);
  const myHwIds = myHomeworks.map(h => h.id);
  
  const submissions = getData('sys_homework_submissions').filter(s => myHwIds.includes(s.hwId));
  const students = getData('sys_students');
  const container = document.getElementById('teacher-homework-submissions');

  if (!submissions.length) {
    container.innerHTML = '<p style="color:#777;">لا توجد إجابات مرفوعة لوظائفك بعد.</p>';
    return;
  }

  container.innerHTML = '';
  submissions.forEach(sub => {
    const student = students.find(s => s.id === sub.studentId);
    const hw = myHomeworks.find(h => h.id === sub.hwId);

    container.innerHTML += `
      <div class="submission-box">
        <strong>الطالب:</strong> ${student ? student.name : 'غير معروف'}<br>
        <strong>المادة / الواجب:</strong> ${hw ? hw.subject + ' - ' + hw.desc : 'واجب غير متوفر'}<br>
        <strong>تاريخ التسليم:</strong> ${sub.date}<br>
        <strong>نص الإجابة / الحل:</strong> <p style="background:#f0f0f0; padding:5px; border-radius:4px; margin-top:5px;">${sub.answerText}</p>
      </div>
    `;
  });
}

function saveNote() {
  const studentId = document.getElementById('note-student').value;
  const text = document.getElementById('note-text').value.trim();

  if (!studentId || !text) return alert('يرجى اختيار طالب وكتابة الملاحظة');

  const notes = getData('sys_notes');
  notes.push({ studentId, text, date: new Date().toLocaleDateString('ar-EG') });
  setData('sys_notes', notes);

  alert('تمت إضافة الملاحظة بنجاح!');
  document.getElementById('note-text').value = '';
}

// --- 5. Student / Parent Views & Tab Navigation ---
function switchUserTab(tabName) {
  document.getElementById('usr-tab-attendance').classList.add('hidden');
  document.getElementById('usr-tab-homework').classList.add('hidden');
  document.getElementById('usr-tab-notes').classList.add('hidden');

  document.getElementById('btn-usr-attendance').classList.remove('active-tab');
  document.getElementById('btn-usr-homework').classList.remove('active-tab');
  document.getElementById('btn-usr-notes').classList.remove('active-tab');

  if (tabName === 'attendance') {
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

function showStudentParentDashboard(studentId) {
  document.getElementById('user-view').classList.remove('hidden');
  
  const students = getData('sys_students');
  const student = students.find(s => s.id === studentId);
  
  if(!student) {
    document.getElementById('student-info-header').innerHTML = `<p style="color:red;">لم يتم العثور على بيانات طالب مرتبطة بحسابك!</p>`;
    return;
  }

  document.getElementById('student-info-header').innerHTML = `
    <h3>البيانات الأكاديمية للطالب: <span style="color:var(--accent);">${student.name}</span></h3>
    <p>الصف الدراسي: ${student.class}</p>
  `;

  if (currentUser.role === 'parent') {
    triggerParentPopups(studentId);
  }

  // 1. Attendance Data
  const attendance = getData('sys_attendance').filter(a => a.studentId === studentId);
  const attTable = document.getElementById('attendance-list');
  attTable.innerHTML = attendance.length ? '' : '<tr><td colspan="2">لا توجد سجلات حضور بعد</td></tr>';
  
  attendance.forEach(a => {
    const badgeClass = a.status === 'حاضر' ? 'badge-present' : 'badge-absent';
    attTable.innerHTML += `<tr><td>${a.date}</td><td><span class="badge ${badgeClass}">${a.status}</span></td></tr>`;
  });

  // 2. Notes Data
  const notes = getData('sys_notes').filter(n => n.studentId === studentId);
  const notesContainer = document.getElementById('notes-list');
  notesContainer.innerHTML = notes.length ? '' : '<p style="color:#777;">لا توجد ملاحظات مسجلة.</p>';
  
  notes.forEach(n => {
    notesContainer.innerHTML += `
      <div style="background:#fff; border: 1px solid #ddd; padding: 10px; margin-top: 8px; border-radius: 6px;">
        <small style="color:#888;">${n.date}</small>
        <p style="margin-top:4px;">${n.text}</p>
      </div>
    `;
  });

  // 3. Homework Data
  renderStudentHomework(studentId);

  // Default active tab
  switchUserTab('attendance');
}

function triggerParentPopups(studentId) {
  let notifications = getData('sys_notifications');
  const unreadNotifs = notifications.filter(n => n.studentId === studentId && !n.isRead);

  if (unreadNotifs.length > 0) {
    unreadNotifs.forEach(n => {
      alert(`🔔 تنبيه جديد لولي الأمر:\n\n${n.message}\nتاريخ الإنجاز: ${n.date}`);
      n.isRead = true;
    });
    setData('sys_notifications', notifications);
  }
}

function renderStudentHomework(studentId) {
  const homeworks = getData('sys_homework');
  const submissions = getData('sys_homework_submissions');
  const container = document.getElementById('student-homework-container');

  if (!homeworks.length) {
    container.innerHTML = '<p style="color:#777;">لا توجد واجبات منزلية مطلوبة حالياً.</p>';
    return;
  }

  const isStudentRole = currentUser && currentUser.role === 'student';

  container.innerHTML = '';
  homeworks.forEach(h => {
    const mySub = submissions.find(s => s.hwId === h.id && s.studentId === studentId);

    let actionHtml = '';
    if (mySub) {
      actionHtml = `<p style="color: green; font-size:13px; margin-top:8px;">✔ تم تسليم الواجب بتاريخ: ${mySub.date}</p>`;
    } else if (isStudentRole) {
      actionHtml = `
        <div style="margin-top:10px;">
          <textarea id="hw-ans-${h.id}" rows="2" placeholder="اكتب حل الواجب هنا لتسليمه للمعلم..."></textarea>
          <button onclick="submitHomework('${h.id}', '${studentId}')" class="btn-success" style="margin-top:5px; width:auto;">رفع الحل للمعلم</button>
        </div>
      `;
    } else {
      actionHtml = `<p style="color:#888; font-size:12px; margin-top:5px;">(يمكن للطالب رفع الواجب من حسابه الشخصي)</p>`;
    }

    container.innerHTML += `
      <div style="background:#fff; border:1px solid #ddd; padding:15px; border-radius:8px; margin-bottom:12px;">
        <h4>المادة: ${h.subject}</h4>
        <p style="margin:5px 0;"><strong>وصف الواجب:</strong> ${h.desc}</p>
        <small style="color:var(--danger)">تاريخ التسليم الأقصى: ${h.dueDate}</small>
        ${actionHtml}
      </div>
    `;
  });
}

function submitHomework(hwId, studentId) {
  const ansInput = document.getElementById(`hw-ans-${hwId}`);
  const answerText = ansInput ? ansInput.value.trim() : '';

  if (!answerText) return alert('يرجى كتابة الإجابة أو الحل قبل الحفظ');

  const homeworks = getData('sys_homework');
  const hw = homeworks.find(h => h.id === hwId);
  const students = getData('sys_students');
  const student = students.find(s => s.id === studentId);

  const submissions = getData('sys_homework_submissions');
  submissions.push({
    hwId,
    studentId,
    answerText,
    date: new Date().toLocaleDateString('ar-EG')
  });
  setData('sys_homework_submissions', submissions);

  const notifications = getData('sys_notifications');
  notifications.push({
    studentId,
    date: new Date().toLocaleDateString('ar-EG') + ' ' + new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'}),
    message: `قام الطالب (${student ? student.name : ''}) بإنجاز وتسليم واجب مادة (${hw ? hw.subject : ''}) بنجاح.`,
    isRead: false
  });
  setData('sys_notifications', notifications);

  alert('تم رفع وإرسال الواجب بنجاح للمعلم!');
  renderStudentHomework(studentId);
}

// Run System Initializer
initDatabase();


