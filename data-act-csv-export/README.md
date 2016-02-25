# GitHub Issues Export

A Node.js script that creates a .csv of GitHub issues and their corresponding comments.

We created this script on behalf of a federal agency partner that was collecting public feedback via GitHub issues. Although the agency used GitHub e-mail notifications to comply with public records laws, they also wanted a way to capture the feedback in a single place.

Before getting started, you'll need a [GitHub account](https://github.com/join "Join GitHub").

## Installation

1. Install [Node.js](https://nodejs.org/en/download/ "download Node.js"). This also installs the npm package manager, which you'll use later to install a few dependencies.
2. From the command line, clone the project repository from GitHub to your local machine:

        $ git clone git@github.com:18F/data-act-csv-export.git

3. Change to the directory that contains node application:

        $ cd data-act-csv-export/data-act-csv-export

4. Install package dependencies:

        $ npm install

## Usage
First, you'll need to create a GitHub personal access token. That's because you'll exceed the GitHub API rate limit very quickly if you try running this script as an unauthenticated user.

Make sure you're logged into GitHub, and follow [these directions](https://help.github.com/articles/creating-an-access-token-for-command-line-use/ "Create a GitHub personal access token") to create your token. When asked to _Select scopes_, accept the defaults.

From the command line, run the script, passing in the GitHub repo and your personal access token as parameters (make sure you're in the application folder):

        $ node index.js -r githuborg/reponame -k [GitHub personal access token]


* ```-r```: the GitHub repository you're running the script against
* ```-k```: your GitHub personal access token

For example, running the following command will grab all issues and their associated comments from the [fedspendingtransparency/fedspendingtransparency.github.io](https://github.com/fedspendingtransparency/fedspendingtransparency.github.io) GitHub repository and write them to a .csv file called _fedspendingtransparency-fedspendingtransparency.github.io-comments-export-[timestamp].csv_

        $ node index.js -r fedspendingtransparency/fedspendingtransparency.github.io -k 0e8530bsupersecretkey
