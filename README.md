LTI 1.3
========

IMS LTI 1.3 based starter (sample) application written using Java and Spring Boot

The goal is to have a Java based web app which can serve as the basis (or starting point) for building a fully compliant
LTI 1.3 tool.

Prerequisites
-------
If you do not have Java installed we recommend installing the [adoptium](https://adoptium.net/installation.html) version through homebrew

    brew install --cask temurin

You will also need Maven

    brew install maven


Build
-----
This will produce a lti13middleware.jar file in the *target* directory

    mvn install 

note, to avoid some test errors if those happen, try

    mvn install -DskipTests=true

Quick Run
---------
You can run the app in place to try it out without having to install and deploy a servlet container.

    mvn clean install spring-boot:run

Then go to the following default URL:

    https://localhost:9090/

NOTE: To run it and connect it to real LMSs it is recommended to run it in an accessible server 
with a valid certificate. (See steps below for Adding PKCS8 RSA Keys, Setting Up SSL Cert and Using Ngrok)

Endpoints
---------
Target: https://localhost:443/lti3   
OIDC Initiation: https://localhost:443/oidc/login_initiations

Creating the Postgres database
---------------------
1. Install PostgresQL (version 13.4 as of today)
2. Create a Postgres user and database for this project by entering the following in the Terminal:
```bash
psql postgres
CREATE ROLE lti13user WITH LOGIN PASSWORD 'yourpassword';
ALTER ROLE lti13user CREATEDB;
\q 
psql postgres -U lti13user
CREATE DATABASE lti13middleware;
GRANT ALL PRIVILEGES ON DATABASE lti13middleware TO lti13user;
```
3. Ensure that the values in the application.properties file match the database name, user, and password that you used in the previous step.

Customizing
-----------
Use the application.properties to control various aspects of the Spring Boot application (like setup your own database
connection). The example file has some section with a self-explanatory title. Of course it is recommended to 
use a properties file external to the jar to avoid to store sensitive values in your code: 

```--spring.config.location=/home/yourhomefolder/application-local.properties```

Full Run
-------
The following command below will run the app with the `application-local.properties` file assuming you placed it in the root of the project.
Find the name of the .jar file in the *target* directory and replace `"name-of-.jar"` with your `.jar`

    java -jar target/"name-of-.jar" --spring.config.location=/application-local.properties

Adding PKCS8 RSA Keys to the application.properties file
--------------------------------------------------------
1. cd to the directory that you want the keys to be located
2. `openssl genrsa -out keypair.pem 2048`
3. `openssl rsa -in keypair.pem -pubout -out publickey.crt`
4. `cat publickey.crt`
5. Copy this value to `oidc.publickey` inside the application.properties file. The key needs to all be on one line, ensure that each newline is indicated by \n (may need to do a find `\n` and replace with `\\n`)
6. `openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in keypair.pem -out pkcs8.key`
7. `cat pkcs8.key`
8. Copy this value to `oidc.privatekey` inside the application.properties file. The key needs to all be on one line, ensure that each newline is indicated by \n (may need to do a find `\n` and replace with `\\n`)

Setting Up SSL Cert for Local Development
-----------------------------------------
Note: As of 8/11/2021, for Mac, this works with Firefox but not Chrome.
1. `cd ~/PATH/tool13demo/src/main/resources`
2. Generate ssl certificate in the resources directory: `keytool -genkeypair -alias keystoreAlias -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore keystore.p12 -validity 3650`
3. Enter any values desired when prompted, but make sure you remember the password that you used.
4. In the `application.properties` file, ensure that each of these variables have the correct values filled in:
```
server.port=443
security.require-ssl=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=<password from step 2>
server.ssl.keyStoreType=PKCS12
server.ssl.keyAlias=keystoreAlias
security.headers.frame=false
application.url=https://localhost:443
```
5. After running the spring boot application, you should be able to reach it at https://localhost:443

Using Ngrok For Local SSL Cert
-------------------------------------
1. Download and install ngrok
2. You will need to set up an account to use localhost. See the [setup instructions](https://dashboard.ngrok.com/get-started/setup)
3. `./ngrok http 443` (Note: This port number must match the value of `server.port` in the application.properties file.)
4. Utilize the https url from ngrok when registering your tool with the platform   

Note: Each time you restart ngrok, you will need to change the url of your tool in your registration with the LMS. However, you may restart the tool as much as you like while leaving ngrok running without issue.

Turning Demo/Test Features On/Off
---------------------------------
In the `application.properties` file, the following env variables have been added.
```
lti13.demoMode=false
lti13.enableAGS=true
lti13.enableMembership=false
lti13.enableDynamicRegistration=false
lti13.enableDeepLinking=false
lti13.enableRoleTesting=false
lti13.enableTokenController=false
```
 - `lti13.demoMode` must have a value of `true` for AGS, Membership, or Deep Linking (the LTI Advantage Services) to function regardless of the value of their individual env variables. This is because each of these services is currently a demo.
 - `lti13.enableAGS` must have a value of `true` in addition to `lti13.demoMode` having a value of `true` for the Assignments and Grades (AGS) demo service to function.
 - `lti13.enableMembership` must have a value of `true` in addition to `lti13.demoMode` having a value of `true` for the Membership demo service to function.
 - `lti13.enableDeepLinking` must have a value of `true` in addition to `lti13.demoMode` having a value of `true` for the Deep Linking demo service to function.
 - The remaining new env vars `lti13.enableDynamicRegistration`, `lti13.enableRoleTesting`, `lti13.enableTokenController` are for test endpoints. `lti13.enableDynamicRegistration` corresponds to the `RegistrationController` which has not been tested. `lti13.enableRoleTesting` corresponds to the `TestController` which I suspect will be deleted as role authorization is not needed. `lti13.enableTokenController` corresponds to `TokenController` which I suspect will be deleted if it remains unused.

Setup SQS for AGS Grade Pass Back
---------------------------------
1. The authentication to AWS uses Spring's [default authentication chain](https://cloud.spring.io/spring-cloud-static/spring-cloud-aws/1.2.3.RELEASE/multi/multi__basic_setup.html#_sdk_credentials_configuration).
2. The URI for a SQS queue should be filled in for either `lti13.grade-passback-queue` or as `LTI13_GRADE_PASSBACK_QUEUE` environment variable.
3. The region of the SQS queue should be filled in for either `cloud.aws.region.static` in the application.properties file or `AWS_REGION` as an environment variable.

Turning off AWS Integration for Local Development
-------------------------------------------------
Prior to running `mvn clean install spring-boot:run`, do the following:
1. `export spring_profiles_active=no-aws`
2. Ensure that the following property is present and uncommented in the application.properties file:
`spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration,org.springframework.cloud.aws.autoconfigure.context.ContextCredentialsAutoConfiguration,org.springframework.cloud.aws.autoconfigure.context.ContextInstanceDataAutoConfiguration,org.springframework.cloud.aws.autoconfigure.context.ContextRegionProviderAutoConfiguration,org.springframework.cloud.aws.autoconfigure.context.ContextResourceLoaderAutoConfiguration,org.springframework.cloud.aws.autoconfigure.context.ContextStackAutoConfiguration`

Turning on AWS Integration for Local Development
------------------------------------------------
Prior to running `mvn clean install spring-boot:run`, do the following:
1. `unset spring_profiles_active`
2. Ensure that the following environment variables are set:
```
cloud.aws.region.static=us-west-1
cloud.aws.region.auto=false
cloud.aws.stack.auto=false
lti13.grade-passback-queue=<queue name>
cloud.aws.credentials.access-key=<access key>
cloud.aws.credentials.secret-key=<secret key>
cloud.aws.end-point.uri=<sqs uri>
```

Sample SQS Message for AGS/Grade Passback
-----------------------------------------
`{"client_id": "97140000000000230", "user_id": "4f3d12df-e1ae-484f-8b9a-b667864e8100", "deployment_id": "461:5440a08422ab1ee7794a0588b5e4cb4a094c4256", "issuer": "https://canvas.instructure.com", "lineitem_url": "https://canvas.unicon.net/api/lti/courses/3348/line_items/503", "score": 0.3}`

Testing in the Dev/Staging Environment
--------------------------------------
1. Push changes to the branch that you want to push to the dev environment (e.g. L3-66-integration-testing)
2. `git branch -d dev-env`
3. `git checkout -b dev-env`
4. `git pull origin L3-66-integration-testing`
5. `git push --force --set-upstream origin dev-env`
6. Wait 10-15 minutes for the deployment to complete.
7. View the logs using `aws logs tail /aws/elasticbeanstalk/lti-service-dev-docker/var/log/eb-docker/containers/eb-current-app/stdouterr.log --follow --since 1h`