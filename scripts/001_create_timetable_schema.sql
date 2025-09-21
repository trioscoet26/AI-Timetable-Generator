-- Create institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  head_of_department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  building TEXT,
  capacity INTEGER NOT NULL DEFAULT 0,
  room_type TEXT CHECK (room_type IN ('lecture_hall', 'laboratory', 'seminar_room', 'auditorium', 'computer_lab')),
  equipment TEXT[], -- Array of available equipment
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faculty table
CREATE TABLE IF NOT EXISTS faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  designation TEXT,
  specialization TEXT[],
  max_hours_per_week INTEGER DEFAULT 20,
  preferred_time_slots JSONB, -- Store preferred time slots as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  semester INTEGER NOT NULL,
  course_type TEXT CHECK (course_type IN ('theory', 'practical', 'tutorial', 'project')),
  prerequisites TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(institution_id, course_code)
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  semester INTEGER NOT NULL,
  batch_year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_name TEXT, -- e.g., "Period 1", "Morning Session"
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_faculty mapping table (many-to-many)
CREATE TABLE IF NOT EXISTS course_faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, faculty_id)
);

-- Create student_courses mapping table (many-to-many)
CREATE TABLE IF NOT EXISTS student_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
  UNIQUE(student_id, course_id)
);

-- Create timetables table
CREATE TABLE IF NOT EXISTS timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  semester INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  generated_by TEXT, -- Algorithm used for generation
  generation_metadata JSONB, -- Store algorithm parameters and results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timetable_entries table
CREATE TABLE IF NOT EXISTS timetable_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timetable_id UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
  entry_type TEXT DEFAULT 'regular' CHECK (entry_type IN ('regular', 'makeup', 'extra')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure no conflicts: same room, time slot cannot be double booked
  UNIQUE(room_id, time_slot_id, timetable_id),
  -- Ensure faculty doesn't have conflicts
  UNIQUE(faculty_id, time_slot_id, timetable_id)
);

-- Create faculty_availability table
CREATE TABLE IF NOT EXISTS faculty_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT TRUE,
  preference_level INTEGER DEFAULT 3 CHECK (preference_level BETWEEN 1 AND 5), -- 1=least preferred, 5=most preferred
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(faculty_id, time_slot_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_departments_institution ON departments(institution_id);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department_id);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_timetable ON timetable_entries(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_course ON timetable_entries(course_id);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_faculty ON timetable_entries(faculty_id);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_room ON timetable_entries(room_id);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_time_slot ON timetable_entries(time_slot_id);
CREATE INDEX IF NOT EXISTS idx_faculty_availability_faculty ON faculty_availability(faculty_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_day_time ON time_slots(day_of_week, start_time);

-- Enable Row Level Security on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_availability ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - can be refined based on user roles)
-- For now, allowing all operations for authenticated users
-- In production, these should be more restrictive based on user roles

CREATE POLICY "Allow authenticated users to view institutions" ON institutions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage institutions" ON institutions FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view departments" ON departments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage departments" ON departments FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view rooms" ON rooms FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage rooms" ON rooms FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view faculty" ON faculty FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage faculty" ON faculty FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view courses" ON courses FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage courses" ON courses FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view students" ON students FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage students" ON students FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view time_slots" ON time_slots FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage time_slots" ON time_slots FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view course_faculty" ON course_faculty FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage course_faculty" ON course_faculty FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view student_courses" ON student_courses FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage student_courses" ON student_courses FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view timetables" ON timetables FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage timetables" ON timetables FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view timetable_entries" ON timetable_entries FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage timetable_entries" ON timetable_entries FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view faculty_availability" ON faculty_availability FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage faculty_availability" ON faculty_availability FOR ALL USING (auth.uid() IS NOT NULL);
