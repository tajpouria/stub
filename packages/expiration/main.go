package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"time"

	"github.com/nats-io/stan.go"
	"github.com/xeipuuv/gojsonschema"
)

type eventSchema struct {
	Subject string `json:"subject"`
}

func main() {
	// Verify required environment variables existence
	envVarErr := allEnvVarsExists([]string{"NAME", "GO_ENV", "NATS_CLUSTER_ID", "NATS_CLIENT_ID"})
	if envVarErr != nil {
		panic(envVarErr.Error())
	}

	// Establish NATS connection
	sc, stanConnectionErr := stan.Connect(os.Getenv("NATS_CLUSTER_ID"), os.Getenv("NATS_CLIENT_ID"))
	if stanConnectionErr != nil {
		panic(stanConnectionErr.Error())
	}

	// Notify NATS from connection status
	closeNATSConnectionOnForceStop(sc)

	// NATS subscribers
	dur, durExists := os.LookupEnv("NATS_ACK_WAIT_DURATION")
	if !durExists {
		dur = "5s"
	}
	aw, awErr := time.ParseDuration(dur)
	if awErr != nil {
		panic(awErr.Error())
	}

	file, readFileErr := ioutil.ReadFile("event-schema.json")
	if readFileErr != nil {
		panic(readFileErr.Error())
	}

	es := eventSchema{}
	json.Unmarshal(file, &es)

	n := os.Getenv("NAME")
	_, subErr := sc.QueueSubscribe(es.Subject, n, func(m *stan.Msg) {
		d := string(m.Data)

		schemaLoader, documentLoader := gojsonschema.NewStringLoader(string(file)), gojsonschema.NewStringLoader(d)
		res, resErr := gojsonschema.Validate(schemaLoader, documentLoader)
		if resErr != nil {
			panic(resErr.Error())
		}

		if res.Valid() {
			// DO THE STUFF
		} else {
			log.Printf("gojsonschema: '%s' Event associated data is not valid. see errors:\n", es.Subject)
			for _, desc := range res.Errors() {
				log.Printf("- %s\n", desc)
			}
		}

	}, stan.SetManualAckMode(), stan.AckWait(aw), stan.DurableName(n))
	if subErr != nil {
		log.Println(subErr)
	}

}
