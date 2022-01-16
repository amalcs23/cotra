# Fabric Network setup Guide

### Install Prerequisites
https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html

### Download Docker images
run **./bootstrap.sh** file

### Fabric Network Setup
```
./network.sh up -ca  # Fabric network up

./network.sh createChannel -c mychannel  # Create new channel mychannel

./network.sh deployCC -ccn basic -ccp ../cotra-app/chaincode-go -ccl go  # Install chaincode

```

### Explorer Configuration

```
cd explorer
docker-compose up -d        # Create explorer app
docker-compose down -v      # Remove explorer app

```

