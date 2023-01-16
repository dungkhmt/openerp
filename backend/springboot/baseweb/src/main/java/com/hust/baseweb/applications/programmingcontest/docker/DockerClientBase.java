package com.hust.baseweb.applications.programmingcontest.docker;

import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import com.hust.baseweb.applications.programmingcontest.utils.ComputerLanguage;
import com.hust.baseweb.applications.programmingcontest.utils.TempDir;
import com.spotify.docker.client.DefaultDockerClient;
import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.DockerClient.ExecCreateParam;
import com.spotify.docker.client.DockerClient.ListContainersParam;
import com.spotify.docker.client.DockerClient.ListImagesParam;
import com.spotify.docker.client.LogStream;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.*;

@Configuration
@Slf4j
//@AllArgsConstructor(onConstructor = @__(@Autowired))
public class DockerClientBase {

    @Value("${DOCKER_SERVER_HOST}")
    private String DOCKER_SERVER_HOST;

    private static DockerClient dockerClient;

    private static final HashMap<String, String> m = new HashMap<>();

    //private FileSystemStorageProperties properties;
    public DockerClientBase() {
    }

    @Bean
    public void initDockerClientBase() throws Exception {
        dockerClient = DefaultDockerClient.builder()
                                          .uri(URI.create(DOCKER_SERVER_HOST))
                                          .connectionPoolSize(100)
                                          .build();
        try {
            log.info("ping {}", dockerClient.ping());
            loadNotExistedImage();
            containerExist();
        } catch (Exception e) {
            e.printStackTrace();
//            System.exit(0);
//            throw new Exception(e.getMessage());
        }
    }

    public void containerExist() throws DockerException, InterruptedException {
        List<Container> listContainerStart = dockerClient.listContainers(
            ListContainersParam.withStatusRunning(),
            ListContainersParam.filter("label", "names=leetcode")
        );

        for (Container container : listContainerStart) {
            m.put(Objects.requireNonNull(container.names()).get(0), container.id());
        }

        List<Container> listContainersStop = dockerClient.listContainers(
            ListContainersParam.withStatusExited(),
            ListContainersParam.filter("label", "names=leetcode"));

        for (Container container : listContainersStop) {
            m.put(Objects.requireNonNull(container.names()).get(0), container.id());
            dockerClient.startContainer(container.id());
        }

        List<Container> listContainersCreated = dockerClient.listContainers(
            ListContainersParam.withStatusCreated(),
            ListContainersParam.filter("label", "names=leetcode"));

        for (Container container : listContainersCreated) {
            m.put(Objects.requireNonNull(container.names()).get(0), container.id());
            dockerClient.startContainer(container.id());
        }

        log.info("{}", m);
    }


    public void loadNotExistedImage() throws DockerException, InterruptedException {
        List<Image> list = dockerClient.listImages(ListImagesParam.allImages());
        Set<String> imagesSet = new HashSet<>();

        for (Image image : list) {
            imagesSet.add(Objects.requireNonNull(image.repoTags()).get(0));
        }

        for (Constants.DockerImage i : Constants.DockerImage.values()) {
            if (!imagesSet.contains(i.getValue())) {
                dockerClient.pull(i.getValue());
            }
        }

        List<Container> listContainer = dockerClient.listContainers(
            ListContainersParam.allContainers(),
            ListContainersParam.filter("label", "names=leetcode")
        );

        log.info("list container {}", listContainer);
        Set<String> containerSet = new HashSet<>();
        for (Container container : listContainer) {
            containerSet.add(Objects.requireNonNull(container.names()).get(0));
        }

        log.info("containerSet {}", containerSet);
        for (Constants.DockerContainer dockerContainer : Constants.DockerContainer.values()) {
            Map<String, String> m = new HashMap<>();
            m.put("names", "leetcode");

            if (!containerSet.contains(dockerContainer.getValue())) {
                ContainerConfig containerConfig;
                switch (dockerContainer) {
                    case GCC:
                        containerConfig = ContainerConfig.builder()
                                                         .image(Constants.DockerImage.GCC.getValue())
                                                         .cmd("sh", "-c", "while :; do sleep 1; done")
                                                         .labels(m)
                                                         .attachStdout(true)
                                                         .workingDir("/workdir")
                                                         .attachStdin(true)
                                                         .build();
                        dockerClient.createContainer(containerConfig, "gcc");
                        break;
                    case JAVA:
                        containerConfig = ContainerConfig.builder()
                                                         .image(Constants.DockerImage.JAVA.getValue())
                                                         .cmd("sh", "-c", "while :; do sleep 1; done")
                                                         .labels(m)
                                                         .attachStdout(true)
                                                         .workingDir("/workdir")
                                                         .attachStdin(true)
                                                         .build();
                        dockerClient.createContainer(containerConfig, "java");
                        break;
                    case PYTHON3:
                        containerConfig = ContainerConfig.builder()
                                                         .image(Constants.DockerImage.PYTHON3.getValue())
                                                         .cmd("sh", "-c", "while :; do sleep 1; done")
                                                         .labels(m)
                                                         .attachStdout(true)
                                                         .workingDir("/workdir")
                                                         .attachStdin(true)
                                                         .build();
                        dockerClient.createContainer(containerConfig, "python3");
                        break;
                    case GOLANG:
                        containerConfig = ContainerConfig.builder()
                                                         .image(Constants.DockerImage.GOLANG.getValue())
                                                         .cmd("sh", "-c", "while :; do sleep 1; done")
                                                         .labels(m)
                                                         .workingDir("/workdir")
                                                         .attachStdout(true)
                                                         .attachStdin(true)
                                                         .build();
                        dockerClient.createContainer(containerConfig, "golang");
                        break;
                }
            }
        }
    }

    public String createGccContainer() throws DockerException, InterruptedException {
        Map<String, String> m = new HashMap<>();
        m.put("names", "leetcode");
        ContainerConfig gccContainerConfig = ContainerConfig.builder()
                                                            .image("gcc:8.5-buster")
                                                            .workingDir("/workdir")
                                                            .hostname("test1")
                                                            .cmd("sh", "-c", "while :; do sleep 1; done")
                                                            .labels(m)
                                                            .attachStdout(true)
                                                            .attachStdin(true)
                                                            .build();
        ContainerCreation gccCreation = dockerClient.createContainer(gccContainerConfig, "gcc");
        dockerClient.startContainer(gccCreation.id());
        return gccCreation.id();
    }

    public String runExecutable(
        ComputerLanguage.Languages languages,
        String dirName
    ) throws DockerException, InterruptedException, IOException {
        //log.info("runExecutable, dirName = " + dirName + " language = " + languages);
        String[] runCommand = {"bash", dirName + ".sh"};
        String containerId;
        switch (languages) {
            case CPP:
                containerId = m.get("/gcc");
                break;
            case JAVA:
                containerId = m.get("/java");
                break;
            case PYTHON3:
                containerId = m.get("/python3");
                break;
            case GOLANG:
                containerId = m.get("/golang");
                break;
            default:
                log.info("language err");
                return "err";
        }
        File slidesDir = new File(TempDir.TEMPDIR);
        if (!slidesDir.exists()) {
            slidesDir.mkdirs();
        }
        dockerClient.copyToContainer(new java.io.File(TempDir.TEMPDIR + dirName).toPath(), containerId, "/workdir/");

        //log.info("runExecutable, dirName = " + dirName + " language = " + languages + " copyToContainer OK");
        ExecCreation runExecCreation = dockerClient.execCreate(
            containerId, runCommand, ExecCreateParam.attachStdout(),
            ExecCreateParam.attachStderr());

        //log.info("runExecutable, dirName = " +     dirName +   " language = " +     languages +  " copyToContainer OK -> runExecCreation OK");
        String output = null;
        try (LogStream stream = dockerClient.execStart(runExecCreation.id())) {
            output = stream.readFully() ;
        } catch (DockerException | InterruptedException e) {
            log.error("Failed to exec commands '{}' in container '{}'", runCommand, containerId, e);
        }

        //log.info("runExecutable, dirName = " +   dirName +   " language = " +   languages + " copyToContainer OK -> runExecCreation OK -> execStart to get output OK");
        return output;
    }
}
