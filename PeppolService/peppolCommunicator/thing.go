package main

import (
	//"bytes"
	_ "embed"
	//"fmt"
	//"html/template"
	//"io"
	//"net/http"
	//"net/url"
	//"sort"
	//"strconv"
	//"strings"
	//"sync"
	//"time"
	"log"

	"github.com/sdoque/mbaigo/components"
	//"github.com/sdoque/mbaigo/forms"
	"github.com/sdoque/mbaigo/usecases"
)

type UnitAsset struct {
	Name        string              `json:"name"`
	Owner       *components.System  `json:"-"`
	Details     map[string][]string `json:"details"`
	ServicesMap components.Services `json:"-"`
	CervicesMap components.Cervices `json:"-"`
}

func (ua *UnitAsset) GetName() string { return ua.Name }

func (ua *UnitAsset) GetServices() components.Services { return ua.ServicesMap }

func (ua *UnitAsset) GetCervices() components.Cervices { return ua.CervicesMap }

func (ua *UnitAsset) GetDetails() map[string][]string { return ua.Details }

func (ua *UnitAsset) GetTraits() any {
	return nil
}

var _ components.UnitAsset = (*UnitAsset)(nil)

func initTemplate() components.UnitAsset {
	service := components.Service{
		Definition:  "peppolCommunicator",
		SubPath:     "peppolCommunicator",
		Details:     map[string][]string{"Forms": {"SystemMessage_v1"}},
		RegPeriod:   30,
		Description: "",
	}
	return &UnitAsset{
		Name:        "log",
		Details:     map[string][]string{},
		ServicesMap: components.Services{service.SubPath: &service},
	}
}

func newResource(ca usecases.ConfigurableAsset, sys *components.System) (components.UnitAsset, func(), error) {
	ua := &UnitAsset{
		Name:        ca.Name,
		Owner:       sys,
		Details:     ca.Details,
		ServicesMap: usecases.MakeServiceMap(ca.Services),
	}
	var err error
	err = nil
	// Return the unit asset and a cleanup function to close the InfluxDB client
	return ua, func() {
		log.Println("Waiting for all goroutines to finish...")
		//wg.Wait()
		//ua.client.Close()
	}, err
}