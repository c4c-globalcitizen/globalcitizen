# globalcitizen
Call4Code Global Citizen challenge submission

Execute below commands to start the application:

Extract the global-citizen-new.zip 

npm install


composer network install --card PeerAdmin@hlfv1 --archiveFile global-citizens-network@0.0.1.bna


composer network start --networkName global-citizens-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card


composer card import --file networkadmin.card


composer network ping --card admin@global-citizens-network


composer-rest-server

npm start – this should be run inside the angular project “global-citizens-network”
