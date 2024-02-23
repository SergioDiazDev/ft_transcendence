- How to go to DB:

make shell service=postgresql
psql -U transcendence
\dt (to watch table inside)
SELECT * FROM $name;  (the name of the table you want to watch)


- For M1 mac, change the Dockerfile backend:

RUN apk update && apk add gcc musl-dev libffi-dev && python3 -m pip install -r requirements.txt
