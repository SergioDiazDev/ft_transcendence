function createElementSimple(type, idName, father) {
    const simple = {
        id: idName
    }
    createElement(type, simple, father);
}

function convertToSnakeCase(str) {
    return str.replace(/[A-Z]/g, function (letter) {
        return '-' + letter.toLowerCase();
    });
  }
  
  function convertToSnakeAltCaseAttributes(attributes) {
    const snakeCaseAttributes = {};
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            const snakeCaseKey = convertToSnakeCase(key);
            snakeCaseAttributes[snakeCaseKey] = attributes[key];
        }
    }
    return snakeCaseAttributes;
  }

  function createElementClassId(type, className, idName, father) {

    const element = {
        class: className,
        id: idName
    }
    createElement(type, element, father);
}


function createHeaders(type, className, idName, father, text, typeInput) {
    const h = {

    }
    if (idName) {
        h.id = idName
    }
    if (className) {
        h.class = className
    }
    if (typeInput) {
        h.type = typeInput
    }
    createElement(type, h, father, text);
}


function CreateFormContainer(idName, actionType, methodType, father) {
    if (!actionType || !methodType || !idName) {
        console.log('Error: Date empty');
    } else {
        const form = {
            action: actionType,
            method: methodType,
            id: idName
        }
        createElement('form', form, father);
    }
}

function createLabel(forId, className, idName, father,text) {
    const label = {
        for: forId,
        class: className,
        id: idName,
    }
    createElement('label', label, father, text);
}

function createInput(type, className, idName, father, text){
    const inputT = {
        type: type,
        class: className,
        id: idName,
        name: idName
    }
    createElement('input', inputT, father, text);
}