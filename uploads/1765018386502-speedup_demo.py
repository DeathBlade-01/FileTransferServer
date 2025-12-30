import numpy as np
import time
import sys


SIZE = 100_000_000 

list_data = list(range(SIZE))
list_squared = list()


start_time = time.time()

for i in list_data:
    list_squared.append(i * i)
end_time = time.time()


np_data = np.arange(SIZE)
np_sq = list()
start = time.time()

np_sq = np_data * np_data
end = time.time()


print(f'Time for LIST: {end_time-start_time}\nSize of LIST:{sys.getsizeof(list_squared)}')
print(f'Time for NUMPY: {end-start}\nSize of LIST:{sys.getsizeof(np_sq)}')

print(f'Difference in Memory = {  (sys.getsizeof(list_squared) - sys.getsizeof(np_sq) )  / sys.getsizeof(list_squared)*100}%')
