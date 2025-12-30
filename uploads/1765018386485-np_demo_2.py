import numpy as np

list1 = [
        [1,2,3,4],
        [5,6,7,8],
        [9,10,11,12]
        ]

arr = np.array(list1)
print("Array:\n", arr)
print("Shape:", arr.shape)                        # Dimensions
print("Size:", arr.size)                          # Total elements
print("Number of Dimensions:", arr.ndim)          # Number of dimensions
print("Datatype:", arr.dtype)                     # Data type

# Reshaping
try:
    reshaped = arr.reshape(4, 4)
    print("\nReshaped (4x3):\n", reshaped)
   
except :
    print("Dimensions are not correct")
    
flattened = arr.flatten()
print("Flattened:", flattened)


