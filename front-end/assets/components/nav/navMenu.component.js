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
    dataBsToggle: "collapse",
    dataBsTarget: "#navbarNavAltMarkup",
    ariaControls: "navbarNavAltMarkup",
    ariaExpanded: "false",
    ariaLabel: "Toogle navigation",
    id: "navButton",
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

  createElement("a", aHome, "navbarNavAltMarkup")
  createElement("p", null, aHome.id, text)
}

function displayAProfile(text) {
  const profile = {
    class: "nav-link btn",
    id: "profile",
    href: "#"
  }
  createElement("a", profile, "navbarNavAltMarkup");
  createElement("p", null, profile.id, text);
};


function displayIconUsers() {

  const iconLink = {
    class: "nav-link btn ",
    id: "icon-users",
    href: "#",
    
  }

  const iconImg = {
    src: "./assets/img//Users.png",
    alt: "Icon users"
  }
  createElement("a", iconLink, "navbarNavAltMarkup")
  createElement("img", iconImg, "icon-users");
}
/************************************** */

function displayUserAccount(path, user, altImg) {
  const spanProfile = {
      class: "span-profile pe-3 position-absolute me-2 end-0",
      id: "span-profile"
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
  const spanImg = {
    class: "span-img d-inline-block",
    id: "span-img"
  }
 

  createElement("span", spanProfile, "navbarNavAltMarkup")
  createElement("a", userAccount, spanProfile.id);
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