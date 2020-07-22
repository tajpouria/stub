package utils

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/nats-io/stan.go"
	"github.com/xeipuuv/gojsonschema"
)

type stanListener interface {
	OnMessage(cb func(m *stan.Msg))
}

type stanListenerImpl struct {
	sc              stan.Conn
	jsonSchemaFile  []byte
	ackWaitDuration time.Duration
}

// newStanListener Retrieve new stanListener
func newStanListener(sc stan.Conn, jsonSchemaFile []byte) stanListener {
	return &stanListenerImpl{
		sc:              sc,
		jsonSchemaFile:  jsonSchemaFile,
		ackWaitDuration: GetAckWaitDuration(),
	}
}

// OnMessage Receive a callback and Invoke it after associated JSONSChema validation process
func (l stanListenerImpl) OnMessage(cb func(m *stan.Msg)) {
	n, sc, js, aw := os.Getenv("NAME"), l.sc, l.jsonSchemaFile, l.ackWaitDuration
	es := stanEventSchema{}
	esErr := json.Unmarshal(js, &es)
	if esErr != nil {
		log.Println("StanListener:", esErr.Error())
	}

	_, qsErr := sc.QueueSubscribe(es.Subject, n, func(m *stan.Msg) {
		schemaLoader, documentLoader := gojsonschema.NewStringLoader(string(js)), gojsonschema.NewStringLoader(string(m.Data))

		res, resErr := gojsonschema.Validate(schemaLoader, documentLoader)
		if resErr != nil {
			log.Println("StanListener:", resErr.Error())
		}

		if res.Valid() {
			cb(m)
		} else {
			log.Printf("gojsonschema: '%s' Event associated data is not valid. see errors:\n", es.Subject)
			for _, desc := range res.Errors() {
				log.Printf("- %s\n", desc)
			}
		}

	}, stan.SetManualAckMode(), stan.AckWait(aw), stan.DurableName(n))
	if qsErr != nil {
		log.Println("StanListener:", qsErr)
	}

	log.Printf("StanListener: QueueSubscribed to subject: '%s', qg: '%s'\n", es.Subject, n)
}
