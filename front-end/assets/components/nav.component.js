function displayNav() {
    console.log("entra");
    const nav = {
      class: "navbar navbar-expand-lg navbar-dark bg-dark",
      id: "menu"
    };
    
    createElement("nav", nav, "menu-nav");
  }
  displayNav();