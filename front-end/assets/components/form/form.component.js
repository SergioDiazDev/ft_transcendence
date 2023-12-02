function createForm (typeForm, haveHeader) {
    /* CREATE STRUC */
    createElementClassId('main', 'conatiner container', 'main-container', null);
    createElementClassId('section', 'row', 'section' + "-" + typeForm, 'main-container');

    /* CREATE GRID */
    createElementClassId('section', 'col-sm-3', 'section-left', 'section' + "-" + typeForm);
    createElementClassId('section', 'mt-5 text-light col-sm-6', 'section-center', 'section' + "-" + typeForm);
    createElementClassId('section', 'col-sm-3', 'section-right', 'section' + "-" + typeForm);

    /* CREATE ELEMENT EMPTY*/
    createHeaders('h6', null, null, 'section-left', 'Empty');
    createHeaders('h6', null, null, 'section-right', 'Empty');

    /* CREATE LOGIN */
    if (haveHeader) {
        createHeaders('h1', null, null, 'section-center','Are you transcending?');
    }
    CreateFormContainer('form' + "-" + typeForm, 'post', '#', 'section-center');
}