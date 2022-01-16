package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
type Citizen struct {
	ID             string `json:"ID"`
	Name           string `json:"name"`
	Age            int    `json:"age"`
	Dose           int `json:"dose"`
	CertHash	   string `json:"certHash"`
}

// InitLedger adds a base set of assets to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	return nil
}

// CreateCitizen create a new citizen data with given details.
func (s *SmartContract) CreateCitizen(ctx contractapi.TransactionContextInterface, id string, name string, age int, dose int, certHash string) error {
	exists, err := s.CitizenExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the asset %s already exists", id)
	}

	citizen := Citizen{
		ID:            id,
		Name:          name,
		Age:           age,
		Dose:          dose,
		CertHash:      certHash,
	}
	citizenJSON, err := json.Marshal(citizen)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, citizenJSON)
}

// ReadCitizen returns the citizen details stored in the world state with given id.
func (s *SmartContract) ReadCitizen(ctx contractapi.TransactionContextInterface, id string) (*Citizen, error) {
	citizenJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if citizenJSON == nil {
		return nil, fmt.Errorf("the citizen %s does not exist", id)
	}

	var citizen Citizen
	err = json.Unmarshal(citizenJSON, &citizen)
	if err != nil {
		return nil, err
	}

	return &citizen, nil
}

// UpdateCitizen updates an existing citizen details in the world state with provided parameters.
func (s *SmartContract) UpdateCitizen(ctx contractapi.TransactionContextInterface, id string, name string, age int, dose int, certHash string) error {
	exists, err := s.CitizenExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the citizen details %s does not exist", id)
	}

	// overwriting original asset with new asset
	citizen := Citizen{
		ID:            id,
		Name:          name,
		Age:           age,
		Dose:          dose,
		CertHash: 	   certHash,
	}
	citizenJSON, err := json.Marshal(citizen)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, citizenJSON)
}

// citizenExists returns true when citizen with given ID exists in world state
func (s *SmartContract) CitizenExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	citizenJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return citizenJSON != nil, nil
}

// Update Dose updates the dose field of Citizen with given dose number in world state.
func (s *SmartContract) UpdateDose(ctx contractapi.TransactionContextInterface, id string, dose int) error {
	citizen, err := s.ReadCitizen(ctx, id)
	if err != nil {
		return err
	}

	citizen.Dose = dose
	citizenJSON, err := json.Marshal(citizen)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, citizenJSON)
}

// GetAllCitizenDetails returns all citizen found in world state
func (s *SmartContract) GetAllCitizenDetails(ctx contractapi.TransactionContextInterface) ([]*Citizen, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var citizens []*Citizen
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var citizen Citizen
		err = json.Unmarshal(queryResponse.Value, &citizen)
		if err != nil {
			return nil, err
		}
		citizens = append(citizens, &citizen)
	}

	return citizens, nil
}
