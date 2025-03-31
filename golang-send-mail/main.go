package golangsendmail

import (
	"fmt"
	"io/ioutil"
	"net/smtp"
)

func main() {

	// Sender data.
	from := "from@domain.com"
	password := ""

	// Receiver email address.
	to := []string{
		// "example@domain.com",
	}

	// smtp server configuration.
	smtpHost := "smtp.domain.com"
	smtpPort := "587"
	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Sending email.
	subject := "Subject: Test email from Go!\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	body, erre := ioutil.ReadFile("./mail.html")
	if erre != nil {
		panic(erre)
	}
	msg := []byte(subject + mime + string(body))
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, msg)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Email Sent Successfully!")
}
