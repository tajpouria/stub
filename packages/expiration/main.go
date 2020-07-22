package main

import (
	"log"
	"os"
	"sync"

	"github.com/nats-io/stan.go"
	"github.com/nsqio/go-nsq"
	"github.com/tajpouria/stub/packages/expiration/utils"
)

func main() {
	// TODO:
	os.Setenv("NAME", "expiration-service")
	os.Setenv("GO_ENV", "dev")
	os.Setenv("NATS_CLUSTER_ID", "stub")
	os.Setenv("NATS_CLIENT_ID", "some-id")
	os.Setenv("NSQD_ADDRESS", "127.0.0.1:4150")
	os.Setenv("ORDER_EXPIRATION_WINDOW_SECONDS", "900")

	wg := sync.WaitGroup{}
	wg.Add(1)

	// Verify required environment variables existence
	envVarErr := utils.AllEnvVarsExists([]string{"NAME", "GO_ENV", "NATS_CLUSTER_ID", "NATS_CLIENT_ID", "NSQD_ADDRESS", "ORDER_EXPIRATION_WINDOW_SECONDS"})
	if envVarErr != nil {
		panic(envVarErr.Error())
	}

	// Establish NATS connection
	cid := os.Getenv("NATS_CLUSTER_ID")
	sc, scErr := stan.Connect(cid, os.Getenv("NATS_CLIENT_ID"), stan.Pings(10, 5), stan.SetConnectionLostHandler(func(_ stan.Conn, err error) {
		panic(err.Error())
	}))
	if scErr != nil {
		panic(scErr.Error())
	}
	log.Printf("NATSConnection: Connection established to %s\n", cid)
	// Notify NATS from connection status
	utils.CloseNATSConnectionOnForceStop(sc)

	// Initialized NSQ producers
	pConfig := nsq.NewConfig()
	NSQDAddr := os.Getenv("NSQD_ADDRESS")
	p, pErr := nsq.NewProducer(NSQDAddr, pConfig)
	if pErr != nil {
		panic(pErr.Error())
	}

	// Intialized NATS listeners
	utils.OnOrderCreatedStanEvent(sc, func(data utils.OrderCreatedStanEventData, m *stan.Msg) {
		dpErr := deffredPublishOrderIDToNSQ(data, p)
		if dpErr != nil {
			// Acknowledge NATS on successfully DeferredPublish to NSQ
			panic(dpErr.Error())
		} else {
			m.Ack()
		}
	})

	// Initialize NSQ consumers
	orderExpiredC, orderExpiredCErr := utils.NewOrderExpiredNSQConsumer()
	if orderExpiredCErr != nil {
		panic(orderExpiredCErr.Error())
	}

	// Initialize NSQ Handlers
	orderExpiredC.AddHandler(nsq.HandlerFunc(func(message *nsq.Message) error {
		log.Println("NSQ message received:")
		log.Println(string(message.Body))
		return nil
	}))

	// Establish NSQD Connections
	orderExpiredNSQDConnErr := orderExpiredC.ConnectToNSQD(NSQDAddr)
	if orderExpiredNSQDConnErr != nil {
		panic(orderExpiredNSQDConnErr)
	}
	log.Printf("orderExpiredNSQDConnErr: Connection established to %s\n", NSQDAddr)

	// Keep main go routine on waiting state
	wg.Wait()
}
