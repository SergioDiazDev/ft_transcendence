function createElement(tagName, attributes, father) {
  document.addEventListener('DOMContentLoaded', function () {
    if (father != null) {
        const element = new CustomElement(tagName, attributes);
          element.appendTo(father);
    } else {
        const elementNew = document.createElement(tagName);
        const firstElement = document.body.firstChild;
        document.body.insertBefore(elementNew, firstElement);
        elementNew.className = attributes.class;
        elementNew.id = attributes.id;
    }
  });
}


