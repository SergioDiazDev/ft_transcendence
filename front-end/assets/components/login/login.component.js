const fieldsLogin = {
    username: 'username',
    password: 'password',
}

function createContainerInputForm(subName, tagName ,classNameArticle, idNameInput, tagName2, classNameSection, father, typeT) {
    createElementClassId(tagName, classNameArticle, tagName + '-' + idNameInput + subName, father, typeT);
    createElementClassId(tagName2, classNameSection, tagName2 + '-' + idNameInput + subName, tagName + '-' + idNameInput + subName);
}

function createLink(hrefL , className, idName, father, text) {
    const link = {
        href: hrefL,
        class: className,
        id: idName,
    }
    createElement('a', link, father, text);
}

function createButton(typeT, className, idName, father, text) {
    const button = {
        class: className,
        id: idName,
        name: idName,
        type: typeT
    }
    createElement('button', button, father, text);
}

function createLogin(typeForm, father) {
    createForm(typeForm);
    let subName = "-" + typeForm;
    createElementSimple('fieldset', 'fieldset' + subName, 'form' + subName);    
    /* CREATE USERNAME */
    createContainerInputForm(subName, 'article','row ps-3 pe-3 mt-3', 'username','section','col', 'fieldset' + subName)
    createLabel(fieldsLogin.username, 'form-label', 'label-username' + subName, 'section-username' + subName, 'Username or email');
    createInput('text', 'form-control', fieldsLogin.username, 'section-username' + subName);
    
    /* CREATE PASSWORD */
    createElementClassId('article', 'row ps-3 pe-3 mt-2 ', 'article-password' + subName, 'fieldset' + subName);
    createElementClassId('section', 'col', 'section-password' + subName, 'article-password' + subName);
    createLabel(fieldsLogin.password, 'form-label', 'label-password' + subName, 'section-password' + subName, 'Password');
    createLink('#', 'float-end text-decoration-none', 'a-forgot-password', 'section-password' + subName, 'Forgot your passpword?');
    createInput('password', 'form-control', fieldsLogin.password, 'section-password' + subName);
    /* CREATE BUTTON */
    createElementClassId('article', 'row m-3', 'article-btn' + subName, 'fieldset' + subName)
    createButton('submit', 'btn-purple fw-bold p-1 rounded-5', 'btn-' + subName, 'article-btn' + subName, 'Login');

}