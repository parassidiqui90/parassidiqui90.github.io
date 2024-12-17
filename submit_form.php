<?php
if($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    $to = 'parissiddiqui@gmail.com';
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain;charset=utf-8\r\n";

    $body = "You have received a new message from $name ($email):\n\n$message";

    // Send the email
    if(mail($to, $subject, $body, $headers)) {
        echo "Thank you for contacting us, $name. We will get back to you soon!";
    } else {
        echo "Sorry, something went wrong. Please try again.";
    }
} else {
    // Not a POST request
    echo "This page is meant for form submissions only.";
}
?>
