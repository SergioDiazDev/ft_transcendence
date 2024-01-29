function applyAttributes(element, attributes) {
  for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
          element.setAttribute(key, attributes[key]);
      }
  }
}

function createElement(tagName, attributes, father, text) {
  if (father != null) {
      const element = new CustomElement(tagName, convertToSnakeAltCaseAttributes(attributes));
      element.appendTo(father);
      if (text) {
          element.setTextContent(text);
      }
  } else {
      const elementNew = document.createElement(tagName);
      const firstElement = document.body.firstChild;
      document.body.insertBefore(elementNew, firstElement);
      applyAttributes(elementNew, convertToSnakeAltCaseAttributes(attributes));
      if (text) {
          elementNew.textContent = text;
      }
  }
}



