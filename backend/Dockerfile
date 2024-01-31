FROM python:3.12.1-alpine3.19

WORKDIR /app

COPY requirements.txt /app
COPY django_entrypoint.sh /

RUN apk update && python3 -m pip install -r requirements.txt

CMD ["/django_entrypoint.sh"]
