# variables
###################################

MASTER_PATTERN_STRING='master'

# functions
###################################

is_master_PR () {
	if [ "$TRAVIS_BRANCH" = $MASTER_PATTERN_STRING ]; then
		echo true
	else
		echo false
	fi
}