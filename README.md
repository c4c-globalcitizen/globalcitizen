# Globalcitizen
Call4Code Global Citizen challenge submission

Copy the displayed data and paste it into the text box and click Submit and Restart the peer. 
Finally sync the certificates to the channel by opening the 'Channels' page and in the default channel press the three dots in the actions column to open the menu. Click Sync Certificate and then Submit in the popup.

Execute below commands to start the application:

Extract the global-citizen-new.zip 

npm install


composer network install --card PeerAdmin@hlfv1 --archiveFile global-citizens-network@0.0.1.bna


composer network start --networkName global-citizens-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card


composer card import --file networkadmin.card


composer network ping --card admin@global-citizens-network


composer-rest-server

npm start – this should be run inside the angular project “global-citizens-network”

# Connecting to IBM Blockchain
1. Login to your <a href="https://console.bluemix.net/">IBM Cloud account</a>
2. Launch IBM Blockchain starter plan instance on IBM Cloud. Launch IBP and click on Overview on the left panel.
3. Click on the connection profile button, This open a Connection profile panel, and click on download. 
4. Click on the connection profile button again and click on Raw JSON. Note the value of the enrollSecret property from the raw    JSON. (You can also get the value of the enrollSecretproperty from the downloaded JSON file by opening it up in an editor and    searching for enrollSecret.) You will use the enrollSecret value in subsequent steps to create certificates and more.
5. Rename and copy the downloaded json file to the root folder that was setup in the earlier steps as shown

```
    cd ~/global-citizen-network <-------------- folder where the BNA file is present.
    mv ~/Downloads/creds_*_org1.json connection-profile.json ←-File name
```

6. Use the “enroleSecret” to create the Certificate Authority (CA) Card:
```
composer card create -f ca.card -p global-citizen-network/connection-profile.json -u admin -s <ENROLL_SECRET>
```

7. Import the CA Card
```
composer card import -f ca.card -c ca</code>
```

8. Exchange the enrollSecret for valid certificates from the CA.:
```
composer identity request --card ca --path ./credentials -u admin -s <ENROLL_SECRET>
```

9. Add these certificate files to your starter plan instance by opening the 'Members' page in the blockchain service UI and then    pressing the certificates tab . Press Add Certificate and enter a name in the popup. Copy the contents of “credentials/admin-    pub.pem” 

You can run the following commands to get this info

`cat ~/global-citizens-network/credentials/admin-pub.pem`

Copy the displayed data and paste it into the text box and click Submit and Restart the peer. 
Finally sync the certificates to the channel by opening the 'Channels' page and in the default channel press the three dots in the actions column to open the menu. Click Sync Certificate and then Submit in the popup.


##Install and Start the network
1. Create a card with channel and peer admin roles
```
composer card create -f adminCard.card -p connection-profile.json -u admin -c ./credentials/admin-pub.pem -k ./credentials/admin-priv.pem --role PeerAdmin --role ChannelAdmin
```
2. Import the admin card created.

`composer card import -f adminCard.card -c adminCard`

3. Now we will use the admin card to install the network with the following command:
```
composer network install --card adminCard --archiveFile global-citizens-network@0.0.1.bna
```
4. Start the business network by providing the admin card, the path to the .bna file, and the credentials received from the CA.    This command will issue a card which we will remove, called ‘delete_me.card’.

```
composer network start --networkName global-citizens-network --networkVersion 0.0.1 -c adminCard -A admin -C ./credentials/admin-pub.pem -f delete_me.card
```
>The above commands will take time if a it fails, we need to retry.
Delete the used to start the business network. 
`rm delete_me.card`

5. Create a new business network card

After we have installed the runtime and started the network, we need to create a card which we will deploy to the Starter Plan. Use the following command to create adminCard.card:
```
composer card create -n global-citizens-network -p connection-profile.json -u admin -c ./credentials/admin-pub.pem -k ./credentials/admin-priv.pem

composer card import -f admin@global-citizens-network.card
```
6. Ping the network to test it. Please make sure your using the correct card name. 
```
composer network ping -c admin@global-citizens-network
```

##Setup Kubernetes cluster node on Bluemix
>This setup is done using Ubuntu 16.04 VM. Similar commands are available for other platforms. 
1. Download and install Hyperledger Composer CLI

Download and install the Hyperledger Composer CLI using the following command:
`npm install -g composer-cli`

2. Download and install kubectl CLI

 `https://kubernetes.io/docs/tasks/kubectl/install/`
 
3. Download and install the Bluemix CLI
  `http://clis.ng.bluemix.net/ui/home.html`
  
4. Add the bluemix plugins repo
```
$ bx plugin repo-add bluemix https://plugins.ng.bluemix.net
```
5. Add the container service plugin
```
$ bx plugin install container-service -r bluemix
```

###Setup a cluster

6. Point Bluemix CLI to production API
```
$ bx api api.ng.bluemix.net
```
7. Login to bluemix use sso login command this give an URL for getting the key and which needs to be entered in the console.
```
$ bx login -sso
```
8. Create a cluster on IBM Container Service
```
$ bx cs cluster-create --name blockchain
```

9. Wait for the cluster to be ready
```
$ bx cs clusters

The process goes through the following lifecycle -requesting–>pending–>deploying–>normal. Initially you will see something similar to the following:
blockchain   7fb45431d9a54d2293bae421988b0080   deploying   2017-05-09T14:55:09+0000   0
Wait for the State to change to normal. Note that this can take upwards of 15-30 minutes. If it takes more than 30 minutes, there is an inner issue on the IBM Container Service.
You should see the following output when the cluster is ready:

$ bx cs clusters
Listing clusters...
OK
Name         ID                                 State    Created                    Workers
blockchain   0783c15e421749a59e2f5b7efdd351d1   normal   2017-05-09T16:13:11+0000   1
```
Use the following syntax to inspect on the status of the workers: Command:
`$ bx cs workers blockchain`

The expected output:
```
$ bx cs workers blockchain
OK
ID                                                 Public IP       Private IP     Machine Type   State    Status   Version
kube-dal12-cra7b094596db34facb8587d256dc54cee-w1   169.47.67.177   10.184.9.157   u1c.2x4        normal   Ready    1.7.4_1502
kube-dal12-cra7b094596db34facb8587d256dc54cee-w2   169.47.67.162   10.184.9.173   u1c.2x4        normal   Ready    1.7.4_1502
kube-dal12-cra7b094596db34facb8587d256dc54cee-w3   169.47.67.178   10.184.9.161   u1c.2x4        normal   Ready    1.7.4_1502
```

10. Configure kubectl to use the cluster
Issue the following command to download the configuration for your cluster:
`$ bx cs cluster-config blockchain`

Output:
```
Downloading cluster config for blockchain
OK
The configuration for blockchain was downloaded successfully. Export environment variables to start using Kubernetes.
export KUBECONFIG=/home/*****/.bluemix/plugins/container-service/clusters/blockchain/kube-config-prod-dal10-blockchain.yml
Theexportcommand in the output must be run as a separate command along with theKUBECONFIGinformation that followed it.
(Replace this example with the output from running the step above!)

$ export KUBECONFIG=/home/*****/.bluemix/plugins/container-service/clusters/blockchain/kube-config-prod-dal10-blockchain.yml
```

##Install with a single script
The Simple Install method is to use the all in one script - create_all.sh - which will call a series of scripts to ultimately bootstrap a blockchain network, join peers to a channel and launch the Composer playground. You can then use Composer Playground to create and deploy Business Networks to your blockchain network.

1. Clone ibm-container-service repository
You’ll be using the config files and scripts from this repository, so start by cloning it to a directory of your choice on your local machine.

```
git clone https://github.com/IBM-Blockchain/ibm-container-service
```

2. Run the script

Navigate to the scripts sub-directory:

```
cd cs-offerings/scripts
./create_all.sh
```

>This script should create all the required setup to connect to IBM Blockchain network.

After completion of the script you can find your Composer Playground and Compose Rest Server running on the following URL
```
- http://EXTERNAL_IP_FOR_COMPOSER_PLAYGROUND:31080
- http://EXTERNAL_ENDPOINT_FOR_REST_SERVER:31090/explorer/
```
