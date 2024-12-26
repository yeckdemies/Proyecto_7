# Proyecto para la Gestión de Eventos
Este es un proyecto de una API para la gestión de eventos en el que se pueden administrar usuarios con diferentes roles, admin y user, la gestión de los eventos y la gestión de las inscripciones.

## Librerías necesarias
- Node.js (versión v20.11.0)
- MongoDB
- npm (gestor de paquetes de Node.js)

## Instalación
1. Clona el repositorio:
    ```sh
    git clone https://github.com/yeckdemies/Proyecto_7.git
    ```
2. Navega al directorio del proyecto:
    ```sh
    cd Proyecto_7
    ```
3. Instala las dependencias:
    ```sh
    npm install
    ```

## Carga inicial de datos
1. Navega al directorio seeds
    ```sh
    cd Proyecto_7/src/utils/seeds/
    ```
2. Ejecuta la semilla
    ```sh
    node seeds.js
    ```
## Ejecución en Desarrollo
1. Inicia el servidor en modo desarrollo:
    ```sh
    npm run dev
    ```
    
## Rutas de la API
1. Usuarios
- `POST http://localhost:3000/api/v1/users/register`
Registro de usuarios
{
    "userName": "usuario6",
    "password": "usuario"
}
- `GET http://localhost:3000/api/v1/users`
Obtener Usuarios
- `POST http://localhost:3000/api/v1/users/login
Realizar login en la aplicación
{
    "userName": "usuario2",
    "password": "usuario2"
}
- `PUT http://localhost:3000/api/v1/users/updateRolUser`
Actualizar el rol a un usuario
{
    "userName": "yolanda",
    "role": "user"
}
2. Eventos
- `GET http://localhost:3000/api/v1/libros` - Obtener todos los libros

3. Inscripciones
- `GET http://localhost:3000/api/v1/libros` - Obtener todos los libros


## Validación
Para validar que todo funciona correctamente, puedes usar herramientas como Postman o cURL para hacer peticiones a las rutas de la API mencionadas anteriormente.

## Paquetes Necesarios
- `express`: Framework para construir aplicaciones web y APIs.
- `mongoose`: ODM (Object Data Modeling) para MongoDB y Node.js.
- `dotenv`: Cargar variables de entorno desde un archivo `.env`.
- `bcrypt`: Encriptación de contraseñas.
- `jsonwebtoken`: Gestión de Tokens.

## Instrucciones
1. Usuarios
    - Los usuarios solo se pueden registrar de tipo user.
    - Solo un usuario de tipo admin puede listar los usuarios registrados. 
    - Un usuario de tipo admin puede actualizar el rol a un usuario de tipo user.
    - Solo está permitida la modificación del rol del usuario.
    - El usuario admin puede eliminar a cualquier usuario.
    - Un usuario solo puede eliminarse a sí mismo.
    - Cualquier usuario que conozca su nombre de usuario y contraseña puede logarse en la aplicación.

2. Eventos
    - No es necesario estar logado para listar los eventos.
    - Cualquier usuario identificado puede crear un evento.
    - Un evento solo puede ser modificado por la persona que lo ha creado o por un usuario de tipo admin.
    - Un evento solo puede ser eliminado por el usuario que lo ha creado o por un usuario de tipo admin.
    
3. Inscripciones
    - Un usuario de tipo admin puede listar todas las inscripciones. Un usuario de tipo user solo puede listar sus propias inscripciones.
    - El usuario de tipo admin puede inscribir a cualquier usuario en un evento. Un usuario de tipo user solo puede inscribirse a sí mismo. 
    - Cuando se crea o se elimina una inscripción los usuarios del evento son actualizados. 
    - Una inscripción solo puede ser eliminado por el usuario que se ha inscrito o por un administrador. 