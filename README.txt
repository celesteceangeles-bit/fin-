PETMATCH - VERSION SIN NETLIFY

Esta versión usa Supabase para autenticación y base de datos. La web es estática y puede publicarse en GitHub Pages. Netlify y sus funciones ya no se utilizan.

PASO 1. CONFIGURAR SUPABASE
1. Abrí tu proyecto de Supabase.
2. Entrá en SQL Editor > New query.
3. Abrí el archivo supabase-setup.sql de esta carpeta, copiá todo su contenido, pegalo en SQL Editor y ejecutalo.

PASO 2. CREAR EL USUARIO ADMINISTRADOR
1. En Supabase, abrí Authentication > Users > Add user.
2. Creá el usuario con el correo y la contraseña que usarás para entrar a PetMatch. Confirmá el correo si Supabase lo solicita.
3. En la lista de Users, copiá el UUID/ID del usuario (no el correo).
4. Abrí SQL Editor > New query y ejecutá esta consulta, reemplazando los dos valores:

insert into public.administradores (user_id, email)
values ('PEGAR_UUID_DEL_USUARIO', 'correo@ejemplo.com')
on conflict (email) do update set user_id = excluded.user_id;

Usá el UUID del usuario creado en el paso anterior y el mismo correo de ese usuario. No pegues contraseñas en SQL.

PASO 3. CONFIGURAR LA CONEXIÓN PÚBLICA
1. En Supabase, copiá Project URL y Publishable key.
2. Abrí public/supabase-config.js.
3. Reemplazá PEGAR_AQUI_PROJECT_URL por Project URL y PEGAR_AQUI_PUBLISHABLE_KEY por Publishable key.
4. Guardá el archivo.

La Publishable key puede estar en el navegador. No uses Secret key ni service_role key en ningún archivo público.

PASO 4. PUBLICAR SIN NETLIFY
Una opción gratuita para publicar esta web estática es GitHub Pages:
1. Creá un repositorio nuevo en GitHub.
2. Subí TODO el contenido de la carpeta public (index.html, styles.css, app.js, supabase-config.js e imagenes) a la raíz del repositorio.
3. En el repositorio, abrí Settings > Pages.
4. En Build and deployment, elegí Deploy from a branch, seleccioná la rama main y la carpeta /(root), y guardá.
5. Esperá a que GitHub Pages publique la dirección del sitio.

Importante: GitHub Pages aloja la página. Supabase sigue siendo la base de datos y el inicio de sesión. No hace falta configurar variables en Netlify ni subir una función de servidor.

FUNCIONES INCLUIDAS
- Catálogo, filtros, favoritos y test de compatibilidad.
- Envío de solicitudes de adopción a Supabase.
- Consulta del estado por número de solicitud y correo.
- Inicio de sesión de administrador con Supabase Auth.
- Panel para ver solicitudes, cambiar estados y guardar mensajes en el historial.

LIMITACIÓN DE ESTA VERSIÓN
Los mensajes se guardan en PetMatch, pero no se envían automáticamente por Gmail. Para enviar correos de forma segura haría falta agregar una función de servidor (por ejemplo, una Supabase Edge Function) y configurar un proveedor de correo. No se exponen contraseñas ni claves secretas en el navegador.

NOTA SOBRE LOS DATOS
La base nueva empieza vacía. Los registros que estuvieran guardados en la implementación anterior no se migran automáticamente. No borres el proyecto anterior ni sus datos hasta comprobar que ya no necesitás recuperarlos.
