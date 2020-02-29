# Pvtrading

## Introduction:
* This is the implemetaion code of a paper:  [A Blockchain-based Platform for Exchange of Solar Energy: Laboratory-scale Implementatio](https://ieeexplore.ieee.org/document/8635679)
* Base on Hyperleder Fabric1.1, composr@0.19.0, composer-cli@0.19.0, composer-rest-server@0.19.0
* The model file is the definition of composer elements: assets, tranactions, participiants. use CTO language.
* The logic file is the logic of all tansactions methds. use JS language.
* The test envoirment is : Ubuntu 16.04.6 LTS, 1CPU, 2GB MEM.
* All of the demo data is from the paper, you can try to test and compare with the paper result.

## Envoirment setup:
参考: https://hyperledger.github.io/composer/v0.16/installing/development-tools.html
1. 安装 Composer 命令行接口 (CLI)

```
npm install -g composer-cli
composer -v
```

2. 安装Fabric相关，使用脚本全家桶

```
mkdir ~/HyperledgerComposer
export COMPOSER_ROOT=~/fabric-tool
cd $COMPOSER_ROOT
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip
unzip fabric-dev-servers.zip
```

3. 第一次运行 Hyperledger Fabric 时，请执行这个命令序列：

```
cd $COMPOSER_ROOT
 export FABRIC_VERSION=hlfv11
./downloadFabric.sh
./startFabric.sh
./createPeerAdminCard.sh（将为 Fabric 管理员（即 PeerAdmin）发放一个 ID 卡）
```

只需运行 createPeerAdminCard.sh 脚本一次。从现在开始，无论任何时候启动 Hyperledger Fabric，只需像下面这样运行 startFabric.sh 脚本即可：

```
cd $COMPOSER_ROOT
 export FABRIC_VERSION=hlfv11
./startFabric.sh
(关闭: ./stopFabric.sh)
```

4. 将composer部署

```
cd $COMPOSER_ROOT/developerWorks/pvtrading
composer network install --card PeerAdmin@hlfv1 --archiveFile pvtrading@0.1.bna 记住生成的版本
composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw  --file networkadmin.card --networkName pvtrading --networkVersion 0.0.2-deploy.1

#composer network deploy -a dist/pvtrading.bna -A admin -S adminpw -c PeerAdmin@hlfv1 -f networkadmin.card
composer card import --file networkadmin.card #记住card和cardname
compser network list —card admin@pvtrading
```

5.安装comoposer rest server

```
npm install -g composer-rest-server
```

6.运行server
```
composer-rest-server
(cardname: admin@pvtrading)
composer-rest-server -c admin@pvtrading -n always -w true
composer network reset -c admin@pvtrading pvtrading #清理测试数据

```
7.更新代码
```
composer network install --card PeerAdmin@hlfv1 --archiveFile pvtrading@0.2.bna 记住生成的版本
composer network upgrade --card PeerAdmin@hlfv1 --networkName pvtrading --networkVersion 0.0.2-deploy.36（用上面命令）
```

用dig 命令 找到可以相应的IP dig @114.114.114.114 registry-1.docker.io https://segmentfault.com/a/1190000016083023

彻底清理:
```
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)
```


## Some setup problems:

一开始使用的的是composer0.20 以上的版本，以及fabric 1.2 在composer network start的时候出来问题
全体切换到 composer 1.9 以及fabric1.1
1.composer-cli 1.9    sudo npm install -g composer-cli@0.19.0 —unsafe
2.comoser-reset-server  sudo npm install -g composer-cli@0.19.0 —unsafe
然后设置 export FABRIC_VERSION=hlfv11
./download.sh
./startfabric.sh

一些报错：
a.这时候运行composer相关命令会有如下报错:
/usr/lib/node_modules/composer-cli/node_modules/fabric-client/lib/ChannelEventHub.js:666
解决: 在 /usr/lib/node_module 下的 composer-cli 和 composer-rest-server 下安装：
sudo npm install --save --unsafe grpc@1.10.1

b. ./createPeerAdmin.sh 时候报错:
```
Failed to import the business network card
keyword:    required
dataPath:   .peers['peer0.org1.example.com']
schemaPath: #/required
params:
  missingProperty: eventUrl
message:    should have required property 'eventUrl'

Error: Errors found in the connection profile in the card
Command failed
```
因为运行脚本里面用的是fabric1.2的connection.json的配置

打开fabric-tool/fabric-script/h1v11/createPeerAdmin.sh 修改配置，在peer的url下面加一行:
"eventUrl": "grpc://localhost:7053”
然后运行该 createPeerAdmin.sh （提前删除~/.composer）
参考：
https://lists.hyperledger.org/g/fabric/topic/failed_to_import_the_business/24971833?p=,,,20,0,0,0::recentpostdate%2Fsticky,,,20,2,260,24971833
https://medium.com/coinmonks/hyperledger-fabric-composer-errors-solutions-827112a3fce6

