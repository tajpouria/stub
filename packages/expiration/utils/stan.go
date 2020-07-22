package utils

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nats-io/stan.go"
)

// CloseNATSConnectionOnForceStop Invoke NATS connection.close on Force stop signals
func CloseNATSConnectionOnForceStop(sc stan.Conn) {
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)
	go func(sc stan.Conn) {
		<-signalChan
		sc.Close()
		log.Fatal("CloseNATSConnectionOnForceStop: Force stop")
	}(sc)
}

// GetAckWaitDuration Retrive duration from NATS_ACK_WAIT_DURATION environment variable or default '5s' value
func GetAckWaitDuration() time.Duration {
	const deafultAckWaitDuration = "5s"

	dur, durExists := os.LookupEnv("NATS_ACK_WAIT_DURATION")
	if !durExists {
		dur = deafultAckWaitDuration
	}

	aw, awErr := time.ParseDuration(dur)
	if awErr != nil {
		log.Println(awErr.Error())
	}

	return aw
}

// stanEventSchema common stan event props
type stanEventSchema struct {
	Subject string `json:"subject"`
}
