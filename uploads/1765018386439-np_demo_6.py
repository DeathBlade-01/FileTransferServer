import numpy as np

# Student scores in 5 subjects (rows=students, cols=subjects)
scores = np.array([
    [85, 90, 78, 92, 88],  # Student 1
    [76, 82, 85, 79, 91],  # Student 2
    [92, 88, 94, 90, 87],  # Student 3
    [68, 72, 70, 75, 73],  # Student 4
    [95, 93, 96, 94, 92]   # Student 5
])

print("Student Scores:\n", scores)

# Calculate average for each student
student_avg = np.mean(scores, axis=1)
print("\nAverage score per student:", student_avg)

# Calculate average for each subject
subject_avg = np.mean(scores, axis=0)
print("Average score per subject:", subject_avg)

# Find top performer
top_student = np.argmax(student_avg)
print(f"\nTop student: Student {top_student + 1} with average {student_avg[top_student]:.2f}")

# Find students who scored above 85 in all subjects
all_above_85 = np.all(scores > 85, axis=1)
print("Students with all scores > 85:", np.where(all_above_85)[0] + 1)

# Normalize scores to 0-100 scale (if needed)
normalized = (scores - np.min(scores)) / (np.max(scores) - np.min(scores)) * 100
print("\nNormalized scores:\n", normalized.astype(int))


