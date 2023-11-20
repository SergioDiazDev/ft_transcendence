function displayNav() {
  const nav = {
    class: "navbar navbar-expand-lg navbar-dark ",
    id: "menu"
  };

  createElement("nav", nav, null);
}

/* ARTICLE */
function displayArticleFluid() {
  const divFluid = {
    class: "container-fluid",
    id: "article-nav"
  };

  createElement("article", divFluid, "menu")
}

/* FT_TRANSCENDENCE */

function displayAIndex(text) {
  const aIndex = {
    class: "navbar-brand",
    href: "#"
  };
  createElement("a", aIndex, "article-nav", text)
}

/* BUTTON MENU RESPONSIVE */
function displayButtonMenu() {
  const button = {
    class: "navbar-toggler",
    type: "button",
    dataBsToogle: "collapse",
  }
  createElement("button", button, "article-nav")
}

function displayAHome(text) {
  const aHome = {
    class: "btn btn-primary active border rouded-5",
    id: "home",
    href: "#"
  };
  createElement("a", aHome, "article-nav", text)
}

function displayAProfile(text) {
  const profile = {
    class: "btn btn-primary active border rouded-5",
    id: "profile",
    href: "#"
  }
  createElement("a", profile, "article-nav", text)
}

function displayIconUsers(text) {
  const iconUsers = {
    class: "nav-link",
    id: "icon-users",
    href: "#"
  }
  createElement("a", iconUsers, "article-nav", text)
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
  displayArticleFluid();
  displayAIndex("ft_transcendence");
  displayButtonMenu();
  // displayAHome("Home");
  // displayAProfile("profile");
  // displayIconUsers("icon");
  // displayUserAccount("./assets/img/LOGIN.svg", "Limones")
})