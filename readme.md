# Lenguaje 5

<!-- Breve descripción del proyecto -->
Aplicación móvil híbrida desarrollada con Ionic y Angular para gestionar y organizar objetos (cosas), permitiendo clasificarlos por contenedores, habitaciones y etiquetas. Utiliza Firebase para la autenticación y el almacenamiento de datos en Firestore.

## Tabla de Contenidos

- [Nombre de Tu Proyecto](#nombre-de-tu-proyecto)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Acerca del Proyecto](#acerca-del-proyecto)
  - [Características Principales](#características-principales)
  - [Comenzando](#comenzando)
    - [Prerrequisitos](#prerrequisitos)
    - [Configuración de Firebase](#configuración-de-firebase)
    - [Instalación](#instalación)
  - [Uso](#uso)
    - [Servidor de Desarrollo](#servidor-de-desarrollo)
    - [Construcción para Producción](#construcción-para-producción)
  - [Estructura del Proyecto (Fragmentos Relevantes)](#estructura-del-proyecto-fragmentos-relevantes)
  - [Tecnologías Utilizadas](#tecnologías-utilizadas)
  - [Despliegue](#despliegue)
  - [Licencia](#licencia)

## Acerca del Proyecto

Este proyecto es una aplicación construida con el framework Ionic y Angular, diseñada para ayudar a los usuarios a llevar un registro de sus pertenencias. Permite agregar, editar y visualizar "cosas", asignándoles detalles como nombre, descripción, dónde se encuentran (contenedor, habitación) y etiquetas para una fácil categorización y búsqueda.

La persistencia de datos y la autenticación de usuarios (implícita por el uso de `provideAuth`) se gestionan a través de Firebase (Firestore).

## Características Principales

*   **Gestión de "Cosas":** Crear, editar y (presumiblemente) listar y eliminar objetos.
*   **Formularios Detallados:** Formularios para ingresar nombre, descripción.
*   **Clasificación Jerárquica/Relacional:**
    *   Asignación a **Contenedores**.
    *   Asignación a **Habitaciones**.
*   **Etiquetado:** Asignación de múltiples **Etiquetas** (`Tags`) para una organización flexible. La interfaz `Tag` (`tags.ts`) define la estructura de una etiqueta con `id`, `name` y `userId`.
*   **Integración con Firebase:**
    *   Uso de **Firestore** para el almacenamiento de datos (`provideFirestore`).
    *   Uso de **Firebase Authentication** para la gestión de usuarios (`provideAuth`).
*   **Interfaz de Usuario Ionic:** Componentes visuales estándar de Ionic para una experiencia de usuario nativa en múltiples plataformas.

## Comenzando

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

*   Node.js (versión LTS recomendada)
*   NPM (viene con Node.js)
*   Ionic CLI:
    ```sh
    npm install -g @ionic/cli
    ```
*   Firebase CLI (para despliegue y gestión del proyecto Firebase):
    ```sh
    npm install -g firebase-tools
    ```

### Configuración de Firebase

El proyecto ya está configurado para conectarse a un proyecto de Firebase con `projectId: "lenguaje5-6dbc2"` como se ve en `app.module.ts`.

Si deseas conectarlo a tu propio proyecto de Firebase:

1.  Crea un proyecto en la [Consola de Firebase](https://console.firebase.google.com/).
2.  Registra tu aplicación web en el proyecto de Firebase para obtener las credenciales de configuración.
3.  Actualiza el objeto de configuración en `app.module.ts` dentro de `provideFirebaseApp(() => initializeApp({ ... }))` con tus propias credenciales.
    ```typescript
    // app.module.ts
    // ...
    provideFirebaseApp(() => initializeApp({
      projectId: "TU_PROJECT_ID",
      appId: "TU_APP_ID",
      storageBucket: "TU_STORAGE_BUCKET",
      apiKey: "TU_API_KEY",
      authDomain: "TU_AUTH_DOMAIN",
      messagingSenderId: "TU_MESSAGING_SENDER_ID"
    })),
    // ...
    ```
4.  Configura las reglas de seguridad para Firestore y Authentication según las necesidades de tu aplicación.

### Instalación

1.  Clona el repositorio (si aplica):
    ```sh
    git clone https://URL_DEL_REPOSITORIO.git
    cd NOMBRE_DEL_PROYECTO
    ```
2.  Instala las dependencias:
    ```sh
    npm install
    ```

## Uso

### Servidor de Desarrollo

Para ejecutar la aplicación en un entorno de desarrollo local:

```sh
ionic serve
```
```


Esto generalmente abrirá la aplicación en `http://localhost:8100`.

### Construcción para Producción

Para compilar la aplicación para producción:

```textmate
ionic build --prod
```


Los archivos resultantes se encontrarán en la carpeta `www` (o la que esté configurada).

## Estructura del Proyecto (Fragmentos Relevantes)

*   `app.module.ts`: Módulo principal de Angular. Aquí se inicializa Firebase (`provideFirebaseApp`, `provideAuth`, `provideFirestore`) y se importan los módulos esenciales de Ionic y Angular.
*   `thing-form.component.html`: Plantilla HTML para el formulario de creación/edición de "Cosas". Utiliza `ion-input`, `ion-textarea`, `ion-select` para la entrada de datos y se vincula a un `FormGroup` de Angular. Permite seleccionar contenedores, habitaciones y múltiples etiquetas (`tags$ | async`).
*   `tags.ts`: Define la interfaz `Tag` con `id`, `name`, y `userId`, indicando que las etiquetas están asociadas a usuarios.
*   `folder.page.html` y `folder.module.ts`: Representan una página genérica de "carpeta" en Ionic, que podría ser la base para listar diferentes tipos de contenido.

## Tecnologías Utilizadas

*   [Ionic Framework](https://ionicframework.com/) (con Angular)
*   [Angular](https://angular.io/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Firebase](https://firebase.google.com/)
  *   Firebase Authentication
  *   Firestore
*   RxJS (implícito por el uso de `async` pipe con observables como `containers$`, `rooms$`, `tags$`)

## Despliegue

Puedes desplegar esta aplicación como una Progressive Web App (PWA) en Firebase Hosting:

1.  Asegúrate de haber instalado `firebase-tools` y haber iniciado sesión (`firebase login`).
2.  Construye tu aplicación para producción:
```textmate
ionic build --prod
```

3.  Inicializa Firebase Hosting en tu proyecto (si aún no lo has hecho):
```textmate
firebase init hosting
```

    *   Selecciona tu proyecto de Firebase.
    *   Indica `www` (o tu directorio de salida) como el directorio público.
    *   Configura como una aplicación de una sola página (SPA): Sí.
4.  Despliega la aplicación:
```textmate
firebase deploy
```
