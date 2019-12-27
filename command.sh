PROD=",BUILD_APP"
PROD_MESSAGE=""

if [ "$1" = "prod" ]; then
	ENV="$PROD"
	echo $PROD_MESSAGE
elif [ "$1" = "production" ]; then
	ENV="$PROD"
	echo $PROD_MESSAGE
elif [ "$1" = "build" ]; then
	ENV="$PROD"
	echo $PROD_MESSAGE
elif [ "$1" = "b" ]; then
	ENV="$PROD"
	echo $PROD_MESSAGE
else
	ENV=""
fi

if [ "$2" = "" ]; then
	PLATFORM="browser"
else
	PLATFORM="$2"
fi

echo "Running for '$PLATFORM'..."

if [ "$3" = "no" ]; then
	WATCH=""
elif [ "$3" = "no-watch" ]; then
	WATCH=""
else
	WATCH="-w"
fi

if [ "$WATCH" = "-w" ]; then
	echo "Watching for changes..."
fi

./node_modules/.bin/rollup -c $WATCH --environment="APP_TARGET_BUILD_PLATFORM:$PLATFORM$ENV"
