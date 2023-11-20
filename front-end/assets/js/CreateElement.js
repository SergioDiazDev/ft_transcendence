function createElement(tagName, attributes, father, text) {
    if (father != null) {
        const element = new CustomElement(tagName, attributes);
          element.appendTo(father);
          if (text) {
            element.setTextContent(text);
        }
    } else {
        const elementNew = document.createElement(tagName);
        const firstElement = document.body.firstChild;
        document.body.insertBefore(elementNew, firstElement);
        elementNew.className = attributes.class;
        elementNew.id = attributes.id;
        if (text) {
          element.setTextContent(text);
      }
    }
}


