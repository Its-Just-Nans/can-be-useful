""" gen map """
from get_data import get_data
import multiprocessing as mp

pool = mp.Pool(mp.cpu_count()-1)
print(mp.cpu_count())


for i in reversed(range(20, 2001, 50)):
    pool.apply_async(get_data, args=(i,))
pool.close()
pool.join()
