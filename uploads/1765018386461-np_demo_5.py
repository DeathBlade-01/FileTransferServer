import numpy as np


a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

# Concatenation
h_concat = np.hstack((a, b))  # Horizontal
v_concat = np.vstack((a, b))  # Vertical

print("Array a:\n", a)
print("Array b:\n", b)
print("\nHorizontal concatenation:\n", h_concat)
print("Vertical concatenation:\n", v_concat)

# Splitting
arr = np.arange(12).reshape(3, 4)
print("\nOriginal array:\n", arr)
h_split = np.hsplit(arr, 2)  # Split into 2 parts horizontally
print("Horizontal split:")
for i, part in enumerate(h_split):
    print(f"Part {i+1}:\n{part}")

# Copy vs View
original = np.array([1, 2, 3, 4, 5])
view = original[:]
copy = original.copy()

original[0] = 999
print("\nOriginal modified:", original)
print("View (affected):", view)
print("Copy (not affected):", copy)


