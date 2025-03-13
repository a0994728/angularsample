FROM node:18.17.1
WORKDIR /projects
COPY . .
ENV PATH="node_modules/.bin:$PATH"
RUN yarn install -g
# RUN ng build
CMD ng serve --host 0.0.0.0
EXPOSE 4200