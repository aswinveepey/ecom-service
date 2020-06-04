FROM node:14-alpine

# create folder for nginx
RUN mkdir -p /run/nginx

# install nginx and supervisor
RUN apk add --update --no-cache nginx supervisor

# copy and set work directory
COPY . /hyss-inframart-service
WORKDIR /hyss-inframart-service

# install dependencies and clear redundant stuff
RUN npm install --no-package-lock
# RUN apk del build-dependencies

# copy config files
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY config/supervisord.conf /etc/supervisord.conf

# RUN ln -sf /dev/stdout /hyss-inframart-service/stdout.log && ln -sf /dev/stderr /hyss-inframart-service/stderr.log

# expose port and run supervisor
#env should be passed as secrets
CMD ["supervisord", "-n", "-c", "/etc/supervisord.conf"]
EXPOSE 3002