package com.hust.baseweb.applications.programmingcontest.docker;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import com.hust.baseweb.applications.programmingcontest.utils.ComputerLanguage;
import com.spotify.docker.client.DefaultDockerClient;
import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.LogStream;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.*;

import static com.spotify.docker.client.DockerClient.ExecCreateParam.attachStderr;
import static com.spotify.docker.client.DockerClient.ExecCreateParam.attachStdout;
import static com.spotify.docker.client.DockerClient.ListContainersParam.*;
import static com.spotify.docker.client.DockerClient.ListImagesParam.allImages;

@Configuration
@Slf4j
@NoArgsConstructor
public class DockerClientBase {

    @Value("${DOCKER_SERVER_HOST}")
    private String DOCKER_SERVER_HOST;

//    @Autowired
//    private RabbitProgrammingContestProperties contestProperties;

    private int maxConcurrentConsumers = 2;

    private static DockerClient dockerClient;

    private static final HashMap<String, String> mContainerName2Id = new HashMap<>();

    //private FileSystemStorageProperties properties;

    private final String CONTAINER_WORKING_DIR = "/workdir";

    private final String CONTAINER_LABEL = "names=leetcode";

    // For logging
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    /**
     * Init docker client
     *
     * @throws Exception
     */
    @Bean
    public void initDockerClientBase() throws Exception {
        dockerClient = DefaultDockerClient.builder()
                                          .uri(URI.create(DOCKER_SERVER_HOST))
                                          .connectionPoolSize(100)
                                          .build();
        try {
            log.info("Ping the docker daemon, returns: {}", dockerClient.ping());
            pullImages();
            createContainers();
            startContainers();
        } catch (Exception e) {
            e.printStackTrace();
//            System.exit(0);
//            throw new Exception(e.getMessage());
        }
    }

    /**
     * Pull necessary images if not existed
     *
     * @throws DockerException
     * @throws InterruptedException
     */
    public void pullImages() throws DockerException, InterruptedException {
        List<Image> images = dockerClient.listImages(allImages());
        Set<String> sImages = new HashSet<>();

        for (Image image : images) {
            sImages.add(Objects.requireNonNull(image.repoTags()).get(0));
        }

        for (Constants.DockerImage image : Constants.DockerImage.values()) {
            if (!sImages.contains(image.getValue())) {
                log.info("Not found image: {} --> pull", image.getValue());
                dockerClient.pull(image.getValue());
            }
        }
    }

    /**
     * Create necessary containers if not existed. All used container must be created with --label names=leetcode
     *
     * @throws DockerException
     * @throws InterruptedException
     */
    public void createContainers() throws DockerException, InterruptedException {
        List<Container> lContainer = dockerClient.listContainers(
            allContainers(),
            filter("label", CONTAINER_LABEL)
        );

        log.info(
            "Before creating, current containers with --label {} existed in dind:\n {}",
            CONTAINER_LABEL,
            gson.toJson(lContainer));

        Set<String> sContainers = new HashSet<>();
        for (Container container : lContainer) {
            sContainers.add(Objects.requireNonNull(container.names()).get(0));
        }

//        log.info("sContainers {}", sContainers);

        // Create necessary containers
        List<JuryContainer> juryContainers = new ArrayList<>();

        juryContainers.add(new JuryContainer(
            Constants.BaseDockerContainerName.JAVA.getValue(),
            Constants.DockerImage.JAVA));
        juryContainers.add(new JuryContainer(
            Constants.BaseDockerContainerName.PYTHON3.getValue(),
            Constants.DockerImage.PYTHON3));

//        final int maxConcurrentConsumers = contestProperties.getMaxConcurrentConsumers();
        int numOfGccContainer = Math.min(maxConcurrentConsumers, 10);
        for (int i = 1; i <= numOfGccContainer; i++) {
            juryContainers.add(new JuryContainer(
                Constants.BaseDockerContainerName.GCC.getValue() + i,
                Constants.DockerImage.GCC));
        }

        ////
        Map<String, String> labels = new HashMap<>();
        labels.put("names", "leetcode");

        for (JuryContainer container : juryContainers) {
            String containerName = container.getName();

            if (!sContainers.contains(containerName)) {
                log.info("Not found container: " + containerName + " --> create");
                ContainerConfig containerConfig = ContainerConfig.builder()
                                                                 .image(container.getImage().getValue())
                                                                 .cmd("sh", "-c", "while :; do sleep 1; done")
                                                                 .labels(labels)
                                                                 .workingDir(CONTAINER_WORKING_DIR)
                                                                 .attachStdout(true)
                                                                 .attachStdin(true)
                                                                 .build();
                ContainerCreation containerCreation = dockerClient.createContainer(
                    containerConfig,
                    containerName.substring(1));
                log.info("Created container: " + containerName + ", with Id: " + containerCreation.id());
            }
        }
    }


    /**
     * Start necessary containers
     *
     * @throws DockerException
     * @throws InterruptedException
     */
    public void startContainers() throws DockerException, InterruptedException {
        List<Container> runningContainers = dockerClient.listContainers(
            withStatusRunning(),
            filter("label", CONTAINER_LABEL)
        );

        for (Container container : runningContainers) {
            mContainerName2Id.put(Objects.requireNonNull(container.names()).get(0), container.id());
        }

        //
        List<Container> notRunningContainers = dockerClient.listContainers(
            withStatusCreated(),
            withStatusExited(),
            filter("label", CONTAINER_LABEL));

        for (Container container : notRunningContainers) {
            dockerClient.startContainer(container.id());
            mContainerName2Id.put(Objects.requireNonNull(container.names()).get(0), container.id());
        }

        log.info("Running containers with --label {} in dind:\n {}", CONTAINER_LABEL, gson.toJson(mContainerName2Id));
    }

//    public String createGccContainer() throws DockerException, InterruptedException {
//        Map<String, String> m = new HashMap<>();
//        m.put("names", "leetcode");
//        ContainerConfig gccContainerConfig = ContainerConfig.builder()
//                                                            .image("gcc:8.5-buster")
//                                                            .workingDir("/workdir")
//                                                            .hostname("test1")
//                                                            .cmd("sh", "-c", "while :; do sleep 1; done")
//                                                            .labels(m)
//                                                            .attachStdout(true)
//                                                            .attachStdin(true)
//                                                            .build();
//        ContainerCreation gccCreation = dockerClient.createContainer(gccContainerConfig, "gcc");
//        dockerClient.startContainer(gccCreation.id());
//        return gccCreation.id();
//    }

    public String runExecutable(
        ComputerLanguage.Languages languages,
        String dirName
    ) throws DockerException, InterruptedException, IOException {
        return runExecutable(languages, dirName, 1);
    }

    /**
     * @param languages    programming language of source code
     * @param dirName
     * @param fromConsumer index of consumer, from 1 to maxConcurrentConsumers
     * @return execution result
     * @throws DockerException
     * @throws InterruptedException
     * @throws IOException
     */
    public String runExecutable(
        ComputerLanguage.Languages languages,
        String dirName,
        int fromConsumer
    ) throws DockerException, InterruptedException, IOException {
        //log.info("runExecutable, dirName = " + dirName + " language = " + languages);
        String containerId;
        switch (languages) {
            case CPP:
                containerId = mContainerName2Id.get(Constants.BaseDockerContainerName.GCC.getValue() + fromConsumer);
                break;
            case JAVA:
                containerId = mContainerName2Id.get(Constants.BaseDockerContainerName.JAVA.getValue());
                break;
            case PYTHON3:
                containerId = mContainerName2Id.get(Constants.BaseDockerContainerName.PYTHON3.getValue());
                break;
//            case GOLANG:
//                containerId = mContainerName2Id.get(Constants.BaseDockerContainerName.GOLANG.getValue());
//                break;
            default:
                log.info("Language is not supported");
                return "err";
        }

        log.info("Send executable file to container with Id: {}", containerId);

        //
        String basePath = "./temp_dir/";
        File slidesDir = new File(basePath);
        if (!slidesDir.exists()) {
            slidesDir.mkdirs();
        }

        dockerClient.copyToContainer(
            new java.io.File(basePath + dirName).toPath(),
            containerId,
            CONTAINER_WORKING_DIR + "/");

        //
        //log.info("runExecutable, dirName = " + dirName + " language = " + languages + " copyToContainer OK");
        String[] runCommand = {"bash", dirName + ".sh"};
        ExecCreation runExecCreation = dockerClient.execCreate(
            containerId,
            runCommand,
            attachStdout(),
            attachStderr());

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

@Getter
@Setter
@AllArgsConstructor
class JuryContainer {

    private String name;

    private Constants.DockerImage image;

}

