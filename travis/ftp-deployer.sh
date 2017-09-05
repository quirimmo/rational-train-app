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
	ftp_prod_address=$BITWEED_FTP_DOMAIN
	ftp_transfer $FTP_PASSWORD $FTP_USER $ftp_prod_address
fi