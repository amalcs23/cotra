/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg, buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'basic';
var mspOrg;
const mspOrg1 ="Org1MSP";
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser1';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function gatewayFun(org,user){
	const ccp = buildCCPOrg(org);
	const wallet = await buildWallet(Wallets, walletPath);
	const gateway = new Gateway();
	var contract;
	try {
		// setup the gateway instance
		// The user will now be able to create connections to the fabric network and be able to
		// submit transactions and query. All transactions submitted by this gateway will be
		// signed by this user using the credentials stored in the wallet.
		await gateway.connect(ccp, {
			wallet,
			identity: user,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		contract = network.getContract(chaincodeName);
	}
	catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
	return contract;
	
}


exports.enrollAdmin = async (org) => {
	const ccp = buildCCPOrg(org);
	mspOrg = 'Org'+org+'MSP';
	const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org'+org+'.example.com');
	const wallet = await buildWallet(Wallets, walletPath);
	await enrollAdmin(caClient, wallet, mspOrg);
}

exports.enrollUser = async (org, user) => {
	const ccp = buildCCPOrg(org);
	mspOrg = 'Org'+org+'MSP';
	const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org'+org+'.example.com');
	const wallet = await buildWallet(Wallets, walletPath);
	await registerAndEnrollUser(caClient, wallet, mspOrg, user, 'org'+org+'.department1');
}

exports.InitLedger = async (org, user) => {
	var contract = await gatewayFun(org, user);
	try{
	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	await contract.submitTransaction('InitLedger');
	}catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
	console.log('*** Result: committed');
}

exports.InitLedger = async (org, user) => {
	var contract = await gatewayFun(org, user);
	try{
	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	await contract.submitTransaction('InitLedger');
	}catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
	console.log('*** Result: committed');
}

exports.CreateCitizen = async (org, user,id, name, age, dose, certHash) => {
	var contract = await gatewayFun(org, user);
	var result;
	try{
		console.log('\n--> Submit Transaction: CreateCitizen, creates new asset with ID, Name, Age, Dose, and CertHash arguments');
		result = await contract.submitTransaction('CreateCitizen', id, name, age, dose, certHash);
		console.log('*** Result: committed');
		if (`${result}` !== '') {
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		}
	}catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
	return result;
}

exports.ReadCitizen = async (org, user,id) => {
	var contract = await gatewayFun(org, user);
	var result;
	try{
		console.log('\n--> Evaluate Transaction: ReadCitizen, function returns an citizen with a given ID');
		result = await contract.evaluateTransaction('ReadCitizen', id);
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);
	}catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
	return prettyJSONString(result.toString());
}

exports.UpdateCitizen = async (org, user, id, name, age, dose, certHash) => {
	var contract = await gatewayFun(org, user);
	try{
		console.log('\n--> Submit Transaction: UpdateCitizen, updatecitizen with ID, Name, Age, Dose, and CertHash arguments');
		let result = await contract.submitTransaction('UpdateCitizen', id, name, age, dose, certHash);
		console.log('*** Result: committed');
		if (`${result}` !== '') {
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		}
	}catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

exports.UpdateDose = async (org, user, id, dose) => {
	var contract = await gatewayFun(org, user);
	var result;
	try{
		console.log('\n--> Submit Transaction: UpdateDos update dose data for given  ID');
		result = await contract.submitTransaction('UpdateDose', id, dose);
		console.log('*** Result: committed');
		if (`${result}` !== '') {
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		}
	}catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
	return result;
}





exports.main = async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			// console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
			// await contract.submitTransaction('InitLedger');
			// console.log('*** Result: committed');

			// // Let's try a query type operation (function).
			// // This will be sent to just one peer and the results will be shown.
			// console.log('\n--> Evaluate Transaction: GetAllCitizenDetails, function returns all the current assets on the ledger');
			// let result = await contract.evaluateTransaction('GetAllCitizenDetails');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// Now let's try to submit a transaction.
			// This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
			// to the orderer to be committed by each of the peer's to the channel ledger.
			// console.log('\n--> Submit Transaction: CreateCitizen, creates new asset with ID, Name, Age, Dose, and CertHash arguments');
			// let result = await contract.submitTransaction('CreateCitizen', '10001', 'Anoop', '21', '1', '');
			// console.log('*** Result: committed');
			// if (`${result}` !== '') {
			// 	console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			// }

			console.log('\n--> Evaluate Transaction: ReadCitizen, function returns an citizen with a given ID');
			result = await contract.evaluateTransaction('ReadCitizen', '1000');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
			// result = await contract.evaluateTransaction('AssetExists', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
			// await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
			// console.log('*** Result: committed');

			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			// result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// try {
			// 	// How about we try a transactions where the executing chaincode throws an error
			// 	// Notice how the submitTransaction will throw an error containing the error thrown by the chaincode
			// 	console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');
			// 	await contract.submitTransaction('UpdateAsset', 'asset70', 'blue', '5', 'Tomoko', '300');
			// 	console.log('******** FAILED to return an error');
			// } catch (error) {
			// 	console.log(`*** Successfully caught the error: \n    ${error}`);
			// }

			// console.log('\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom');
			// await contract.submitTransaction('TransferAsset', 'asset1', 'Tom');
			// console.log('*** Result: committed');

			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			// result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

//main();
