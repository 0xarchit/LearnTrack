from fastapi import FastAPI, HTTPException, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import os, sqlite3
from passlib.context import CryptContext

MAX_UPLOAD_SIZE = 5 * 1024 * 1024

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    ''')
    c.execute('''

        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            instructor TEXT,
            description TEXT,
            status TEXT DEFAULT 'pending'
        )
    ''')
    c.execute('''

        CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            course_id INTEGER,
            description TEXT,
            due_date TEXT
        )
    ''')
    c.execute('''

        CREATE TABLE IF NOT EXISTS materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            course_id INTEGER,
            type TEXT,
            url TEXT
        )
    ''')
    c.execute('''

        CREATE TABLE IF NOT EXISTS grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            course_id INTEGER,
            grade INTEGER
        )
    ''')
    c.execute('''

        CREATE TABLE IF NOT EXISTS enrollments (
            user_id INTEGER,
            course_id INTEGER,
            PRIMARY KEY (user_id, course_id)
        )
    ''')
    c.execute('''

        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            type TEXT NOT NULL,
            target_role TEXT NOT NULL,
            created_at TEXT DEFAULT (DATETIME('now','localtime'))
        )
    ''')
    c.execute('''

        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            assignment_id INTEGER,
            file_url TEXT,
            submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
            grade INTEGER
        )
    ''')
    conn.commit()
    conn.close()
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('ALTER TABLE courses ADD COLUMN status TEXT DEFAULT "pending"')
    except sqlite3.OperationalError:
        pass
    for col in ('phone','address','department','joinDate'):
        try:
            c.execute(f'ALTER TABLE users ADD COLUMN {col} TEXT')
        except sqlite3.OperationalError:
            pass
    try:
        c.execute('ALTER TABLE courses ADD COLUMN duration TEXT DEFAULT ""')
    except sqlite3.OperationalError:
        pass
    try:
        c.execute('ALTER TABLE courses ADD COLUMN instructor_id INTEGER')
    except sqlite3.OperationalError:
        pass
    try:
        rows = c.execute('SELECT id, instructor FROM courses').fetchall()
        for row in rows:
            instr = row['instructor']
            if instr:
                user_row = conn.execute('SELECT id FROM users WHERE name = ?', (instr,)).fetchone()
                instr_id = user_row['id'] if user_row else None
                c.execute('UPDATE courses SET instructor_id = ? WHERE id = ?', (instr_id, row['id']))
    except Exception:
        pass
    try:
        c.execute('ALTER TABLE courses ADD COLUMN thumbnail_url TEXT DEFAULT ""')
    except sqlite3.OperationalError:
        pass
    conn.close()
    conn = get_db_connection(); c = conn.cursor()
    try:
        c.execute('ALTER TABLE submissions ADD COLUMN description TEXT DEFAULT ""')
    except sqlite3.OperationalError:
        pass
    conn.commit(); conn.close()
    conn = get_db_connection(); c = conn.cursor()
    try:
        c.execute('ALTER TABLE assignments ADD COLUMN max_score INTEGER DEFAULT 0')
    except sqlite3.OperationalError:
        pass
    conn.commit(); conn.close()

UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://learntrack.pages.dev", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=86400,
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

class UserIn(BaseModel):
    name: str
    email: str
    password: str
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None
    department: Optional[str] = None
    joinDate: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None
    department: Optional[str] = None
    joinDate: Optional[str] = None

class LoginIn(BaseModel):
    email: str
    password: str
    role: str

class UpdateUser(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    department: Optional[str] = None
    joinDate: Optional[str] = None

class StatusUpdate(BaseModel):
    status: str

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class CourseIn(BaseModel):
    title: str
    instructor_id: int
    description: Optional[str] = ''
    status: Optional[str] = 'pending'
    duration: str

class CourseOut(BaseModel):
    id: int
    title: str
    instructor_id: int
    instructor: str
    description: Optional[str]
    status: str
    duration: str
    thumbnail_url: Optional[str] = None
    students: int

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    instructor_id: Optional[int] = None
    description: Optional[str] = None
    status: Optional[str] = None
    duration: Optional[str] = None

class NotificationIn(BaseModel):
    message: str
    type: str
    target_role: str

class NotificationUpdate(BaseModel):
    message: Optional[str] = None
    type: Optional[str] = None
    target_role: Optional[str] = None

class NotificationOut(BaseModel):
    id: int
    message: str
    type: str
    target_role: str
    created_at: datetime

from typing import List

class Enrollment(BaseModel):
    user_id: int
    course_id: int

class MaterialIn(BaseModel):
    title: str
    course_id: int
    type: str
    url: str

class MaterialOut(BaseModel):
    id: int
    title: str
    course_id: int
    type: str
    url: str

class AssignmentIn(BaseModel):
    title: str
    course_id: int
    description: Optional[str] = ''
    due_date: str
    max_score: int

class AssignmentOut(BaseModel):
    id: int
    title: str
    course_id: int
    description: Optional[str]
    due_date: str
    max_score: int

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/api/register", response_model=UserOut, status_code=201)
def register(user: UserIn):
    conn = get_db_connection(); c = conn.cursor()
    try:
        hashed = pwd_context.hash(user.password)
        c.execute(
            'INSERT INTO users (name, email, password, role, phone, address, department, joinDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            (user.name, user.email, hashed, 'student', user.phone, user.address, user.department, user.joinDate)
        )
        conn.commit()
        user_id = c.lastrowid
        row = conn.execute('SELECT id, name, email, role, phone, address, department, joinDate FROM users WHERE id = ?', (user_id,)).fetchone()
        return dict(row)
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already in use")
    except Exception:
        raise HTTPException(status_code=500, detail="Registration failed")
    finally:
        conn.close()

@app.post("/api/login", response_model=UserOut)
def login(login: LoginIn):
    conn = get_db_connection(); c = conn.cursor()
    c.execute(
        'SELECT id, name, email, role, phone, address, department, joinDate, password FROM users WHERE email = ? AND role = ?',
        (login.email, login.role)
    )
    row = c.fetchone()
    conn.close()
    if not row or not pwd_context.verify(login.password, row['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials or role")
    data = dict(row)
    data.pop('password', None)
    return data

@app.get("/api/courses")
def get_courses():
    conn = get_db_connection()
    rows = conn.execute('''
        SELECT c.id,
               c.thumbnail_url,
               c.title,
               c.instructor_id,
               u.name AS instructor,
               c.description,
               c.status,
               c.duration,
               COUNT(e.user_id) AS students
        FROM courses c
        LEFT JOIN users u ON u.id = c.instructor_id
        LEFT JOIN enrollments e ON e.course_id = c.id
        GROUP BY c.id
    ''').fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/courses/{course_id}", response_model=CourseOut)
def get_course(course_id: int):
    conn = get_db_connection()
    row = conn.execute('''
        SELECT c.id,
               c.thumbnail_url,
               c.title,
               c.instructor_id,
               u.name AS instructor,
               c.description,
               c.status,
               c.duration,
               (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = ?) AS students
        FROM courses c
        LEFT JOIN users u ON u.id = c.instructor_id
        WHERE c.id = ?
    ''', (course_id, course_id)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Course not found")
    return dict(row)

@app.get("/api/assignments")
def get_assignments():
    conn = get_db_connection(); rows = conn.execute('SELECT * FROM assignments').fetchall(); conn.close()
    return [dict(r) for r in rows]

@app.post("/api/assignments", response_model=AssignmentOut, status_code=201)
def create_assignment(assignment: AssignmentIn):
    conn = get_db_connection(); c = conn.cursor()
    c.execute(
        'INSERT INTO assignments (title, course_id, description, due_date, max_score) VALUES (?, ?, ?, ?, ?)',
        (assignment.title, assignment.course_id, assignment.description, assignment.due_date, assignment.max_score)
    )
    conn.commit()
    last_id = c.lastrowid
    row = c.execute(
        'SELECT id, title, course_id, description, due_date, max_score FROM assignments WHERE id = ?',
        (last_id,)
    ).fetchone()
    conn.close()
    return dict(row)

@app.get("/api/assignments/{assignment_id}", response_model=AssignmentOut)
def get_assignment(assignment_id: int):
    conn = get_db_connection()
    row = conn.execute(
        'SELECT id, title, course_id, description, due_date, max_score FROM assignments WHERE id = ?',
        (assignment_id,)
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return dict(row)

@app.delete("/api/assignments/{assignment_id}")
def delete_assignment(assignment_id: int):
    conn = get_db_connection(); c = conn.cursor()
    c.execute('DELETE FROM assignments WHERE id = ?', (assignment_id,))
    conn.commit(); conn.close()
    return {"success": True}

@app.get("/api/materials")
def get_materials():
    conn = get_db_connection(); rows = conn.execute('SELECT * FROM materials').fetchall(); conn.close()
    return [dict(r) for r in rows]

@app.post("/api/materials", response_model=MaterialOut, status_code=201)
async def create_material(
    title: str = Form(...),
    course_id: int = Form(...),
    type: str = Form(...),
    file: UploadFile = File(...)
):
    # Check file size (5MB limit)
    contents = await file.read()
    if len(contents) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail=f"File size exceeds the {MAX_UPLOAD_SIZE / (1024 * 1024)}MB limit")
    
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(contents)
    url = f"/uploads/{file.filename}"
    
    conn = get_db_connection(); c = conn.cursor()
    c.execute(
        'INSERT INTO materials (title, course_id, type, url) VALUES (?, ?, ?, ?)',
        (title, course_id, type, url)
    )
    conn.commit()
    material_id = c.lastrowid
    row = c.execute(
        'SELECT id, title, course_id, type, url FROM materials WHERE id = ?', (material_id,)
    ).fetchone()
    conn.close()
    return dict(row)

@app.delete("/api/materials/{material_id}")
def delete_material(material_id: int):
    conn = get_db_connection(); c = conn.cursor()
    c.execute('DELETE FROM materials WHERE id = ?', (material_id,))
    conn.commit(); conn.close()
    return {"success": True}

@app.get("/api/grades")
def get_grades(user_id: int = Query(...)):
    conn = get_db_connection(); rows = conn.execute('SELECT * FROM grades WHERE user_id = ?', (user_id,)).fetchall(); conn.close()
    return [dict(r) for r in rows]

@app.get("/api/users", response_model=List[UserOut])
def get_users():
    conn = get_db_connection(); rows = conn.execute('SELECT id, name, email, role, phone, address, department, joinDate FROM users').fetchall(); conn.close()
    return [dict(r) for r in rows]

@app.post("/api/users", response_model=UserOut, status_code=201)
def create_user(user: UserIn):
    conn = get_db_connection(); c = conn.cursor()
    try:
        hashed = pwd_context.hash(user.password)
        c.execute(
            'INSERT INTO users (name, email, password, role, phone, address, department, joinDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            (user.name, user.email, hashed, user.role, user.phone, user.address, user.department, user.joinDate)
        )
        conn.commit()
        user_id = c.lastrowid
        row = conn.execute('SELECT id, name, email, role, phone, address, department, joinDate FROM users WHERE id = ?', (user_id,)).fetchone()
        return dict(row)
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already in use")
    finally:
        conn.close()

@app.put("/api/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, user: UpdateUser):
    conn = get_db_connection(); c = conn.cursor()
    existing = c.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    if not existing:
        conn.close(); raise HTTPException(status_code=404, detail="User not found")
    updated = {
        'name': user.name or existing['name'],
        'email': user.email or existing['email'],
        'role': user.role or existing['role'],
        'phone': user.phone if user.phone is not None else existing['phone'],
        'address': user.address if user.address is not None else existing['address'],
        'department': user.department if user.department is not None else existing['department'],
        'joinDate': user.joinDate if user.joinDate is not None else existing['joinDate'],
    }
    c.execute(
        'UPDATE users SET name=?, email=?, role=?, phone=?, address=?, department=?, joinDate=? WHERE id = ?',
        (updated['name'], updated['email'], updated['role'], updated['phone'], updated['address'], updated['department'], updated['joinDate'], user_id)
    )
    conn.commit()
    row = c.execute('SELECT id, name, email, role, phone, address, department, joinDate FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return dict(row)

@app.put("/api/users/{user_id}/password")
def change_password(user_id: int, pwd: PasswordUpdate):
    conn = get_db_connection(); c = conn.cursor()
    row = c.execute('SELECT password FROM users WHERE id = ?', (user_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    if not pwd_context.verify(pwd.current_password, row['password']):
        raise HTTPException(status_code=400, detail="Current password incorrect")
    new_hashed = pwd_context.hash(pwd.new_password)
    c.execute('UPDATE users SET password = ? WHERE id = ?', (new_hashed, user_id))
    conn.commit(); conn.close()
    return {"success": True}

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int):
    conn = get_db_connection(); c = conn.cursor(); c.execute('DELETE FROM users WHERE id = ?', (user_id,)); conn.commit(); conn.close()
    return {"success": True}

@app.get("/api/courses/requests")
def get_course_requests():
    conn = get_db_connection(); rows = conn.execute('SELECT * FROM courses WHERE status = ?', ('pending',)).fetchall(); conn.close()
    return [dict(r) for r in rows]

@app.put("/api/courses/requests/{course_id}")
def approve_course_request(course_id: int, status_update: StatusUpdate):
    if status_update.status not in ('approved', 'rejected'):
        raise HTTPException(status_code=400, detail="Invalid status")
    conn = get_db_connection(); c = conn.cursor()
    c.execute('UPDATE courses SET status = ? WHERE id = ?', (status_update.status, course_id))
    conn.commit(); conn.close()
    return {"id": course_id, "status": status_update.status}

@app.post("/api/courses", response_model=CourseOut, status_code=201)
async def create_course(
    title: str = Form(...),
    instructor_id: int = Form(...),
    description: Optional[str] = Form(''),
    status: str = Form('pending'),
    duration: str = Form(''),
    thumbnail: UploadFile = File(None)
):
    thumb_url = ''
    if thumbnail:
        thumb_path = os.path.join(UPLOAD_DIR, thumbnail.filename)
        contents = await thumbnail.read()
        with open(thumb_path, 'wb') as f:
            f.write(contents)
        thumb_url = f"/uploads/{thumbnail.filename}"
    conn = get_db_connection(); c = conn.cursor()
    c.execute(
        'INSERT INTO courses (title, instructor_id, description, status, duration, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)',
        (title, instructor_id, description, status, duration, thumb_url)
    )
    conn.commit()
    course_id = c.lastrowid
    row = c.execute('''
        SELECT c.id, c.thumbnail_url, c.title, c.instructor_id, u.name AS instructor, c.description, c.status, c.duration,
               (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS students
        FROM courses c
        LEFT JOIN users u ON u.id = c.instructor_id
        WHERE c.id = ?
    ''', (course_id,)).fetchone()
    conn.close()
    return dict(row)

@app.put("/api/courses/{course_id}", response_model=CourseOut)
async def update_course(
    course_id: int,
    title: str = Form(...),
    instructor_id: int = Form(...),
    description: Optional[str] = Form(''),
    status: str = Form('pending'),
    duration: str = Form(''),
    thumbnail: UploadFile = File(None)
):
    conn = get_db_connection(); c = conn.cursor()
    existing = c.execute('SELECT * FROM courses WHERE id = ?', (course_id,)).fetchone()
    if not existing:
        conn.close(); raise HTTPException(status_code=404, detail="Course not found")
    thumb_url = existing['thumbnail_url'] or ''
    if thumbnail:
        thumb_path = os.path.join(UPLOAD_DIR, thumbnail.filename)
        contents = await thumbnail.read()
        with open(thumb_path, 'wb') as f:
            f.write(contents)
        thumb_url = f"/uploads/{thumbnail.filename}"
    c.execute(
        'UPDATE courses SET title=?, instructor_id=?, description=?, status=?, duration=?, thumbnail_url=? WHERE id = ?',
        (title, instructor_id, description, status, duration, thumb_url, course_id)
    )
    conn.commit()
    row = c.execute('''
        SELECT c.id, c.thumbnail_url, c.title, c.instructor_id, u.name AS instructor, c.description, c.status, c.duration,
               (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS students
        FROM courses c
        LEFT JOIN users u ON u.id = c.instructor_id
        WHERE c.id = ?
    ''', (course_id,)).fetchone()
    conn.close()
    return dict(row)

@app.delete("/api/courses/{course_id}")
def delete_course(course_id: int):
    conn = get_db_connection(); c = conn.cursor()
    c.execute('DELETE FROM courses WHERE id = ?', (course_id,))
    conn.commit(); conn.close()
    return {"success": True}

@app.get("/api/reports/performance")
def report_performance():
    return [
        {'course': 'Programming', 'avgGrade': 85, 'completion': 92},
        {'course': 'Web Dev', 'avgGrade': 78, 'completion': 88},
        {'course': 'Database', 'avgGrade': 82, 'completion': 85},
        {'course': 'AI', 'avgGrade': 75, 'completion': 80},
        {'course': 'Networks', 'avgGrade': 88, 'completion': 95},
    ]

@app.get("/api/reports/metrics")
def report_metrics():
    return [
        {'label': 'Overall Completion Rate', 'value': '87%', 'change': '+5%'},
        {'label': 'Average Course Rating', 'value': '4.5/5', 'change': '+0.2'},
        {'label': 'Student Satisfaction', 'value': '92%', 'change': '+3%'},
        {'label': 'Active Learning Hours', 'value': '2,456', 'change': '+12%'},
    ]

@app.get("/api/courses/{course_id}/students", response_model=List[UserOut])
def get_course_students(course_id: int):
    conn = get_db_connection()
    rows = conn.execute(
        'SELECT u.id, u.name, u.email, u.role, u.phone, u.address, u.department, u.joinDate '
        'FROM enrollments e JOIN users u ON e.user_id = u.id WHERE e.course_id = ?',
        (course_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/enrollments")
def get_enrollments(user_id: int):
    conn = get_db_connection()
    rows = conn.execute('SELECT course_id FROM enrollments WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    return [r['course_id'] for r in rows]

@app.post("/api/enroll")
def enroll(enrollment: Enrollment):
    conn = get_db_connection(); c = conn.cursor()
    try:
        c.execute('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', (enrollment.user_id, enrollment.course_id))
    except sqlite3.IntegrityError:
        pass
    conn.commit(); conn.close()
    return {"success": True}

@app.delete("/api/enroll")
def unenroll(enrollment: Enrollment):
    conn = get_db_connection(); c = conn.cursor()
    c.execute('DELETE FROM enrollments WHERE user_id = ? AND course_id = ?', (enrollment.user_id, enrollment.course_id))
    conn.commit(); conn.close()
    return {"success": True}

@app.post("/api/notifications", response_model=NotificationOut)
def create_notification(notif: NotificationIn):
    conn = get_db_connection(); c = conn.cursor()
    c.execute(
        'INSERT INTO notifications (message, type, target_role, created_at) VALUES (?, ?, ?, DATETIME(\'now\', \'localtime\'))',
        (notif.message, notif.type, notif.target_role)
    )
    conn.commit()
    notif_id = c.lastrowid
    row = c.execute(
        'SELECT id, message, type, target_role, created_at FROM notifications WHERE id = ?',
        (notif_id,)
    ).fetchone()
    conn.close()
    return dict(row)

@app.get("/api/notifications", response_model=List[NotificationOut])
def get_notifications(target_role: str):
    conn = get_db_connection()
    rows = conn.execute(
        'SELECT id, message, type, target_role, created_at FROM notifications WHERE target_role = ? OR target_role = ? ORDER BY created_at DESC',
        (target_role, 'all')
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/notifications/all", response_model=List[NotificationOut])
def get_all_notifications():
    conn = get_db_connection()
    rows = conn.execute(
        'SELECT id, message, type, target_role, created_at FROM notifications ORDER BY created_at DESC'
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.put("/api/notifications/{notif_id}", response_model=NotificationOut)
def update_notification(notif_id: int, notif: NotificationUpdate):
    conn = get_db_connection(); c = conn.cursor()
    existing = c.execute('SELECT * FROM notifications WHERE id = ?', (notif_id,)).fetchone()
    if not existing:
        conn.close(); raise HTTPException(status_code=404, detail="Notification not found")
    updated = {
        'message': notif.message or existing['message'],
        'type': notif.type or existing['type'],
        'target_role': notif.target_role or existing['target_role'],
    }
    c.execute(
        'UPDATE notifications SET message = ?, type = ?, target_role = ? WHERE id = ?',
        (updated['message'], updated['type'], updated['target_role'], notif_id)
    )
    conn.commit()
    row = c.execute(
        'SELECT id, message, type, target_role, created_at FROM notifications WHERE id = ?',
        (notif_id,)
    ).fetchone()
    conn.close()
    return dict(row)

@app.delete("/api/notifications/{notif_id}")
def delete_notification(notif_id: int):
    conn = get_db_connection(); c = conn.cursor()
    c.execute('DELETE FROM notifications WHERE id = ?', (notif_id,))
    conn.commit(); conn.close()
    return {"success": True}

@app.get("/api/assignments/{assignment_id}/submissions")
def get_submissions(assignment_id: int):
    conn = get_db_connection(); rows = conn.execute(
        'SELECT s.id, s.user_id, u.name as user_name, s.file_url, s.submitted_at, s.grade '
        'FROM submissions s JOIN users u ON s.user_id = u.id '
        'WHERE s.assignment_id = ?', (assignment_id,)
    ).fetchall(); conn.close()
    return [dict(r) for r in rows]

@app.put("/api/submissions/{submission_id}/grade")
def grade_submission(submission_id: int, grade: int = Query(...)):
    conn = get_db_connection(); c = conn.cursor()
    c.execute('UPDATE submissions SET grade = ? WHERE id = ?', (grade, submission_id))
    conn.commit(); conn.close()
    return {"id": submission_id, "grade": grade}

@app.post("/api/assignments/{assignment_id}/submissions")
async def create_submission(
    assignment_id: int,
    user_id: int = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(None)
):
    if not description and not file:
        raise HTTPException(status_code=400, detail="Either file or description is required")
    file_url = ""
    if file:
        sub_dir = os.path.join(UPLOAD_DIR, 'submissions')
        os.makedirs(sub_dir, exist_ok=True)
        file_path = os.path.join(sub_dir, file.filename)
        contents = await file.read()
        with open(file_path, 'wb') as f:
            f.write(contents)
        file_url = f"/uploads/submissions/{file.filename}"
    conn = get_db_connection(); c = conn.cursor()
    c.execute(
        'INSERT INTO submissions (user_id, assignment_id, file_url, description) VALUES (?, ?, ?, ?)',
        (user_id, assignment_id, file_url, description or "")
    )
    conn.commit()
    sub_id = c.lastrowid
    row = c.execute(
        'SELECT id, user_id, assignment_id, file_url, submitted_at, grade, description FROM submissions WHERE id = ?',
        (sub_id,)
    ).fetchone()
    conn.close()
    return dict(row)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app:app', host='0.0.0.0', port=5000, reload=True)
