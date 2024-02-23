
const $root_element = document.querySelector("#root");


const $register_form = document.createElement("form");
const $name_text = document.createElement("input"),
    $enviar = document.createElement("input"),
    $email_register = document.createElement("input"),
    $password_register = document.createElement("input");
    
const $label_name = document.createElement("label"),
    $label_email = document.createElement("label"),
    $label_password = document.createElement("label");

$register_form.setAttribute("method", "post");
$register_form.setAttribute("action", "#");

$label_name.innerText = "Nombre: ";
$label_name.setAttribute("for", "name_register");
$name_text.setAttribute("type", "text");
$name_text.setAttribute("placeholder", "Rafael Higueron");
$name_text.setAttribute("id", "name_register");
$label_name.insertAdjacentElement("beforeend", $name_text);

$label_email.innerText = "Email: ";
$label_email.setAttribute("for", "email_register");
$email_register.setAttribute("type", "email");
$email_register.setAttribute("placeholder", "prueba@gmail.com");
$email_register.setAttribute("id", "email_register");
$label_email.insertAdjacentElement("beforeend", $email_register);

$label_password.innerText = "Password: ";
$label_password.setAttribute("for", "password_register");
$password_register.setAttribute("type", "password");
$password_register.setAttribute("placeholder", "123abc");
$password_register.setAttribute("id", "password_register");
$label_password.insertAdjacentElement("beforeend", $password_register);

$enviar.setAttribute("type", "submit");
$enviar.setAttribute("value", "Enviar");

$register_form.insertAdjacentElement("beforeend", $label_name);
$register_form.insertAdjacentElement("beforeend", $label_email);
$register_form.insertAdjacentElement("beforeend", $label_password);

$register_form.insertAdjacentElement("beforeend", $enviar);

$root_element.insertAdjacentElement("afterbegin", $register_form);

const checkCSRF = () => {
    const cookies = document.cookie;
    let cookies_split;
    let element = undefined;

    cookies_split = cookies.split(";");
    cookies_split = cookies_split.map(cookie => cookie.trim());
    element = cookies_split.find(cookie =>{
        const [key, value] = cookie.split("=");
        return (key === "csrftoken");
    });
    return (element != undefined) ? true : false;
}

const register_user = () => {
    const name = $name_text.value;
    const email = $email_register.value;
    const password = $password_register.value;

    const data =  {
        name,
        email,
        password,
    };
    
    const response = fetch("http://127.0.0.1:8000/accounts/register/",
        {
            method: "POST",
            mode: "cors",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
}

//Handle register form
$register_form.addEventListener("submit", (event) => {
    event.preventDefault();
    if(!checkCSRF())
    {       
        fetch("http://127.0.0.1:8000/token/csrf_token/", {
            method: "GET",
            mode: "cors",       
            credentials: "include",
        }
        ).then(res => res.json()).
        then(({token, expire}) => {
            const date = new Date();
            date.setTime(date.getTime() + (24*60*60*1000));
            document.cookie = "csrftoken=" + token + "; expires=" + date.toUTCString() +
            "; path=/; SameSite=None; Secure";
            return true;
        })
        .then(_ => {
            register_user();
        }); 
    }
    else
    {
        register_user();
    }
});