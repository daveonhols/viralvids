### Overview

Viral Vids is a proof of concept portfolio site for discovering Youtube videos which are going viral on twitter in real time.
Using the twitter API to listen for topics of interest, unique video mentions are aggregated, counted and sorted in real time.
Discovered videos and associated meta data are cleaned and stored in mongo db back end for display to users.
A web front end allows users to browse viral videos by category and view the original tweets.

### Technical

The back end is all written in Javascript and runs on node.
Data storage is in Mongo DB.
The front end is served up from a node express application and styled with bootstrap and handlebars.

Video topics to monitor on Youtube are all parameterised from the command line, so running a new instance of run/counter.js and run/cleaner.js is all that is required to monitor a new topic.
NPM scripts define the build chain including linting and running tests with code coverage measured
Unit tests are implemented using chai and coverage is measured with istanbul.
A dependency injection pattern allows a high level of core code coverage (>90%) with component testing decoupled from database connectivity.
An AVLTree from dsjslib with a custom comparator is used to count and sort individual mentions of videos in real time
Promises are widely and consistently used to keep async code clean.

### Future Work

Currently multiple instances of counter / cleaner need to be run to listen to new topics, creating multiple connections to the twitter API each time.
It would be better to have one process handling all topics in parallel as the twitter API will restrict applications using multiple connections.
A better solution for secret management (API keys) would be good, currently these are in a config file not checked in and have to be copied manually to the run time environment.
Some of the logic in mongostore.js could be pulled out (i.e. calls to videoForDisplay) as that script is not unit tested and should be as thin as possible.
Front end could see some design improvement, current bootstrap styling is minimal.