--Drops
DROP TRIGGER IF EXISTS bidirectional_friendship_update_trigger ON player_friends;
DROP TABLE player_friends;
DROP TABLE player_block;
DROP TABLE chat;
DROP TABLE game;
DROP TABLE tournament;
DROP TABLE player;

--Creates
CREATE TABLE player 
(
	id SERIAL PRIMARY KEY,
	nick VARCHAR(100) UNIQUE NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	pass VARCHAR(100) NOT NULL, -- Debe ser un hash
	avatar VARCHAR(100),
	register_date DATE
);
CREATE TABLE player_friends 
(
	id SERIAL PRIMARY KEY,
	my_user INTEGER REFERENCES player(id),
	my_friend INTEGER REFERENCES player(id),
	status INTEGER, -- Pendiente = 0
	register_date DATE
);
CREATE TABLE player_block 
(
	id SERIAL PRIMARY KEY,
	my_user INTEGER REFERENCES player(id),
	block_user INTEGER REFERENCES player(id),
	register_date DATE
);
CREATE TABLE chat 
(
	id SERIAL PRIMARY KEY,
	my_user INTEGER REFERENCES player(id), -- Para el 2vs2 se podria añadir myUserCo y myFriendCo si son null en 1vs1
	my_friend INTEGER REFERENCES player(id),
	messages TEXT[],-- array de mensajes
	register_date DATE
	--Archivado?
);

CREATE TABLE tournament 
(
    id SERIAL PRIMARY KEY,
    finished INTEGER, -- Finist = 1/ notFinistc= 0
    register_date DATE
);

CREATE TABLE game 
(
	id SERIAL PRIMARY KEY,
	my_user INTEGER REFERENCES player(id),
	my_friend INTEGER REFERENCES player(id),
	win  INTEGER , -- WIN = 1/ LOSE = 0 / PENDING = 2
	register_date DATE,
	tournament INTEGER REFERENCES tournament(id) -- NULL en caso de que sea Partida unica
);

-- Función PL/pgSQL para manejar actualizaciones en playerFriends
CREATE OR REPLACE FUNCTION bidirectional_friendship_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar la relación de amistad en ambas direcciones solo si el estado cambió a true
  IF (NEW.status = true AND OLD.status = false) THEN
    INSERT INTO player_friends (my_user, my_friend, status, register_date)
    VALUES (NEW.my_friend, NEW.my_user, NEW.status, NEW.register_date);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger para UPDATE
CREATE TRIGGER bidirectional_friendship_update_trigger
AFTER UPDATE ON player_friends
FOR EACH ROW
EXECUTE FUNCTION bidirectional_friendship_update();

--DATOS
-- Datos de prueba para player
INSERT INTO player (nick, email, pass, avatar, register_date)
VALUES
  ('user1', 'user1@example.com', 'hashed_password1', 'avatar1.jpg', '2023-01-01'),
  ('user2', 'user2@example.com', 'hashed_password2', 'avatar2.jpg', '2023-01-02'),
  ('user3', 'user3@example.com', 'hashed_password3', 'avatar3.jpg', '2023-01-03'),
  ('user4', 'user4@example.com', 'hashed_password4', 'avatar4.jpg', '2023-01-04'),
  ('user5', 'user5@example.com', 'hashed_password5', 'avatar5.jpg', '2023-01-05'),
  ('user6', 'user6@example.com', 'hashed_password6', 'avatar6.jpg', '2023-01-06'),
  ('user7', 'user7@example.com', 'hashed_password7', 'avatar7.jpg', '2023-01-07'),
  ('user8', 'user8@example.com', 'hashed_password8', 'avatar8.jpg', '2023-01-08'),
  ('user9', 'user9@example.com', 'hashed_password9', 'avatar9.jpg', '2023-01-09'),
  ('user10', 'user10@example.com', 'hashed_password10', 'avatar10.jpg', '2023-01-10');

-- Datos de prueba para player_friends en las que status es true: son bidirecionales
INSERT INTO player_friends (my_user, my_friend, status, register_date)
VALUES
  (1, 2, 0, '2023-01-01'),
  (2, 3, 1, '2023-01-02'),
  (3, 2, 1, '2023-01-02'),
  (3, 1, 0, '2023-01-03'),
  (4, 5, 1, '2023-01-04'),
  (5, 4, 1, '2023-01-04'),
  (5, 6, 0, '2023-01-05'),
  (6, 4, 1, '2023-01-06'),
  (4, 6, 1, '2023-01-06'),
  (7, 8, 0, '2023-01-07'),
  (8, 9, 1, '2023-01-08'),
  (9, 8, 1, '2023-01-08'),
  (9, 10, 0, '2023-01-09'),
  (7, 10, 1, '2023-01-10'),
  (10, 7, 1, '2023-01-10');

-- Datos de prueba para player_block || Creo que necesita un trigger
INSERT INTO player_block (my_user, block_user, register_date)
VALUES
  (1, 3, '2023-01-01'),
  (2, 1, '2023-01-02'),
  (3, 2, '2023-01-03'),
  (4, 5, '2023-01-04'),
  (5, 6, '2023-01-05'),
  (6, 4, '2023-01-06'),
  (7, 8, '2023-01-07'),
  (8, 9, '2023-01-08'),
  (9, 10, '2023-01-09'),
  (10, 7, '2023-01-10');

-- Datos de prueba para chat
INSERT INTO chat (my_user, my_friend, messages, register_date)
VALUES
  (1, 2, ARRAY['Hola', 'Cómo estás'], '2023-01-01'),
  (2, 3, ARRAY['Bien, gracias', '¿Y tú?'], '2023-01-02'),
  (3, 1, ARRAY['Todo bien', 'Nos vemos luego'], '2023-01-03'),
  (4, 5, ARRAY['Hola', '¿Cómo va todo?'], '2023-01-04'),
  (5, 6, ARRAY['Bien, gracias', 'Preparándome para el trabajo'], '2023-01-05'),
  (6, 4, ARRAY['¡Buena suerte!', 'Hablamos después'], '2023-01-06'),
  (7, 8, ARRAY['Hola', '¿Quieres jugar una partida más tarde?'], '2023-01-07'),
  (8, 9, ARRAY['Sí, claro', 'Estaré en línea'], '2023-01-08'),
  (9, 10, ARRAY['¡Hola!', '¿Te gustaría unirte a nuestro torneo?'], '2023-01-09'),
  (10, 7, ARRAY['¡Por supuesto!', '¿A qué hora?'], '2023-01-10');

-- Datos de prueba para tournament
INSERT INTO tournament (finished, register_date)
VALUES
  (1, '2023-01-01'),
  (0, '2023-01-02'),
  (1, '2023-01-03'),
  (0, '2023-01-04'),
  (1, '2023-01-05'),
  (0, '2023-01-06'),
  (1, '2023-01-07'),
  (0, '2023-01-08'),
  (1, '2023-01-09'),
  (0, '2023-01-10');

-- Datos de prueba para game
INSERT INTO game (my_user, my_friend, win, register_date, tournament)
VALUES
  (1, 2, 1, '2023-01-01', 1),
  (2, 3, 0, '2023-01-02', 2),
  (3, 1, 2, '2023-01-03', NULL),
  (4, 5, 1, '2023-01-04', 3),
  (5, 6, 0, '2023-01-05', 4),
  (6, 4, 2, '2023-01-06', NULL),
  (7, 8, 1, '2023-01-07', 5),
  (8, 9, 0, '2023-01-08', 6),
  (9, 10, 2, '2023-01-09', NULL),
  (10, 7, 1, '2023-01-10', 7);
