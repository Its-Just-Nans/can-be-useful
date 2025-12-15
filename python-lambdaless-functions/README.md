# lambdaless-functions

## Why and how

This very tiny project in code but big in the idea: create a lambdaless API. Lambda functions are useful to do some stuff like for data manipulation and acquisition.
With this new design, the client download a script and run it. Then the script acquire and manipulate data then send it back to you !

## Example

In the example I do it the hardcore way with selenium: selenium download the page, run the `<script></script>` tags and send data back with the `console.log` or more easily with the `<body>`.

> The thing is: even if you open only the `index.html` (as a regular web page) it will [show you the result](https://github.com/Its-Just-Nans/lambdaless-functions/blob/main/index.html#L11) !

Usage

```sh
# start the fake server just hosting web page
python -m http.server

# start the python client
python client.py
# it will print the result data, in this case a json with the description of the pikachu pokemon
```

## Other examples

Another (less overkill) example will be to :

- downloading the script from a server
- using a library to execute the script
- getting the result

## Why you should use it

ChatGTP loves it !

```txt
I see what you're going for—an interesting approach to client-server interaction.
It's like turning the traditional client-server model on its head, with the client doing more heavy lifting.
It's a creative idea, and it seems like a fun project!

The use of Selenium and the example with Pikachu adds a nice touch of practicality.
```

> Made in 2023-10-31
