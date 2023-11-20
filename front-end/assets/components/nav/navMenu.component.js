
function displayNav() {
  const nav = {
    class: "navbar navbar-expand-lg navbar-dark bg-dark",
    id: "menu"
  };

  createElement("nav", nav, null);
}

function displayDivFluid() {
  const divFluid = {
    class: "container-fluid",
    id: "section-nav"
  };

  createElement("section", divFluid, "menu")
}

function displayAIndex(text) {
  const aIndex = {
    class: "navbar-brand",
    href: "#"
  };
  createElement("a", aIndex, "section-nav", text)
}

function displayAHome(text) {
  const aHome = {
    class: "btn btn-primary active border rouded-5",
    id: "home",
    href: "#"
  };
  createElement("a", aHome, "section-nav", text)
}

function displayAProfile(text) {
  const profile = {
    class: "btn btn-primary active border rouded-5",
    id: "profile",
    href: "#"
  }
  createElement("a", profile, "section-nav", text)
}

function displayIconUsers(text) {
  const iconUsers = {
    class: "nav-link",
    id: "icon-users",
    href: "#"
  }
  createElement("a", iconUsers, "section-nav", text)
}

function displayUserAccount(path, user, altImg) {
  const userAccount = {
    class: "btn btn-primary img-profile p-0",
    id: "user-account",
    href: "#"
  }
  const imgProfile = {
    class: "img-user",
    id: "img-profile",
    src: path,
    alt: altImg
  }
  const span = {
    class: "span-profile",
    id: "span-profile"
  }
  const spanImg = {
    class: "spanImg",
    id: "spanImg"
  }
  const picture = {
    class: "picture",
    id: "picture"
  }

  createElement("span", span, "section-nav")
  createElement("button", userAccount, span.id);
  createElement("picture", picture, userAccount.id);
  createElement("img", imgProfile, picture.id);
  createElement("span", spanImg, userAccount.id, user);
}

document.addEventListener('DOMContentLoaded', function () {
  displayNav();
  displayDivFluid();
  displayAIndex("ft_transcendence");
  displayAHome("Home");
  displayAProfile("profile");
  displayIconUsers("icon");
  displayUserAccount("./assets/img/LOGIN.svg", "Limones")
})