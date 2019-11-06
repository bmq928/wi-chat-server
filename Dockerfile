#
# ---- Dependencies ----
FROM node:8.12.0-alpine AS dependencies

WORKDIR /app

COPY package.json .

RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production 

#
# ---- Release ----
FROM node:8.12.0-alpine AS release

MAINTAINER I2G

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN mkdir -p ./upload

ENV DB_NAME=wi_chat
ENV DB_USER=root
ENV DB_PASSWORD=@Abc123456
ENV DB_HOST=192.168.0.111
ENV DB_PORT=3306
ENV DB_DIALECT=mysql
ENV DB_TIMEZONE=+07:00
ENV PORT=80
ENV URL=http://localhost:5001
ENV UPLOAD_DIR=database/upload
ENV LOGIN_URL=http://admin.i2g.cloud/login
ENV LIST_USER_URL=http://admin.i2g.cloud/user/list
ENV LIST_COMPANY_URL=http://admin.i2g.cloud/company/list

EXPOSE 80

CMD ["node", "app.js"]
