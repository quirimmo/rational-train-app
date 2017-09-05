#!/bin/bash
source ./travis/global.sh --source-only

set -ev

ftp_transfer () {
	cd dist
	find . -type f -exec curl --retry 3 --ftp-create-dirs  -u $1:$2 -T {} ftp://$3/{}  \;
}

# if destination branch of the PR is master
# then ftp app to the server
if [ $(is_master_PR) = true ]; then
	ftp_dev_address=$BITWEED_FTP_DOMAIN/$TRAVIS_PULL_REQUEST
	ftp_transfer $FTP_USER $FTP_PASSWORD $ftp_dev_address
fi