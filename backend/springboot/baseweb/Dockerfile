# syntax = docker/dockerfile:1.3

FROM openjdk:8-jdk-alpine as build
WORKDIR /workspace/app
#RUN apk add --no-cache fontconfig
#RUN ln -s /usr/lib/libfontconfig.so.1 /usr/lib/libfontconfig.so && \
#    ln -s /lib/libuuid.so.1 /usr/lib/libuuid.so.1 && \
#    ln -s /lib/libc.musl-x86_64.so.1 /usr/lib/libc.musl-x86_64.so.1
#ENV LD_LIBRARY_PATH /usr/lib

RUN apk add --update ttf-dejavu && rm -rf /var/cache/apk/*
COPY mvnw .
RUN chmod +x mvnw
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM openjdk:8-jdk-alpine
RUN apk update && apk add --no-cache gcompat # For ortools
#RUN apk add --no-cache fontconfig
#RUN ln -s /usr/lib/libfontconfig.so.1 /usr/lib/libfontconfig.so && \
#    ln -s /lib/libuuid.so.1 /usr/lib/libuuid.so.1 && \
#    ln -s /lib/libc.musl-x86_64.so.1 /usr/lib/libc.musl-x86_64.so.1
#ENV LD_LIBRARY_PATH /usr/lib
RUN apk add --update ttf-dejavu && rm -rf /var/cache/apk/*

VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","com.hust.baseweb.BasewebApplication"]
