import networkx as nx
import matplotlib.pyplot as plt
import random
import threading
import time


class ClickableGraph:
    def __init__(self, points):
        self.points = points
        self.graph = self.create_graph()
        self.fig, self.ax = plt.subplots()
        self.pos = {i: self.random_position() for i in range(len(points))}
        self.draw_graph()
        self.sc = self.draw_nodes()
        self.edges = self.draw_edges()
        self.cid = self.fig.canvas.mpl_connect("pick_event", self.on_pick)

    def create_graph(self):
        G = nx.Graph()
        for i in range(len(self.points)):
            G.add_node(i)
        for i in range(len(self.points) - 1):
            for j in range(i + 1, len(self.points)):
                G.add_edge(i, j)
        return G

    def random_position(self):
        return random.uniform(0, 100), random.uniform(0, 100)

    def draw_graph(self):
        nx.draw(
            self.graph,
            pos=self.pos,
            ax=self.ax,
            with_labels=True,
            node_size=700,
            font_size=10,
            font_color="white",
        )

    def draw_nodes(self):
        sc = self.ax.scatter(
            [point[0] for point in self.pos.values()],
            [point[1] for point in self.pos.values()],
            s=700,
            picker=True,
        )
        return sc

    def draw_edges(self):
        edges = []
        for edge in self.graph.edges():
            x = [self.pos[edge[0]][0], self.pos[edge[1]][0]]
            y = [self.pos[edge[0]][1], self.pos[edge[1]][1]]
            line = self.ax.plot(x, y, color="blue")[0]
            edges.append(line)
        return edges

    def on_pick(self, event):
        ind = event.ind[0]
        threading.Timer(5, self.handle_click, args=[ind]).start()

    def handle_click(self, node_index):
        # Change label color to red
        self.sc.set_facecolor("blue")  # Set facecolor back to blue
        self.sc.set_array([1, 0])
        self.sc.set_offsets(self.sc.get_offsets())
        self.sc.get_paths()[node_index].set_color(
            "red"
        )  # Set the clicked node color to red
        self.fig.canvas.draw()
        plt.pause(0.1)  # Pause to allow the plot to update
        print(f"Clicked on node {node_index}")

    def show(self):
        plt.show()


# Sample array of points
points = ["toto", "tata"]

# Create and show the clickable graph
graph = ClickableGraph(points)
graph.show()
