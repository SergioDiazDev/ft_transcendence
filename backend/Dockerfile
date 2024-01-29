FROM python:3.12.1-alpine3.19

WORKDIR /app
COPY requirements.txt /app/requirements.txt

RUN apk update && python3 -m pip install -r requirements.txt

CMD ["python3", "-u", "manage.py", "runserver", "0.0.0.0:8000"]
