import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

# Element-wise operations

print("a:", a)
print("b:", b)

print("\na + b:", a + b)
print("a - b:", a - b)
print("a * b:", a * b)
print("a / b:", a / b)
print("a ** 2:", a ** 2)

# Broadcasting
arr = np.array([[1, 2, 3], [4, 5, 6]])

print("\nArray:\n", arr)
print("Array + 10:\n", arr + 10)  # Scalar broadcasted to all elements
print("Array * 2:\n", arr * 2)

# Mathematical functions
data = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("\nData:\n", data)
print("Sum of all elements:", np.sum(data))
print("Mean:", np.mean(data))
print("Standard deviation:", np.std(data))
print("Min:", np.min(data))
print("Max:", np.max(data))

# Operations along axis
print("\nSum along axis 0 (columns):", np.sum(data, axis=0))
print("Sum along axis 1 (rows):", np.sum(data, axis=1))
print("Mean along axis 0:", np.mean(data, axis=0))


