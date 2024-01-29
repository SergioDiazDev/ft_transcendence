function changeBgBody(background) {
  var body = document.body;
  if (background == 'profile') {
    body.style.backgroundImage = 'url(assets/img/profile.png)';
  } else {
    body.style.backgroundImage = 'url(assets/img/../img/LOGIN.svg)';
  }
}