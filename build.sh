
#check if docker experimental features is on
#check if qemu is installed
#docker build (arguments will be architecture)

EXPERIMENTAL=`docker version | grep Experimental | tail -n 1 | xargs`
if [ "$EXPERIMENTAL" != "Experimental: true" ]; then
    echo "Please enable the docker engine's experimental features" 
    exit 1
fi

ARCH=$1
PLATFORM="linux/$1"
PROJECTNAME="kuksa"
PROJECTPATH="$HOME/$PROJECTNAME"
cp /usr/bin/qemu-arm-static $PROJECTPATH

if [ "$?" != "0" ]; then
    echo "Please install the qemu-user-static package" 1>&2
    exit 1
fi

echo "$PROJECTPATH/docker/Dockerfile"
#docker build --platform $PLATFORM -f  $PROJECTPATH/docker/