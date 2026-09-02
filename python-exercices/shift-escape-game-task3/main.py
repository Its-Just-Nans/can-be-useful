""" task3 """
import pandas
import networkx as nx
# import matplotlib.pyplot as plt


def find_main_fraudster(csv):
    """ detect fauder """
    data_f = pandas.read_csv(csv)
    # we remove bad data
    data_f = data_f.drop(data_f[data_f.Seller_ID == data_f.Buyer_ID].index)

    # we get the largest group
    graph = nx.from_pandas_edgelist(
        data_f, source='Seller_ID', target='Buyer_ID', edge_attr=True)
    sub_graphs = nx.connected_components(graph)
    groups_graph = {}
    max_ind = float('-inf')
    max_num = 0
    for ind, one in enumerate(sub_graphs):
        groups_graph[ind] = one
        long = len(one)
        if long > max_num:
            max_num = long
            max_ind = ind

    # nx.draw(graph, with_labels=True)
    # plt.show()

    # we have now the longest group at groups_graph[max_ind]
    # we calculated the highest amount
    obj = {}
    for index in data_f.index:
        id_seller = data_f.at[index, "Seller_ID"]
        id_buyer = data_f.at[index, "Buyer_ID"]
        money = data_f.at[index, "Tran_PR"]
        if id_seller in obj:
            obj[id_seller] = obj[id_seller] + money
        else:
            obj[id_seller] = + money
        if id_buyer in obj:
            obj[id_buyer] = obj[id_buyer] - money
        else:
            obj[id_buyer] = - money
    # we now found the highest paid amount
    max_val = float('-inf')
    id_found = 0
    for one_id_of_group in groups_graph[max_ind]:
        long = obj[one_id_of_group]
        if long > max_val:
            max_val = long
            id_found = one_id_of_group
    return id_found


if __name__ == "__main__":
    id_founded = find_main_fraudster(csv="data.csv")
    print(id_founded)
