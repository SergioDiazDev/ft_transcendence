class CustomElement {
    constructor(tagName, attributes) {
        this.element = document.createElement(tagName);

        if (attributes) {
            this.setAttributes(attributes);
        }
    }

    setAttributes(attributes) {
        for (const key in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, key)) {
                this.element.setAttribute(key, attributes[key]);
            }
        }
    }
    
    setTextContent(text) {
        this.element.textContent = text;
    }

    appendTo(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.appendChild(this.element);
        } else {
            console.error(`Container with ID '${containerId}' not found.`);
        }
    }
}

