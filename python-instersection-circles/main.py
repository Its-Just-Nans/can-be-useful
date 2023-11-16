""" Python program to find the intersection of two circles """
import math
from turtle import Screen, Turtle


# Function to draw a circle with a given radius
def draw_circle(radius):
    """draw_circle"""
    turtle.circle(radius)


# Function to draw a circle with a given center and radius
def draw_circle_at_point(x, y, radius):
    """draw_circle_at_point"""
    turtle.penup()
    turtle.goto(x, y - radius)
    turtle.pendown()
    draw_circle(radius)


# Function to draw the border of a circle
def draw_circle_border(radius):
    """draw_circle_border"""
    turtle.penup()
    turtle.goto(0, -radius)
    turtle.pendown()
    turtle.circle(radius, 360)


# Main function
def main():
    """main"""
    turtle.speed(math.inf)
    turtle.pensize(2)

    main_circle_radius = RADIUS
    draw_circle_border(main_circle_radius)


def circle_intersection(x1, y1, r1, x2, y2, r2):
    """calculate the intersection of two circles"""
    # Calculate the distance between the two centers
    d = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

    # Check for no intersection or one circle inside the other
    if d > r1 + r2 or d < abs(r1 - r2):
        return None, None  # No intersection

    # Check for concentric circles
    if d == 0 and r1 == r2:
        return (x2, y2), (x2, y2)  # infinite

    # Calculate the intersection points
    a = (r1**2 - r2**2 + d**2) / (2 * d)
    h = math.sqrt(r1**2 - a**2)

    x3 = x1 + a * (x2 - x1) / d
    y3 = y1 + a * (y2 - y1) / d

    # Calculate intersection points
    intersection1 = (x3 + h * (y2 - y1) / d, y3 - h * (x2 - x1) / d)
    intersection2 = (x3 - h * (y2 - y1) / d, y3 + h * (x2 - x1) / d)

    return intersection1, intersection2


def print_point(x, y, color):
    """print a point"""
    turtle.up()
    turtle.setpos(x, y)
    turtle.color(color)
    turtle.down()
    turtle.dot(20)
    draw_circle_at_point(x, y, 100)


RADIUS = 100


def on_mouse_click(x, y):
    """on_mouse_click"""
    a, b = circle_intersection(0, 0, RADIUS, x, y, RADIUS)
    if a is not None or b is not None:
        if a is not None:
            x1, y1 = a
        else:
            x1, y1 = b
        turtle.color("black")
        turtle.clear()
        draw_circle_border(RADIUS)
        print_point(x, y, "yellow")
        print_point(x1, y1, "red")


SCREEN = Screen()

turtle = Turtle()

if __name__ == "__main__":
    main()
    SCREEN.onscreenclick(on_mouse_click)
    SCREEN.mainloop()
