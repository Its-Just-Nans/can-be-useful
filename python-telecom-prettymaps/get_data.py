import prettymaps
import os.path

mirroir = (48.712772, 2.201022)
mirroir = (48.712503, 2.204337)


def get_data(*args):
    i = args[0]
    file_name = str(i)+".png"
    if not os.path.isfile(file_name):
        g = prettymaps.plot(mirroir, credit=False, circle=True, radius=i)
        fig = g.fig
        print(file_name)
        fig.savefig(file_name, dpi=700)


if __name__ == "__main__":
    get_data(1200)
