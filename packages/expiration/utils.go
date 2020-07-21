package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/nats-io/stan.go"
)

// allEnvVarsExists retrieve nill if all specified variables
// exists in environment otherwise fullfill error
func allEnvVarsExists(vars []string) error {
	for _, v := range vars {
		_, exists := os.LookupEnv(v)
		if !exists {
			return fmt.Errorf("allEnvVarsExists: Required environment variable '%s' not exists", v)
		}
	}
	return nil
}

// closeNATSConnectionOnForceStop Invoke NATS connection.close on Force stop signals
func closeNATSConnectionOnForceStop(sc stan.Conn) {
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)
	go func(sc stan.Conn) {
		<-signalChan
		sc.Close()
		log.Fatal(fmt.Errorf("closeNATSConnectionOnForceStop: Force stop"))
	}(sc)
}
