##DockerFile for the frontend app
FROM nginx:latest
ADD ./ERR_UI/dist/errproject /usr/share/nginx/html
COPY tokenizer.sh /docker-entrypoint.d/
COPY ./nginx/default.conf /etc/nginx/conf.d/
EXPOSE 4200
