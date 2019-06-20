<img src="http://res.niuxuewei.com/2019-04-09-Logo-1.png" height="50px">

SoftTracker is a tracking and guiding platform for software engineering training based on agile development, which can unit test and deploy the project uploaded by students automatically.

The manuscript of SoftTracker is in the `/docs` folder, alternatively, it can be viewed online in the [Github Pages](https://xavier-niu.github.io/soft-tracker-fontend/). You can preview it without deploying any SoftTracker components. Be aware that it is not the final version of the SoftTracker, there are maybe some minor differences between the draft and implementation.

# Get Start

You can follow the guide below to deploy the back-end SoftTracker in your environment. Please install docker or a virtual machine, such as VirtualBox before you install.

## Database

MySQL and Redis are required for SoftTracker. In development environment, MySQL version is `5.7` and Redis is `4.x`. Besides, you should restore the MySQL database with sql file in `./sql` directory. The extra configuration for Redis is not needed.

## GitLab CE

I prefer to install GitLab CE on virtual machine rather than docker, cuz it may have conflicts with the port of other applications, like ssh or http. Read [GitLab official docs](https://about.gitlab.com/install/) and install it according to what system on your server. In this case, `192.168.56.101` is the static ip for GitLab CE server.

## GitLab Runner

GitLab Runner, an executor of GitLab CI, is installed on the Docker on my server. There is a [blog](https://angristan.xyz/build-push-docker-images-gitlab-ci/) describing how to install and register on the GitLab. Besides, it introduces how to use GitLab CI to build and push Docker Image automatically.

## SonarQube

Install SonarQube into virtual machine or docker, the docs are [here](https://www.sonarqube.org/downloads/). Be aware that the version of SonarQube MUST be `6.7.x`.

## SoftTracker Back-end

Clone the code from GitHub

```bash
git clone git@github.com:xavier-niu/soft-tracker-backend.git
```

For the security, SoftTracker loads configurations from the **environment variables** which are defined with different ways on different operation system. There are some variables required for the system.

- SOFT_TRACKER_PROFILES_ACTIVE: The default value is `dev`. This item is for `spring.profiles.active`, more information please view [this page](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-profiles.html).

- SOFT_TRACKER_DB_HOST: MySQL database host, the default value is `localhost`.

- SOFT_TRACKER_DB_PORT: MySQL database port, the default value is `3306`.

- SOFT_TRACKER_DB_NAME: MySQL database name, **this item is required.**

- SOFT_TRACKER_DB_USERNAME: MySQL database username, **this item is required.**

- SOFT_TRACKER_DB_PASSWORD: MySQL database password, **this item is required.**

- SOFT_TRACKER_REDIS_HOST: Redis host, the default value is `localhost`.

- SOFT_TRACKER_REDIS_PORT: Redis port, the default value is `6379`.

- SOFT_TRACKER_GITLAB_OAUTH_ADMIN_ACCESS_TOKEN: GitLab admin access token, **this item is required.** Please follow the below steps to get it and fill it into environment variables.

  - You must make a POST request to `http(s)://your.gitlab.domain/oauth/token` with the following request body:

  ```html
  grant_type=password&username=<your_username>&password=<your_password>
  ```

  - Then, you'll receive the access token back in the response:

  ```json
  {
    "access_token": "bulabula",
    "token_type": "bearer",
    "refresh_token": "bulabula",
    "scope": "api",
    "created_at": "date"
  }
  ```

  - Fill this item with access token.

- SOFT_TRACKER_GITLAB_HOST: GitLab host,  **this item is required.** In this case, `192.168.56.101` should be filled. DO NOT add extra elements except the ip or domain of the GitLab deployed by yourself.

- SOFT_TRACKER_UPLOAD_FOLDER: Specify the files user uploaded are copied into which folder, **this item is required.**

- SOFT_TRACKER_SONAR_HOST: SonarQube host, **this item is required.**

- SOFT_TRACKER_SONAR_PORT: SonarQube port, the default value is `9000`.

The code for environment variables,  set in `~/.bash_profile` on macOS, is shown below.

```bash
# SOFT_TRACKER
export SOFT_TRACKER_DB_NAME=
export SOFT_TRACKER_DB_USERNAME=
export SOFT_TRACKER_DB_PASSWORD=
export SOFT_TRACKER_GITLAB_OAUTH_ADMIN_ACCESS_TOKEN=
export SOFT_TRACKER_GITLAB_HOST=
export SOFT_TRACKER_UPLOAD_FOLDER=
export SOFT_TRACKER_SONAR_HOST=
```

Install dependencies with Maven and package project.

```bash
mvn install
mvn package
```

Run the project.

```bash
# please replace the xxx.jar to the jar you packaged
java -jar ./target/xxx.jar
```

------

Because of dealline for gurduation design, the admin panel for SoftTracker is not implemented. Therefore, the way set the tutor role for a user, the default role is student, can be archived by inserting a row into `user_role` table mannully. As default, `1` is for student and `2` is for tutor.

![image-20190620150825837](http://res.niuxuewei.com/2019-06-20-070826.png)

## SoftTracker Front-end

Install Node.JS from [here](https://nodejs.org/en/).

Install yarn from [here](https://yarnpkg.com/en/).

Clone from GitHub.

```bash
git@github.com:xavier-niu/soft-tracker-fontend.git
```

Install js dependencies.

```bash
yarn install
```

Set the global config in `src/utils/constants-utils.js` according to your environment.

- softTrackerHostPrefix: The host of SoftTracker back-end, like `http://localhost:8080`;
- softTrackerOAuthAuthorization: PLEASE DO NOT modify if you have no idea about what it is;
- gitlabHostPrefix: The host of GitLab Server, like `http://192.168.56.101`.

> If you deploy it into production environment, you should replace `return ''` with the config fitted into your environment.

Run the project on the development environment.

```bash
yarn run dev
```

# Credits

- Vue: a one of the most awesome frontend framework in the world
- Ant Design Vue:  a design guide and component library designed by Ant Finance
- GitLab: a single application for the entire software development lifecycle. From project planning and source code management to CI/CD, monitoring, and security.
- SonarQube: an open-source platform developed by SonarSource for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities on 20+ programming languages. 
- MySQL: an open-source relational database management system.
- Redis: an in-memory data structure project implementing a distributed, in-memory key-value database with optional durability.
- SpringBoot: an application framework and inversion of control container for the Java platform.

------

Author: Xavier Niu<br>Email: a@nxw.name<br>Homepage: https://www.nxw.name
