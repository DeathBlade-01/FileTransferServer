import numpy as np

list1 = [1,2,3,4,5]
list2 =[ [6,7,8] , [9,10,11] ]


print("1D Array from list:", arr1)
print("2D Array from list:\n", arr2d)

# Special arrays
zeros = np.zeros((3, 4))  # 3x4 array of zeros
ones = np.ones((2, 3))    # 2x3 array of ones
full = np.full((2, 2), 7) # 2x2 array filled with 7
identity = np.eye(3)       # 3x3 identity matrix
print("\nZeros array:\n", zeros)
print("Ones array:\n", ones)
print("Full array:\n", full)
print("Identity matrix:\n", identity)

# Range functions
# arange_arr = 
# linspace_arr = 

print("\nArange (0 to 10, step 2):", arange_arr)
print("Linspace (0 to 1, 5 points):", linspace_arr)

# Random arrays
# random_arr =
# random_int =

print("\nRandom array (0-1):\n", random_arr)
print("Random integers (1-100):\n", random_int)


