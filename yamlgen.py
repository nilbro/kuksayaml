import yaml
import os
import sys

with open('temp.txt', 'r') as f:
    inputList = [line.strip() for line in f]


os.remove('temp.txt')
print(str(sys.argv))

dictDocker = {'image':inputList[0],
'name':inputList[1],
'version':inputList[2],
'owner':inputList[3],
'description':inputList[4],
'config':{'network_mode':'host'}
}

dictAppStore = {'url':'https://kuksa-appstore.appstacle.appstaclecloud.org:8443',
'category':inputList[5],
'auth':inputList[6]}

dictHawkbit = {'url':'http://hawkbit-appstacle.westeurope.cloudapp.azure.com:8080',
'target':inputList[7],
'user':inputList[8],
'password':inputList[9]}

kuksa = [{'Docker':dictDocker},{'AppStore':dictAppStore},{'Hawkbit':dictHawkbit}]


with open(str(sys.argv[1])+'/kuksa.yaml', 'w') as f:
    data = yaml.dump(kuksa,f)