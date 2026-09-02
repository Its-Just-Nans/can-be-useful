""" exo 2 """
import pandas as pd


def find_recurrence(list_month):
    """ find recurrence """
    # SORT
    list_month = list(set(list_month))
    list_month.sort()
    total_len = len(list_month)
    if total_len > 3:
        obj = {}
        for index in range(total_len):
            if index+1 == total_len:
                break
            new_array = list_month[index+1:]
            first_month = list_month[index]
            for one_month in new_array:
                duration = one_month - first_month
                next_one = one_month + duration
                if next_one in new_array:
                    obj[duration] = 1
        if len(obj.values()) != 0:
            return True
    return False


def detect_reccurence(csv_file):
    """ detect reccurence """
    temp: pd.DataFrame = pd.read_csv(csv_file)
    list_of_ids = []
    for current_id, one_groupe in temp.groupby("Send_ID"):
        months = list(one_groupe["Tran_DA"])
        months_list = map(lambda x: int(
            x.split("/")[0]) + int(x.split("/")[1]) * 12, months)
        if find_recurrence(list(months_list)):
            list_of_ids.append(current_id)
    return list_of_ids


if __name__ == "__main__":
    SOLUTION = [16235167, 48644524, 68362850,
                96877928, 98578956, 35673565]
    SOLUTION.sort()
    check = detect_reccurence(csv_file="data.csv")
    check.sort()
    print(check)
    assert SOLUTION == check, "Error"
