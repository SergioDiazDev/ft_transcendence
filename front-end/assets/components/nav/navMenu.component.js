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
    id: "navTo",
    dataBsToogle: "collapse",
    dataBsTarget: "navbarNavAltMarkup",
    ariaControls: "navbarNavAltMarkup",
    ariaExpanded: "false",
    ariaLabel: "Toogle navigation",
  }
  const span = {
    class: "navbar-toggler-icon"
  }
  createElement("button", button, "article-nav")
  createElement("span", span, button.id)
}


/* HOME, PROFILE... */

function displaySectionNav() {
  const section = {
    class: "collapse navbar-collapse",
    id: "navbarNavAltMarkup",
  }
  createElement("section", section, "article-nav");
}

function displayAHome(text) {
  const aHome = {
    class: "nav-link btn ms-4 me-3",
    id: "home",
    href: "#"
  };
  const p = {

  }

  createElement("a", aHome, "navbarNavAltMarkup")
  createElement("p", p, aHome.id, text)
}

function displayAProfile(text) {
  const profile = {
    class: "nav-link btn",
    id: "profile",
    href: "#"
  }
  const p = {

  }
  createElement("a", profile, "navbarNavAltMarkup")
  createElement("p", p, profile.id, text)
}


function displayIconUsers() {

  const iconUsers = {
    class: "nav-link btn",
    id: "icon-users",
    src: "./assets/img//Users.png",
    href: "#"
  }
  createElement("img", iconUsers, "navbarNavAltMarkup")
}
/************************************** */

function displayUserAccount(path, user, altImg) {
  const spanProfile = {
      class: "span-profile pe-3 position-absolute me-2 end-0",
      id: "span-profile",
      href: "#"
  }

  const userAccount = {
    class: "img-profile p-0 text-decoration-none",
    id: "user-account",
    href: "#"
  }
  const picture = {
    class: "picture",
    id: "picture"
  }
  const imgProfile = {
    class: "img-user",
    id: "img-user",
    src: path,
    alt: altImg
  }
  const span = {
    class: "span-profile",
    id: "span-profile"
  }
  const spanImg = {
    class: "span-img d-inline-block",
    id: "span-img"
  }
 

  createElement("span", spanProfile, "navbarNavAltMarkup")
  createElement("a", span, "navbarNavAltMarkup")
  createElement("a", userAccount, span.id);
  createElement("picture", picture, userAccount.id);
  createElement("img", imgProfile, picture.id);
  createElement("span", spanImg, userAccount.id, user);
}

document.addEventListener('DOMContentLoaded', function () {
  displayNav();
  displayArticleFluid();
  displayAIndex("ft_transcendence");
  displayButtonMenu();
  displaySectionNav();
  displayAHome("home");
  displayAProfile("profile");
  displayIconUsers();
  displayUserAccount("./assets/img/icon1.png", "limones")
})