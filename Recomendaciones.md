
Aquí hay algunas observaciones y sugerencias sobre la estructura de tu base de datos y el código PL/pgSQL:

* Contraseñas en texto plano:

Almacenas las contraseñas en texto plano en la tabla player. Sería más seguro almacenar solo los hashes de las contraseñas en lugar de las contraseñas en sí mismas.
Longitud de las columnas VARCHAR:

* Especificas una longitud de 100 para las columnas

nick, email, y pass en la tabla player. Esto puede ser excesivo dependiendo de tus necesidades. Considera ajustar la longitud según tus requisitos.
Uso de BOOLEAN:

* Estás utilizando el tipo de dato BOOLEAN

en las tablas playerFriends y game para representar el estado (status y win respectivamente). Ten en cuenta que algunos sistemas de bases de datos pueden tener problemas de rendimiento con columnas BOOLEAN. Podrías considerar usar un tipo de dato numérico con restricciones CHECK (por ejemplo, 0 para falso, 1 para verdadero).
Uso de arrays en la tabla chat:

* El uso de un array para almacenar mensajes en la tabla chat

puede no ser la mejor práctica si planeas realizar consultas complejas sobre esos mensajes. Podrías considerar crear una tabla separada para los mensajes y establecer una relación uno a muchos con la tabla chat.
Campos registerDate en varias tablas:

* Tienes el campo registerDate en varias tablas.

Si este campo es para rastrear cuándo se creó el registro, está bien. Sin embargo, si es para rastrear otros eventos, podrías considerar dar nombres más específicos a los campos.
Uso de SERIAL:


* La función PL/pgSQL y el trigger

que has creado para manejar actualizaciones en playerFriends parece correcto. Sin embargo, ten en cuenta que este trigger solo se activa después de una actualización en la tabla playerFriends. Si también deseas manejar inserciones y eliminaciones, podrías necesitar triggers adicionales.
Tabla tournament:
