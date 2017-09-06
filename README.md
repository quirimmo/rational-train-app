# rational-train-app

Simple app for interacting through irishrails api and provide few useful functions for traveling with trains

# Pre requisites

You should have node.js currently installed on your machine. If not, please download and install it from the official website:

[node.js official website](https://nodejs.org/en/)

I developed all the application using the current versions on my system:

- node.js: **6.11.0**
- npm: **4.5.0**

If you may have installed a prior version of node.js, and you need to install also the new version, you can use **Node Version Manager** in order to manage multiple versions of node.js and simply switch among them through **nvm**

# Installation

In order to install the project, simply clone this github repository into your system through the command:

`git clone https://github.com/quirimmo/rational-train-app.git`

Once cloned on your system, go through command line in the root of the project and simply install all the dependencies through:

`npm install`

# Run the application

In order to run the application, from the root of your project, simply execute the following command:

`gulp`

This will serve the project on the address [http://localhost:3000/](http://localhost:3000/)

So open your browser and point to the above link and you should see the application running correctly. Confirm the "Allow to retrieve your position" popup that you will see appearing on your page.

This will also watching to all the changes inside HTML and JS files of the projects, automatically reloading the project when you change them, without to refresh the page or run again the serve command.

If you want to run your application without watching for changes, you can use the following command:

`gulp serve-no-watch`

# Application Information

When you run the application, it will take few seconds in order to run. This is because I am retrieving all the available stations, your current position, and I am calculating the distance between you and all the stations.
Once all the distances have been calculated, I sort the stations by the distance, in order to show in the autocomplete fields of the stations, the list of the stations ordered by the distance you currently have from the single station.

So, being simple: in the autocomplete field of the starting/ending station input field, the dropdown will show all the stations depending on the current distance you are from them.

Why? Because if at the moment you're looking for a train, I supposed that the station you are more concerned about is the closest to you. All the distances have been calculated supposing you will go by walking to them.

Considering the given requirements, the default stations will be the ones provided as per requirement, but the application works for all the stations served by irishrail.

Once you select your desired starting/ending stations, you can click search in order to look for all the trains which start from the starting station and which stops to the ending station.

The list of the trains will provide few details, and clicking on the open details button, you will be provided with more details about the train:

- Next stops information
- Real time tracking of the train
- Real time distance calculation from the station you chose and your current position, and an estimation if you will be or won't be able to get train, with all the directions for reaching the station

See the below section about possible issues for further details about the functionalities and some case you may/should encounter.

# Application Structure

The irishtrail service doesn't accept cross origin requests from localhost, creating a classic CORS issue. In a "perfect world", if I was managing the service, I would add the parameter `Access-Control-Allow-Origin: *` to the header of the responses. Being the web service not manageable, I bypassed the issue using a simple **proxy mirror server**.

This server is automatically started through the gulp serve task so you don't need to manually start it. It runs on `0.0.0.0:9000`.

Actually all the requests from the application are done to this proxy server, which will redirect the request to the irishrail service, and will get back the response to the application.

This behavior is implemented inside the custom interceptor factory defined in the source files, which also handles the XML requests, parsing directly the responses to JSON objects before to get back the data to the application.

Just as a brief summary of the structure, usually for small apps I prefer to use this kind of structure when I create separate folders for components, directives, controllers, services, etc...

But for bigger applications, this structure becomes pretty unmanageable, so I prefer to adopt another kind of structure when you create a first layer of folders related to the logic, and then inside that folders put your controllers, services, etc... (including also the unit tests to all the files using the same name of the file followed by `.spec`)

In this way it is easier to understand all the logic and where are these items used inside the application. 

# Unit Tests

All the js files are followed with unit tests. You can find the unit tests inside the root folder `test/unit` and then following the same structure and names of the app source files.

In order to run the unit tests, you can use the following gulp task:

`gulp unit-test`

Again, if you want to run them but not closing the process after the first execution, you can use the following task:

`gulp unit-test-watch`

In this way the process will be running and watching changes on the spec files or js files, re running the tests every time you change something, to ensure that every change doesn't introduce breaks in the tests.

# E2E Tests

Unfortunately I didn't have time to create e2e tests.

Everything is set up and already running through the command:

`gulp protractor-test`

But unfortunately I didn't have time to implement also this kind of tests.

In order to execute the tests, you need a pre step which will install locally **selenium** needed for the execution:

`node_modules/protractor/bin/webdriver-manager update`

Obviously, this task will take care also of starting your app through the `gulp serve-no-watch` task, needed in order to execute e2e tests (the app must be running for them).

# Gulp tasks

In the `gulpfile.js` there is the list of all the available tasks. You can see to that file in order to see the defined tasks, but all the important ones are mentioned in this file.

All the other tasks are simply inner tasks of the main ones described in this documentation.

# Distribution of the app

I use a lot of tasks for development distribution and production distribution of the app.

Even for serving the app locally for development, I do use few utilities, like `gulp-inject` for automatically inject all the files in the `index.html` without adding manually the files.

So if in the source project you want to add a new file, you don't have to manually add the inclusion of that file in the index, because it will be automatically added.

In case of production distribution, you can generate the distribution version of the app through the following command:

`gulp publish`

This task will create a directory inside the root folder called `dist` and inside there will be all the concatenated and minified files needed by the app.

I use a lot of tasks and techniques, which will make this documentation too much longer than it already is, so if you want to have further discussions about that, I am happy to have a chat by person about that or about any other aspect.

# CI/CD

Everything is set up and working for CI/CD.

I am using **Travis CI** in this case, even if I am also really practice with **Jenkins**.

But for these kind of simple/open source projects related to GitHub repositories, I usually use Travis CI.

The main configuration is in the `.travis.yml` file in the root folder, and the used shell scripts `.sh` are inside the `travis` subfolder.

The process is actually the following:

- When you open a pull request, or you push over an opened pull request, a job on Travis will run
- This job will install the app, and run the unit tests. If the unit tests fail, the job will fail
- If the unit tests pass, then the `gulp publish` task will be triggered, producing the production distribution version of the app
- Then an ftp script will start moving all the files inside a web server folder (below for more details)
- In the web server, for every pull requests, a folder with the name of the pull request number will be created, so you can access all the history of the builds, in order to track changes and to keep the code for any kind of bug, for being, tested etc...

The address of the server hosting the distribution of the app is the following:

[Server address hosting the builds](http://bitweed.com/irishrail/)

Clicking on the corresponding build number, you will open the corresponding version of the app, and you can see in the source files from the dev tools, all the files of the build.

Unfortunately the application is not working on my web server. The web server I have is a web server that I have since a lot of years and I don't have an SSL certificate on it. It means that I cannot run the application on https but only on http.

Unfortunately google closed the services for requests coming from http protocols, due to security issues. As you all know, google is pushing since a while to security, before deprecating and now closing, services from http protocol. I do use **google maps api** for retrieving few information like distance, position, etc... so if you open the console remotely you will see the error coming from google.maps.api, specifying that requests from http cannot be performed.

Unfortunately this is the only web server I have at the moment, so I don't have an easy way to fix this issue at the moment.

# Software Process development

I usually use BDD for software development. So actually the flow is: 

**feature files (cucumber/gherkin engine) -> e2e tests implementation -> unit tests implementation -> code**

Being on holidays, and having just few days for completing the tests, it was impossible to me to follow the classic flow I do use for software development usually.

Considering that this was not a requirement I preferred to start from implementing the app as requested, and then going through all these extra features as unit tests, e2e tests, CI/CD etc...

# Possible issues

### Initial Loading

The initial loading will take a while in order to complete (around 7 seconds) and sometimes it could create an issue about `QUERY LIMIT EXCEEDED` if refreshing the page immediately or some other edge case.
This is because as I said above, at the beginning I retrieve the list of all the stations from irishrail and then I call google.maps.api in order to retrieve all the distances from your current position.
The google maps api allows 104 requests at the same time, then you have to wait for around 6 seconds in order to perform new requests (they consider more requests as you are flooding their servers).
Considering that the stations at the moment are 167, I need to perform the first requests and then add 6 seconds in order to perform the next ones. That's why it takes a while for loading and that's why it takes around 7 seconds to load the page.

### Google maps api 

As I said, I use these api. You should not encounter any issue on localhost, but if you notice any issue related to them, please let me know and I will check it out and provide you a way to fix it.

### Geolocation calculation

As mentioned above, I need your current position for calculating distances. So you need to click "Allow" when you will see the popup in the browser notifying you that the website is requesting your position.

### Any kind of node dependency or whatever

Using a lot of technologies though npm, if you encounter any issue installing node dependencies, please let me know and I will check it out and provide you the solution for eventually fix them.

### Trains with no informations, no lang and latitude or 0 for them

Sorry for being honest, but the irishrail api sucks.

It's not only about the usage of xml through HTTP requests, which is actually dead few years ago already, but also about a lot of returned objects, structure, fields, etc...

A brief example: the identifier of the trains is called sometimes `TrainCode`, some other time `Traincode`, some other time `TrainId`...

More over, sometimes they don't provide latitude and longitude information (or some other kind of information) for some train, so the tracking functionality is not working.

Also the latitude and longitude of the trains stations is missing for some station (`undefined` or `0` provided as values), so if you see some weird issue locating the station and calculating the distance, this could be the reason.

The tracking functionality of the trains sucks. I was hoping to create a real time tracking of the trains, but irishrail updates the train latitude and longitude not always, but just after a while, making impossible to create from outside a really good train tracking system. Sometimes they update lat and long values every minute, sometimes every five minutes, sometimes they don't at all. 
So if you will notice weird behaviors on the tracking system, this is the reason.