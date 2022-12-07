# syntax = docker/dockerfile:1.3

FROM eclipse-temurin:8-jdk as build
WORKDIR /workspace/app

COPY mvnw .
RUN chmod +x mvnw
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM eclipse-temurin:8-jdk
#RUN apk update && apk add --no-cache gcompat ncurses-libs libgcc libstdc++ # For ortools
#RUN apk add --update ttf-dejavu && rm -rf /var/cache/apk/* # For Apache POI

ENV JAVA_OPTS=""

VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT java ${JAVA_OPTS} -cp app:app/lib/* com.hust.baseweb.BasewebApplication
