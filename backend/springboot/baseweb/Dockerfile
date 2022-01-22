FROM openjdk:8-jdk-alpine as build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY or-tools_Ubuntu-18.04-64bit_v8.0.8283 or-tools_Ubuntu-18.04-64bit_v8.0.8283
RUN chmod 777 mvnw
RUN ./mvnw install:install-file -Dfile=or-tools_Ubuntu-18.04-64bit_v8.0.8283/ortools-java-8.0.8283.jar -DpomFile=or-tools_Ubuntu-18.04-64bit_v8.0.8283/pom-local.xml
RUN ./mvnw install:install-file -Dfile=or-tools_Ubuntu-18.04-64bit_v8.0.8283/ortools-linux-x86-64-8.0.8283.jar -DpomFile=or-tools_Ubuntu-18.04-64bit_v8.0.8283/pom-runtime.xml
COPY pom.xml .
RUN ./mvnw dependency:go-offline
COPY src src
RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM openjdk:8-jdk-alpine
COPY --from=python:3.6 / /
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","com.hust.baseweb.BasewebApplication"]
