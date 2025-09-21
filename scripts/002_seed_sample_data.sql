-- Insert sample institution
INSERT INTO institutions (id, name, address, contact_email, contact_phone) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Sample University', '123 Education Street, Academic City', 'admin@sampleuniversity.edu', '+1-555-0123');

-- Insert sample departments
INSERT INTO departments (id, institution_id, name, code, head_of_department) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Computer Science', 'CS', 'Dr. John Smith'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Mathematics', 'MATH', 'Dr. Jane Doe'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Physics', 'PHY', 'Dr. Robert Johnson');

-- Insert sample rooms
INSERT INTO rooms (id, institution_id, room_number, building, capacity, room_type, equipment) VALUES 
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'CS-101', 'Computer Science Building', 60, 'lecture_hall', ARRAY['projector', 'whiteboard', 'audio_system']),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'CS-LAB1', 'Computer Science Building', 30, 'computer_lab', ARRAY['computers', 'projector', 'air_conditioning']),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'MATH-201', 'Mathematics Building', 50, 'lecture_hall', ARRAY['projector', 'whiteboard']),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', 'PHY-LAB1', 'Physics Building', 25, 'laboratory', ARRAY['lab_equipment', 'safety_gear', 'projector']);

-- Insert sample time slots (Monday to Friday, 9 AM to 5 PM)
INSERT INTO time_slots (id, institution_id, day_of_week, start_time, end_time, slot_name) VALUES 
-- Monday
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', 1, '09:00', '10:00', 'Period 1'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440000', 1, '10:00', '11:00', 'Period 2'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440000', 1, '11:30', '12:30', 'Period 3'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440000', 1, '12:30', '13:30', 'Period 4'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440000', 1, '14:30', '15:30', 'Period 5'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440000', 1, '15:30', '16:30', 'Period 6'),
-- Tuesday
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440000', 2, '09:00', '10:00', 'Period 1'),
('550e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440000', 2, '10:00', '11:00', 'Period 2'),
('550e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440000', 2, '11:30', '12:30', 'Period 3'),
('550e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440000', 2, '12:30', '13:30', 'Period 4'),
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440000', 2, '14:30', '15:30', 'Period 5'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440000', 2, '15:30', '16:30', 'Period 6');

-- Insert sample faculty
INSERT INTO faculty (id, institution_id, department_id, employee_id, name, email, phone, designation, specialization, max_hours_per_week) VALUES 
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'CS001', 'Dr. Alice Johnson', 'alice.johnson@sampleuniversity.edu', '+1-555-0201', 'Professor', ARRAY['Data Structures', 'Algorithms', 'Machine Learning'], 18),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'CS002', 'Dr. Bob Wilson', 'bob.wilson@sampleuniversity.edu', '+1-555-0202', 'Associate Professor', ARRAY['Database Systems', 'Web Development'], 20),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'MATH001', 'Dr. Carol Brown', 'carol.brown@sampleuniversity.edu', '+1-555-0301', 'Professor', ARRAY['Calculus', 'Linear Algebra', 'Statistics'], 16);

-- Insert sample courses
INSERT INTO courses (id, institution_id, department_id, course_code, course_name, credits, semester, course_type, description) VALUES 
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'CS101', 'Introduction to Programming', 4, 1, 'theory', 'Basic programming concepts using Python'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'CS102', 'Data Structures', 4, 2, 'theory', 'Fundamental data structures and algorithms'),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'CS103', 'Database Systems', 3, 3, 'theory', 'Database design and management'),
('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'MATH101', 'Calculus I', 4, 1, 'theory', 'Differential and integral calculus');

-- Insert course-faculty mappings
INSERT INTO course_faculty (course_id, faculty_id, is_primary) VALUES 
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440040', true),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440040', true),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440041', true),
('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440042', true);

-- Insert sample students
INSERT INTO students (id, institution_id, department_id, student_id, name, email, phone, semester, batch_year) VALUES 
('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'CS2024001', 'John Student', 'john.student@sampleuniversity.edu', '+1-555-1001', 1, 2024),
('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'CS2024002', 'Jane Student', 'jane.student@sampleuniversity.edu', '+1-555-1002', 1, 2024),
('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'MATH2024001', 'Mike Student', 'mike.student@sampleuniversity.edu', '+1-555-1003', 1, 2024);

-- Insert student course enrollments
INSERT INTO student_courses (student_id, course_id) VALUES 
('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440050'),
('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440053'),
('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440050'),
('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440053'),
('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440053');

-- Insert faculty availability (sample preferences)
INSERT INTO faculty_availability (faculty_id, time_slot_id, is_available, preference_level) VALUES 
-- Dr. Alice Johnson preferences
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440020', true, 5), -- Monday 9-10 AM
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440021', true, 4), -- Monday 10-11 AM
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440022', true, 3), -- Monday 11:30-12:30 PM
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440026', true, 5), -- Tuesday 9-10 AM
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440027', true, 4), -- Tuesday 10-11 AM
-- Dr. Bob Wilson preferences
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440022', true, 5), -- Monday 11:30-12:30 PM
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440023', true, 4), -- Monday 12:30-1:30 PM
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440028', true, 5), -- Tuesday 11:30-12:30 PM
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440029', true, 4), -- Tuesday 12:30-1:30 PM
-- Dr. Carol Brown preferences
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440020', true, 4), -- Monday 9-10 AM
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440024', true, 5), -- Monday 2:30-3:30 PM
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440030', true, 5); -- Tuesday 2:30-3:30 PM
