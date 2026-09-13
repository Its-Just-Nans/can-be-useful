"""
Python script to check certificates validity of websites
"""
import sys
from datetime import datetime, timedelta
from ssl import SSLContext, DER_cert_to_PEM_cert, PROTOCOL_SSLv23
from socket import create_connection
from json import load, JSONDecodeError
from OpenSSL.crypto import load_certificate, FILETYPE_PEM  # pyopenssl

FILENAME = "list.json"
try:
    with open(FILENAME, encoding="utf-8") as file:
        website_list = load(file)
except FileNotFoundError:
    print(f"Error: {FILENAME}  not found")
    sys.exit(1)
except JSONDecodeError as e:
    print(f"Error: {FILENAME} not valid")
    sys.exit(1)
PORT = 443

for site in website_list:
    conn = create_connection((site, PORT))
    context = SSLContext(PROTOCOL_SSLv23)
    sock = context.wrap_socket(conn, server_hostname=site)
    CERT = DER_cert_to_PEM_cert(sock.getpeercert(True))
    x509 = load_certificate(FILETYPE_PEM, CERT)
    end = x509.get_notAfter()
    start = x509.get_notBefore()
    cert_start = datetime.strptime(start.decode('utf-8'), '%Y%m%d%H%M%SZ')
    cert_end = datetime.strptime(end.decode('utf-8'), '%Y%m%d%H%M%SZ')
    now = datetime.now()
    in_three_days = now + timedelta(days=3)

    if in_three_days < cert_end:
        # print("OK : " + site, end="")
        # print(str(cert_start) + " " + str(cert_end))
        pass
    else:
        print("ERROR : " + site, end=" -> ")
        print(str(cert_start) + " " + str(cert_end))
