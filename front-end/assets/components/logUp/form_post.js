document.getElementById("form-logup").addEventListener("submit", function (event) {
  event.preventDefault();
  var email = document.getElementById("email").value;
  var username = document.getElementById("username-logup").value;
  var pass = document.getElementById("password-logup").value;
  var confirm_pass = document.getElementById("confirm-password-logup").value;

  user = {
    'email': email,
    'username': username,
    'pass': pass,
  }
  const r = new Request(`${window.location.protocol}//${window.location.host.replace(":5500", ":8000")}/accounts/register/`, user);
  const res = r.post();

  res.then(res => res.text())
    .then(data => console.log(data));
});