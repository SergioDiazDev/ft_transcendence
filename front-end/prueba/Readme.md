# FT_TRASCENDENCE
--------------

[//]: # (version: 1.0)
[//]: # (author: Jose Carlos Limones)
[//]: # (date: 2023-11-17)



# Tabla de contenidos
- [FT\_TRASCENDENCE](#ft_trascendence)
- [Tabla de contenidos](#tabla-de-contenidos)
  - [Introducción](#introducción)
  - [Guia Frontend](#guia-frontend)

<div style="page-break-after: always;"></div>




## Introducción
[Tabla de contenidos](#tabla-de-contenidos)


## Guia Frontend
[Tabla de contenidos](#tabla-de-contenidos)
- He creado una funcion para crear elementos html desde una clase de Javascript
Ejemplo de uso:
```js
document.addEventListener('DOMContentLoaded', function () {
const attributes = {
    class: "title",
    style: "color: red;",
    id: "mi-title"
    // Agrega más atributos según sea necesario
};
const customElement = new CustomElement('h1', 'titulo', attributes);
customElement.appendTo('container');
});
```

