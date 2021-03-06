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
	log.Printf("NATSConn: Connection established to %s\n", cid)
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
		go func() {
			dpErr := deffredPublishOrderIDToNSQ(data, p)
			if dpErr != nil {
				log.Println("OnOrderCreatedStanEvent:", dpErr.Error())
			} else {
				// Acknowledge NATS on successfully DeferredPublish to NSQ
				m.Ack()
			}
		}()
	})

	// Initialize NSQ consumers
	orderExpiredC, orderExpiredCErr := utils.NewOrderExpiredNSQConsumer()
	if orderExpiredCErr != nil {
		panic(orderExpiredCErr.Error())
	}

	// Initialize NATS publishers
	orderExpiredP := utils.NewOrderExpiredStanEventPublisher(sc)

	// Initialize NSQ Handlers
	orderExpiredC.AddHandler(nsq.HandlerFunc(func(message *nsq.Message) error {
		go publishExpiredOrderIDStanEvent(string(message.Body), orderExpiredP)
		return nil
	}))

	// Establish NSQD Connections
	orderExpiredNSQDConnErr := orderExpiredC.ConnectToNSQD(NSQDAddr)
	if orderExpiredNSQDConnErr != nil {
		panic(orderExpiredNSQDConnErr)
	}
	log.Printf("orderExpiredNSQDConn: Connection established to %s\n", NSQDAddr)

	// Keep main go routine on waiting state
	wg.Wait()
}
