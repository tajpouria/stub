package main

import (
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/nats-io/stan.go"
	"github.com/tajpouria/stub/packages/expiration/utils"
)

func main() {
	// TODO:
	os.Setenv("NAME", "expiration-service")
	os.Setenv("GO_ENV", "dev")
	os.Setenv("NATS_CLUSTER_ID", "stub")
	os.Setenv("NATS_CLIENT_ID", "some-id")

	// Verify required environment variables existence
	envVarErr := utils.AllEnvVarsExists([]string{"NAME", "GO_ENV", "NATS_CLUSTER_ID", "NATS_CLIENT_ID"})
	if envVarErr != nil {
		panic(envVarErr.Error())
	}

	// Establish NATS connection
	cid := os.Getenv("NATS_CLUSTER_ID")
	sc, stanConnectionErr := stan.Connect(cid, os.Getenv("NATS_CLIENT_ID"), stan.Pings(10, 5), stan.SetConnectionLostHandler(func(_ stan.Conn, err error) {
		log.Fatalf("NATSConnectionLost: %v", err)
	}))
	if stanConnectionErr != nil {
		panic(stanConnectionErr.Error())
	}
	log.Printf("NATSConnection: Connected to %s", cid)

	// Intialized NATS listeners
	utils.OnOrderCreatedStanEvent(sc, func(data utils.OrderCreatedStanEventData, m *stan.Msg) {
		fmt.Println(data.ID)
		m.Ack()
	})

	// Notify NATS from connection status
	utils.CloseNATSConnectionOnForceStop(sc)

	wg := sync.WaitGroup{}
	wg.Add(1)
	wg.Wait()
}
