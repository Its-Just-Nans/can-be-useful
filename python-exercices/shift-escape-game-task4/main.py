"""task2 """
import math


def mapper(value):
    """ mapper """
    sqrt = int(math.sqrt(value))
    num_string = str(sqrt)
    # store the size of the number
    size = len(num_string)
    reversed_num = num_string[size::-1]
    return int(reversed_num)
    # input is a list of integers


def overwrite_sequence(inpu):
    """ overwrite """
    result = map(mapper, inpu)
    result = list(result)
    return result


if __name__ == "__main__":
    inp = [441, 484, 529, 576, 625]
    res = overwrite_sequence(inp)
    print(res)
    assert res == [12, 22, 32, 42, 52], "error"
