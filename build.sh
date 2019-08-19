
#check if docker experimental features is on
#check if qemu is installed
#docker build (arguments will be architecture)
#echo "Hello"

EXPERIMENTAL=`docker version | grep Experimental | tail -n 1 | xargs`
if [ "$EXPERIMENTAL" != "Experimental: true" ]; then
    echo "Please enable the docker engine's experimental features" 
    exit 1
fi

ARCH=$1
PLATFORM="linux/$1"
PROJECTNAME="kuksa"
#PROJECTPATH='$HOME/$PROJECTNAME'
TAG=$2
cp /usr/bin/qemu-arm-static ./qemu-arm-static

if [ "$?" != "0" ]; then
    echo "Please install the qemu-user-static package" 
    exit 1
fi


#echo $TAG
docker build --platform $PLATFORM -t ${ARCH}/kuksa:${TAG} .