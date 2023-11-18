function createElement(tagName, attributes, father) {
  document.addEventListener('DOMContentLoaded', function () {
      const element = new CustomElement(tagName, attributes);
      element.appendTo(father);
  });
}


