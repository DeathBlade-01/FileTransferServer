import numpy as np

arr = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
print("Original array:\n", arr)

# Basic indexing
print("\nElement at [1, 2]:", arr)
print("First row:", arr)
print("Last column:", arr)

# Slicing
print("\nFirst 2 rows, first 3 columns:\n",arr )
print("Every other row:\n",arr )

# Boolean indexing
bool_idx = arr > 6
print("\nBoolean mask (elements > 6):\n", bool_idx)
print("Elements > 6:", arr[bool_idx])

# Fancy indexing
# rows = np.array([0, 2])
# cols = np.array([1, 3])

rows = [0, 2]
cols = [1, 3]
print("\nFancy indexing - rows [0,2], cols [1,3]:", arr[rows, cols])


