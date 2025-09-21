"""
AI-Based Timetable Generation Algorithms
Implements Greedy, Backtracking, and Constraint Satisfaction algorithms
"""

import json
import random
from typing import List, Dict, Set, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import itertools

class AlgorithmType(Enum):
    GREEDY = "greedy"
    BACKTRACKING = "backtracking"
    CONSTRAINT_SATISFACTION = "constraint_satisfaction"

@dataclass
class TimeSlot:
    id: str
    day_of_week: int
    start_time: str
    end_time: str
    slot_name: str

@dataclass
class Room:
    id: str
    room_number: str
    capacity: int
    room_type: str
    equipment: List[str]

@dataclass
class Faculty:
    id: str
    name: str
    department_id: str
    max_hours_per_week: int
    specialization: List[str]
    availability: Dict[str, int]  # time_slot_id -> preference_level

@dataclass
class Course:
    id: str
    course_code: str
    course_name: str
    credits: int
    semester: int
    course_type: str
    faculty_id: str
    required_room_type: str
    min_capacity: int

@dataclass
class TimetableEntry:
    course_id: str
    faculty_id: str
    room_id: str
    time_slot_id: str
    conflict_score: float = 0.0

class TimetableConstraints:
    """Defines all constraints for timetable generation"""
    
    def __init__(self):
        self.hard_constraints = [
            self.no_faculty_conflict,
            self.no_room_conflict,
            self.faculty_availability,
            self.room_capacity_check,
            self.room_type_match
        ]
        
        self.soft_constraints = [
            self.faculty_preference,
            self.balanced_workload,
            self.minimize_gaps,
            self.department_clustering
        ]
    
    def no_faculty_conflict(self, entry: TimetableEntry, schedule: List[TimetableEntry]) -> bool:
        """Faculty cannot be in two places at the same time"""
        for existing in schedule:
            if (existing.faculty_id == entry.faculty_id and 
                existing.time_slot_id == entry.time_slot_id):
                return False
        return True
    
    def no_room_conflict(self, entry: TimetableEntry, schedule: List[TimetableEntry]) -> bool:
        """Room cannot be double-booked"""
        for existing in schedule:
            if (existing.room_id == entry.room_id and 
                existing.time_slot_id == entry.time_slot_id):
                return False
        return True
    
    def faculty_availability(self, entry: TimetableEntry, faculty_data: Dict[str, Faculty]) -> bool:
        """Faculty must be available at the assigned time"""
        faculty = faculty_data.get(entry.faculty_id)
        if not faculty:
            return False
        return entry.time_slot_id in faculty.availability
    
    def room_capacity_check(self, entry: TimetableEntry, course_data: Dict[str, Course], 
                           room_data: Dict[str, Room]) -> bool:
        """Room capacity must be sufficient for the course"""
        course = course_data.get(entry.course_id)
        room = room_data.get(entry.room_id)
        if not course or not room:
            return False
        return room.capacity >= course.min_capacity
    
    def room_type_match(self, entry: TimetableEntry, course_data: Dict[str, Course], 
                       room_data: Dict[str, Room]) -> bool:
        """Room type must match course requirements"""
        course = course_data.get(entry.course_id)
        room = room_data.get(entry.room_id)
        if not course or not room:
            return False
        return room.room_type == course.required_room_type or course.required_room_type == "any"
    
    def faculty_preference(self, entry: TimetableEntry, faculty_data: Dict[str, Faculty]) -> float:
        """Higher score for preferred time slots"""
        faculty = faculty_data.get(entry.faculty_id)
        if not faculty:
            return 0.0
        preference = faculty.availability.get(entry.time_slot_id, 1)
        return preference / 5.0  # Normalize to 0-1
    
    def balanced_workload(self, entry: TimetableEntry, schedule: List[TimetableEntry], 
                         faculty_data: Dict[str, Faculty]) -> float:
        """Penalize overloaded faculty"""
        faculty = faculty_data.get(entry.faculty_id)
        if not faculty:
            return 0.0
        
        current_hours = sum(1 for s in schedule if s.faculty_id == entry.faculty_id)
        max_hours = faculty.max_hours_per_week
        
        if current_hours >= max_hours:
            return 0.0
        return 1.0 - (current_hours / max_hours)
    
    def minimize_gaps(self, entry: TimetableEntry, schedule: List[TimetableEntry]) -> float:
        """Prefer consecutive time slots for same faculty"""
        faculty_slots = [s.time_slot_id for s in schedule if s.faculty_id == entry.faculty_id]
        # This is a simplified version - in practice, you'd check actual time adjacency
        return 0.8 if len(faculty_slots) > 0 else 1.0
    
    def department_clustering(self, entry: TimetableEntry, course_data: Dict[str, Course]) -> float:
        """Prefer grouping courses from same department"""
        # Simplified implementation
        return 0.9

class GreedyTimetableGenerator:
    """Greedy algorithm for timetable generation"""
    
    def __init__(self, constraints: TimetableConstraints):
        self.constraints = constraints
    
    def generate(self, courses: List[Course], faculty: List[Faculty], 
                rooms: List[Room], time_slots: List[TimeSlot]) -> List[TimetableEntry]:
        """Generate timetable using greedy approach"""
        
        # Convert to dictionaries for faster lookup
        faculty_data = {f.id: f for f in faculty}
        room_data = {r.id: r for r in rooms}
        course_data = {c.id: c for c in courses}
        
        schedule = []
        unscheduled_courses = courses.copy()
        
        # Sort courses by priority (credits, semester, etc.)
        unscheduled_courses.sort(key=lambda c: (-c.credits, c.semester))
        
        for course in unscheduled_courses:
            best_entry = None
            best_score = -1
            
            # Try all combinations of rooms and time slots
            for room in rooms:
                for time_slot in time_slots:
                    entry = TimetableEntry(
                        course_id=course.id,
                        faculty_id=course.faculty_id,
                        room_id=room.id,
                        time_slot_id=time_slot.id
                    )
                    
                    # Check hard constraints
                    if self._satisfies_hard_constraints(entry, schedule, faculty_data, 
                                                      room_data, course_data):
                        # Calculate soft constraint score
                        score = self._calculate_soft_score(entry, schedule, faculty_data, 
                                                         room_data, course_data)
                        
                        if score > best_score:
                            best_score = score
                            best_entry = entry
            
            if best_entry:
                best_entry.conflict_score = best_score
                schedule.append(best_entry)
        
        return schedule
    
    def _satisfies_hard_constraints(self, entry: TimetableEntry, schedule: List[TimetableEntry],
                                   faculty_data: Dict, room_data: Dict, course_data: Dict) -> bool:
        """Check if entry satisfies all hard constraints"""
        for constraint in self.constraints.hard_constraints:
            if constraint == self.constraints.faculty_availability:
                if not constraint(entry, faculty_data):
                    return False
            elif constraint in [self.constraints.room_capacity_check, self.constraints.room_type_match]:
                if not constraint(entry, course_data, room_data):
                    return False
            else:
                if not constraint(entry, schedule):
                    return False
        return True
    
    def _calculate_soft_score(self, entry: TimetableEntry, schedule: List[TimetableEntry],
                             faculty_data: Dict, room_data: Dict, course_data: Dict) -> float:
        """Calculate soft constraint satisfaction score"""
        total_score = 0.0
        for constraint in self.constraints.soft_constraints:
            if constraint == self.constraints.faculty_preference:
                total_score += constraint(entry, faculty_data)
            elif constraint == self.constraints.balanced_workload:
                total_score += constraint(entry, schedule, faculty_data)
            else:
                total_score += constraint(entry, schedule)
        
        return total_score / len(self.constraints.soft_constraints)

class BacktrackingTimetableGenerator:
    """Backtracking algorithm for timetable generation"""
    
    def __init__(self, constraints: TimetableConstraints):
        self.constraints = constraints
        self.solutions = []
    
    def generate(self, courses: List[Course], faculty: List[Faculty], 
                rooms: List[Room], time_slots: List[TimeSlot]) -> List[TimetableEntry]:
        """Generate timetable using backtracking"""
        
        faculty_data = {f.id: f for f in faculty}
        room_data = {r.id: r for r in rooms}
        course_data = {c.id: c for c in courses}
        
        schedule = []
        
        if self._backtrack(courses, 0, schedule, faculty_data, room_data, 
                          course_data, rooms, time_slots):
            return schedule
        
        return []  # No solution found
    
    def _backtrack(self, courses: List[Course], course_index: int, 
                   schedule: List[TimetableEntry], faculty_data: Dict, 
                   room_data: Dict, course_data: Dict, rooms: List[Room], 
                   time_slots: List[TimeSlot]) -> bool:
        """Recursive backtracking function"""
        
        if course_index >= len(courses):
            return True  # All courses scheduled successfully
        
        course = courses[course_index]
        
        # Try all room-time combinations
        for room in rooms:
            for time_slot in time_slots:
                entry = TimetableEntry(
                    course_id=course.id,
                    faculty_id=course.faculty_id,
                    room_id=room.id,
                    time_slot_id=time_slot.id
                )
                
                if self._is_valid_assignment(entry, schedule, faculty_data, 
                                           room_data, course_data):
                    schedule.append(entry)
                    
                    if self._backtrack(courses, course_index + 1, schedule, 
                                     faculty_data, room_data, course_data, 
                                     rooms, time_slots):
                        return True
                    
                    # Backtrack
                    schedule.pop()
        
        return False
    
    def _is_valid_assignment(self, entry: TimetableEntry, schedule: List[TimetableEntry],
                            faculty_data: Dict, room_data: Dict, course_data: Dict) -> bool:
        """Check if assignment is valid"""
        for constraint in self.constraints.hard_constraints:
            if constraint == self.constraints.faculty_availability:
                if not constraint(entry, faculty_data):
                    return False
            elif constraint in [self.constraints.room_capacity_check, self.constraints.room_type_match]:
                if not constraint(entry, course_data, room_data):
                    return False
            else:
                if not constraint(entry, schedule):
                    return False
        return True

class CSPTimetableGenerator:
    """Constraint Satisfaction Problem approach for timetable generation"""
    
    def __init__(self, constraints: TimetableConstraints):
        self.constraints = constraints
    
    def generate(self, courses: List[Course], faculty: List[Faculty], 
                rooms: List[Room], time_slots: List[TimeSlot]) -> List[TimetableEntry]:
        """Generate timetable using CSP with arc consistency and heuristics"""
        
        faculty_data = {f.id: f for f in faculty}
        room_data = {r.id: r for r in rooms}
        course_data = {c.id: c for c in courses}
        
        # Create domains for each course (possible room-time combinations)
        domains = {}
        for course in courses:
            domains[course.id] = []
            for room in rooms:
                for time_slot in time_slots:
                    entry = TimetableEntry(
                        course_id=course.id,
                        faculty_id=course.faculty_id,
                        room_id=room.id,
                        time_slot_id=time_slot.id
                    )
                    
                    # Only include if it satisfies basic constraints
                    if self._satisfies_unary_constraints(entry, faculty_data, 
                                                       room_data, course_data):
                        domains[course.id].append(entry)
        
        # Apply arc consistency
        self._arc_consistency(domains, courses, faculty_data, room_data, course_data)
        
        # Use backtracking with MRV and LCV heuristics
        assignment = {}
        if self._csp_backtrack(assignment, domains, courses, faculty_data, 
                              room_data, course_data):
            return list(assignment.values())
        
        return []
    
    def _satisfies_unary_constraints(self, entry: TimetableEntry, faculty_data: Dict,
                                   room_data: Dict, course_data: Dict) -> bool:
        """Check unary constraints (constraints involving single variable)"""
        return (self.constraints.faculty_availability(entry, faculty_data) and
                self.constraints.room_capacity_check(entry, course_data, room_data) and
                self.constraints.room_type_match(entry, course_data, room_data))
    
    def _arc_consistency(self, domains: Dict, courses: List[Course], 
                        faculty_data: Dict, room_data: Dict, course_data: Dict):
        """Apply arc consistency to reduce domains"""
        changed = True
        while changed:
            changed = False
            for course1 in courses:
                for course2 in courses:
                    if course1.id != course2.id:
                        if self._revise(domains, course1.id, course2.id, faculty_data, room_data):
                            changed = True
    
    def _revise(self, domains: Dict, course1_id: str, course2_id: str,
               faculty_data: Dict, room_data: Dict) -> bool:
        """Revise domain of course1 with respect to course2"""
        revised = False
        to_remove = []
        
        for entry1 in domains[course1_id]:
            consistent = False
            for entry2 in domains[course2_id]:
                if self._consistent(entry1, entry2, faculty_data, room_data):
                    consistent = True
                    break
            
            if not consistent:
                to_remove.append(entry1)
                revised = True
        
        for entry in to_remove:
            domains[course1_id].remove(entry)
        
        return revised
    
    def _consistent(self, entry1: TimetableEntry, entry2: TimetableEntry,
                   faculty_data: Dict, room_data: Dict) -> bool:
        """Check if two entries are consistent"""
        # Faculty conflict
        if (entry1.faculty_id == entry2.faculty_id and 
            entry1.time_slot_id == entry2.time_slot_id):
            return False
        
        # Room conflict
        if (entry1.room_id == entry2.room_id and 
            entry1.time_slot_id == entry2.time_slot_id):
            return False
        
        return True
    
    def _csp_backtrack(self, assignment: Dict, domains: Dict, courses: List[Course],
                      faculty_data: Dict, room_data: Dict, course_data: Dict) -> bool:
        """CSP backtracking with heuristics"""
        
        if len(assignment) == len(courses):
            return True
        
        # MRV: Choose variable with minimum remaining values
        unassigned_courses = [c for c in courses if c.id not in assignment]
        course = min(unassigned_courses, key=lambda c: len(domains[c.id]))
        
        # LCV: Order values by least constraining value
        domain_values = sorted(domains[course.id], 
                             key=lambda entry: self._count_conflicts(entry, domains, assignment))
        
        for entry in domain_values:
            if self._is_consistent_with_assignment(entry, assignment):
                assignment[course.id] = entry
                
                # Forward checking
                old_domains = self._forward_check(domains, course.id, entry, assignment)
                
                if all(len(domain) > 0 for cid, domain in domains.items() if cid not in assignment):
                    if self._csp_backtrack(assignment, domains, courses, 
                                         faculty_data, room_data, course_data):
                        return True
                
                # Restore domains
                domains.update(old_domains)
                del assignment[course.id]
        
        return False
    
    def _count_conflicts(self, entry: TimetableEntry, domains: Dict, assignment: Dict) -> int:
        """Count how many values this entry would eliminate from other domains"""
        conflicts = 0
        for course_id, domain in domains.items():
            if course_id not in assignment:
                for other_entry in domain:
                    if not self._consistent(entry, other_entry, {}, {}):
                        conflicts += 1
        return conflicts
    
    def _is_consistent_with_assignment(self, entry: TimetableEntry, assignment: Dict) -> bool:
        """Check if entry is consistent with current assignment"""
        for assigned_entry in assignment.values():
            if not self._consistent(entry, assigned_entry, {}, {}):
                return False
        return True
    
    def _forward_check(self, domains: Dict, assigned_course_id: str, 
                      assigned_entry: TimetableEntry, assignment: Dict) -> Dict:
        """Forward checking: remove inconsistent values from domains"""
        old_domains = {}
        
        for course_id, domain in domains.items():
            if course_id not in assignment and course_id != assigned_course_id:
                old_domains[course_id] = domain.copy()
                domains[course_id] = [entry for entry in domain 
                                    if self._consistent(assigned_entry, entry, {}, {})]
        
        return old_domains

class TimetableGenerator:
    """Main timetable generator that orchestrates different algorithms"""
    
    def __init__(self):
        self.constraints = TimetableConstraints()
        self.generators = {
            AlgorithmType.GREEDY: GreedyTimetableGenerator(self.constraints),
            AlgorithmType.BACKTRACKING: BacktrackingTimetableGenerator(self.constraints),
            AlgorithmType.CONSTRAINT_SATISFACTION: CSPTimetableGenerator(self.constraints)
        }
    
    def generate_timetable(self, algorithm: AlgorithmType, courses: List[Course], 
                          faculty: List[Faculty], rooms: List[Room], 
                          time_slots: List[TimeSlot]) -> Dict:
        """Generate timetable using specified algorithm"""
        
        generator = self.generators[algorithm]
        
        try:
            schedule = generator.generate(courses, faculty, rooms, time_slots)
            
            # Calculate metrics
            metrics = self._calculate_metrics(schedule, courses, faculty)
            
            return {
                "success": True,
                "algorithm": algorithm.value,
                "schedule": [
                    {
                        "course_id": entry.course_id,
                        "faculty_id": entry.faculty_id,
                        "room_id": entry.room_id,
                        "time_slot_id": entry.time_slot_id,
                        "conflict_score": entry.conflict_score
                    }
                    for entry in schedule
                ],
                "metrics": metrics,
                "total_courses": len(courses),
                "scheduled_courses": len(schedule),
                "success_rate": len(schedule) / len(courses) if courses else 0
            }
        
        except Exception as e:
            return {
                "success": False,
                "algorithm": algorithm.value,
                "error": str(e),
                "schedule": [],
                "metrics": {},
                "total_courses": len(courses),
                "scheduled_courses": 0,
                "success_rate": 0
            }
    
    def _calculate_metrics(self, schedule: List[TimetableEntry], 
                          courses: List[Course], faculty: List[Faculty]) -> Dict:
        """Calculate timetable quality metrics"""
        
        if not schedule:
            return {}
        
        # Faculty workload distribution
        faculty_hours = {}
        for entry in schedule:
            faculty_hours[entry.faculty_id] = faculty_hours.get(entry.faculty_id, 0) + 1
        
        # Room utilization
        room_usage = {}
        for entry in schedule:
            room_usage[entry.room_id] = room_usage.get(entry.room_id, 0) + 1
        
        # Time slot distribution
        time_slot_usage = {}
        for entry in schedule:
            time_slot_usage[entry.time_slot_id] = time_slot_usage.get(entry.time_slot_id, 0) + 1
        
        return {
            "faculty_workload": {
                "average_hours": sum(faculty_hours.values()) / len(faculty_hours) if faculty_hours else 0,
                "max_hours": max(faculty_hours.values()) if faculty_hours else 0,
                "min_hours": min(faculty_hours.values()) if faculty_hours else 0,
                "workload_variance": self._calculate_variance(list(faculty_hours.values()))
            },
            "room_utilization": {
                "total_rooms_used": len(room_usage),
                "average_usage": sum(room_usage.values()) / len(room_usage) if room_usage else 0,
                "max_usage": max(room_usage.values()) if room_usage else 0
            },
            "time_distribution": {
                "total_slots_used": len(time_slot_usage),
                "average_classes_per_slot": sum(time_slot_usage.values()) / len(time_slot_usage) if time_slot_usage else 0
            },
            "overall_score": sum(entry.conflict_score for entry in schedule) / len(schedule) if schedule else 0
        }
    
    def _calculate_variance(self, values: List[float]) -> float:
        """Calculate variance of a list of values"""
        if not values:
            return 0
        mean = sum(values) / len(values)
        return sum((x - mean) ** 2 for x in values) / len(values)

# Example usage and testing
if __name__ == "__main__":
    # Create sample data for testing
    time_slots = [
        TimeSlot("ts1", 1, "09:00", "10:00", "Period 1"),
        TimeSlot("ts2", 1, "10:00", "11:00", "Period 2"),
        TimeSlot("ts3", 2, "09:00", "10:00", "Period 1"),
        TimeSlot("ts4", 2, "10:00", "11:00", "Period 2"),
    ]
    
    rooms = [
        Room("r1", "CS-101", 60, "lecture_hall", ["projector", "whiteboard"]),
        Room("r2", "CS-LAB1", 30, "computer_lab", ["computers", "projector"]),
    ]
    
    faculty = [
        Faculty("f1", "Dr. Alice", "dept1", 20, ["Programming"], {"ts1": 5, "ts2": 4, "ts3": 3}),
        Faculty("f2", "Dr. Bob", "dept1", 18, ["Database"], {"ts2": 5, "ts3": 4, "ts4": 3}),
    ]
    
    courses = [
        Course("c1", "CS101", "Programming", 4, 1, "theory", "f1", "lecture_hall", 50),
        Course("c2", "CS102", "Database", 3, 2, "theory", "f2", "lecture_hall", 40),
    ]
    
    # Test all algorithms
    generator = TimetableGenerator()
    
    for algorithm in AlgorithmType:
        print(f"\n=== Testing {algorithm.value.upper()} Algorithm ===")
        result = generator.generate_timetable(algorithm, courses, faculty, rooms, time_slots)
        print(json.dumps(result, indent=2))
