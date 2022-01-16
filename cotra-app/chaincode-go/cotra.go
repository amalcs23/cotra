/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric-samples/cotra-app/chaincode-go/chaincode"
)

func main() {
	cotraChaincode, err := contractapi.NewChaincode(&chaincode.SmartContract{})
	if err != nil {
		log.Panicf("Error creating cotra-app chaincode: %v", err)
	}

	if err := cotraChaincode.Start(); err != nil {
		log.Panicf("Error starting cotra-app chaincode: %v", err)
	}
}
