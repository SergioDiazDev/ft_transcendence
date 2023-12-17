/**
 * 
 * @param {*} typeForm 
 * create fieldset
 * create input email with id email
 * create input username with id username-logup
 * create input password with id password-logup
 * create input confirm password with id confirm-password-logup
 * 
 */
function createLogUp(typeForm) {
    let subName = "-" + typeForm
    createForm(typeForm, true);
    createElementSimple('fieldset', 'fieldset' + subName, 'form' + subName);    

    createContainerInputForm(subName, 'article','row ps-3 pe-3 mt-3', 'email','section','col', 'fieldset' + subName)
    createLabel('email', 'form-label', 'label-email' + subName, 'section-email' + subName, 'Email address');
    createInput('email', 'form-control', 'email', 'section-email' + subName);

    createContainerInputForm(subName, 'article','row ps-3 pe-3 mt-3', 'username','section','col', 'fieldset' + subName)
    createLabel('username' + subName, 'form-label', 'label-username' + subName, 'section-username' + subName, 'Username');
    createInput('text', 'form-control', 'username' + subName, 'section-username' + subName);    

    createContainerInputForm(subName, 'article','row ps-3 pe-3 mt-3', 'password','section','col', 'fieldset' + subName)
    createLabel('password' + subName, 'form-label', 'label-password' + subName, 'section-password' + subName, 'Password');
    createInput('password', 'form-control', 'password' + subName, 'section-password' + subName);

    createContainerInputForm(subName, 'article','row ps-3 pe-3 mt-3', 'confirm-password','section','col', 'fieldset' + subName)
    createLabel('confirm-password' + subName, 'form-label', 'label-confirm-password' + subName, 'section-confirm-password' + subName, 'Confirm password');
    createInput('password', 'form-control', 'confirm-password' + subName, 'section-confirm-password' + subName);
    
    createElementClassId('article', 'row m-3', 'article-btn' + subName, 'fieldset' + subName)
    createButton('submit', 'btn-purple fw-bold p-1 rounded-5', 'btn-' + subName, 'article-btn' + subName, 'Create an account');

    createElementSimple('section', 'section-bottom', 'section-center');
    createHeaders('p', 'text-light p' + subName, null, 'section-bottom', 'Already have an account?')
    createLink('#', 'mb-5 text-decoration-none a' + subName, 'a' + subName, 'section-bottom', 'Login')

}