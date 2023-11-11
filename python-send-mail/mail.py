""" basic mail in python """
import smtplib
import ssl
from os.path import basename
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

server_addr = ""
port = ""
sender_email = ""
receiver_email = ""
password = ""

message = MIMEMultipart("alternative")
message["Subject"] = "auto mail"
message["From"] = sender_email
message["To"] = receiver_email

# Create the plain-text and HTML version of your message
text = """\
Hi,
How are you?"""
html = """\
<html>
  <body>
    <p>Hi</p>
    <br>
  </body>
</html>
"""

# Turn these into plain/html MIMEText objects
part1 = MIMEText(text, "plain")
part2 = MIMEText(html, "html")

# Add HTML/plain-text parts to MIMEMultipart message
# The email client will try to render the last part first
message.attach(part1)
message.attach(part2)


files = ["logo.png"]

for f in files or []:
    with open(f, "rb") as fil:
        part = MIMEApplication(fil.read(), Name=basename(f))
    # After the file is closed
    part["Content-Disposition"] = 'attachment; filename="%s"' % basename(f)
    message.attach(part)

# Create secure connection with server and send email
context = ssl.create_default_context()
with smtplib.SMTP_SSL(server_addr, port, context=context) as server:
    server.login(sender_email, password)
    server.sendmail(sender_email, receiver_email, message.as_string())
