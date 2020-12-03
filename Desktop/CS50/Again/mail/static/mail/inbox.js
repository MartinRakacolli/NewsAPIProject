document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox.
  load_mailbox('inbox')

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#mail-view').value = "";

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').addEventListener('submit', send_email)

}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#mail-view').value = "";

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  var emails_view = document.querySelector('#emails-view');

  if(mailbox == "inbox") {
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      emails.forEach((email) => {

        var mail = document.createElement("div");
        var subject = document.createElement('h1');
        var sender = document.createElement('p');
        var timestamp = document.createElement('p');

        sender.innerHTML = "From: " + email['sender'];
        subject.innerHTML = "Subject: " + email['subject'];
        timestamp.innerHTML = "Time Received " + email['timestamp'];

        mail.appendChild(subject);
        mail.appendChild(sender);
        mail.appendChild(timestamp);

        mail.style.borderStyle = 'solid';
        mail.style.borderColor = 'black';
        mail.style.borderWidth = '5px';
        mail.style.cursor = 'pointer';
        if(email['read'] == true) {
          mail.style.backgroundColor = 'gray';
        } else {
          mail.style.backgroundColor = 'white';
        }

        mail.addEventListener('click', () => show_email(email['id'], mailbox));
        subject.addEventListener('click', () => show_email(email['id'], mailbox));
        sender.addEventListener('click', () => show_email(email['id'], mailbox));
        timestamp.addEventListener('click', () => show_email(email['id'], mailbox));

        emails_view.appendChild(mail);

      });

    });
  } else if (mailbox == "sent") {
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
      emails.forEach((email) => {

        var mail = document.createElement("div");
        var subject = document.createElement('h1');
        var sender = document.createElement('p');
        var timestamp = document.createElement('p');

        sender.innerHTML = "From: " + email['sender'];
        subject.innerHTML = "Subject: " + email['subject'];
        timestamp.innerHTML = "Time Received " + email['timestamp'];

        mail.appendChild(subject);
        mail.appendChild(sender);
        mail.appendChild(timestamp);

        mail.style.borderStyle = 'solid';
        mail.style.borderColor = 'black';
        mail.style.borderWidth = '5px';
        mail.style.cursor = 'pointer';
        if(email['read'] == true) {
          mail.style.backgroundColor = 'gray';
        } else {
          mail.style.backgroundColor = 'white';
        }

        mail.addEventListener('click', () => show_email(email['id'], mailbox));
        subject.addEventListener('click', () => show_email(email['id'], mailbox));
        sender.addEventListener('click', () => show_email(email['id'], mailbox));
        timestamp.addEventListener('click', () => show_email(email['id'], mailbox));

        emails_view.appendChild(mail);

      });

    });
  } else {
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
      emails.forEach((email) => {

        var mail = document.createElement("div");
        var subject = document.createElement('h1');
        var sender = document.createElement('p');
        var timestamp = document.createElement('p');

        sender.innerHTML = "From: " + email['sender'];
        subject.innerHTML = "Subject: " + email['subject'];
        timestamp.innerHTML = "Time Received " + email['timestamp'];

        mail.appendChild(subject);
        mail.appendChild(sender);
        mail.appendChild(timestamp);

        mail.style.borderStyle = 'solid';
        mail.style.borderColor = 'black';
        mail.style.borderWidth = '5px';
        mail.style.cursor = 'pointer';
        if(email['read'] == true) {
          mail.style.backgroundColor = 'gray';
        } else {
          mail.style.backgroundColor = 'white';
        }

        mail.addEventListener('click', () => show_email(email['id'], mailbox));
        subject.addEventListener('click', () => show_email(email['id'], mailbox));
        sender.addEventListener('click', () => show_email(email['id'], mailbox));
        timestamp.addEventListener('click', () => show_email(email['id'], mailbox));

        emails_view.appendChild(mail);

      });

    });
  }

}

function show_email(id_number, mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'block';

  document.querySelector('#mail-view').value = "";

  var mail_view = document.querySelector('#mail-view');

  while(mail_view.firstChild) {
    mail_view.removeChild(mail_view.firstChild);
  }

  var full_path = '/emails/' + id_number;

  fetch(full_path)
  .then(response => response.json())
  .then(email => {

      var subject = document.createElement('h1');
      var sender = document.createElement('p');
      var timestamp = document.createElement('p');
      var recipients = document.createElement('p');
      var body = document.createElement('p');
      var button = document.createElement("BUTTON");
      var replybutton = document.createElement("BUTTON");

      subject.innerHTML = email['subject'];
      sender.innerHTML = "From: " + email['sender'];
      recipients.innerHTML = "To: " + email['recipients'];
      body.innerHTML = email['body'];
      timestamp.innerHTML = "Sent at: " + email['timestamp'];
      replybutton.innerHTML = "Reply";
      replybutton.onclick = function() {
        reply_email(email);
      }

      if(mailbox == 'inbox') {
        button.innerHTML = "Archive";
        button.onclick = function() {
          fetch(full_path, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true
            })
          });

          load_mailbox("inbox");
        };

      } else if(mailbox == 'archive') {
        button.innerHTML = "Unarchive";
        button.onclick = function() {
          fetch(full_path, {
          method: 'PUT',
          body: JSON.stringify({
              archived: false
            })
          });

          load_mailbox("inbox");
        };

      } else {
        button.style.display = "none";
      }

      if(!mail_view.hasChildNodes()) {
        mail_view.appendChild(subject);
        mail_view.appendChild(sender);
        mail_view.appendChild(recipients);
        mail_view.appendChild(timestamp);
        mail_view.appendChild(body);
        mail_view.appendChild(button);
        mail_view.appendChild(replybutton);
      }

    });

  fetch(full_path, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
    })
  });

}

function reply_email(email) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#mail-view').value = "";

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = email['sender'];

  const regex = /^Re: /;
  if(email['subject'].match(regex)) {
    document.querySelector('#compose-subject').value = email['subject'];
  } else {
    document.querySelector('#compose-subject').value = "Re: " + email['subject'];
  }

  document.querySelector('#compose-body').value = 'On ' + email['timestamp'] + " " + email['sender'] + " wrote: \n\n" + email['body'];

  document.querySelector('#compose-form').addEventListener('submit', send_email);

}

function send_email() {
  event.preventDefault();
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      }),
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox('sent');
    });
  return false;
}
