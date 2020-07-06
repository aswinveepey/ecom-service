FROM node:14-alpine

# create folder for nginx
# RUN mkdir -p /run/nginx

# install nginx and supervisor
# RUN apk add --update --no-cache nginx supervisor

# copy and set work directory
COPY . /litcom-service-rest
WORKDIR /litcom-service-rest

# install dependencies and clear redundant stuff
RUN npm install --no-package-lock
# RUN apk del build-dependencies

# copy config files
# COPY config/nginx.conf /etc/nginx/conf.d/default.conf
# COPY config/supervisord.conf /etc/supervisord.conf

# RUN ln -sf /dev/stdout /litcom-service-rest/stdout.log && ln -sf /dev/stderr /litcom-service-rest/stderr.log

# expose port and run supervisor
#env should be passed as secrets
CMD ["npm", "start"]
EXPOSE 3002