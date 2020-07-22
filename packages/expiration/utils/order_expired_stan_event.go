package utils

import (
	"encoding/json"
	"io/ioutil"
	"log"

	"github.com/nats-io/stan.go"
)

// OrderExpiredStanEventData Associated stan event data
type OrderExpiredStanEventData struct {
	ID string `json:"id"`
}

// OrderExpiredStanEventPublisher NATS publisher
type OrderExpiredStanEventPublisher interface {
	Publish(data OrderExpiredStanEventData)
}

type orderExpiredStanEventPublisherImp struct {
	sc      stan.Conn
	subject string
}

// NewOrderExpiredStanEventPublisher Retrive NATS publisher
func NewOrderExpiredStanEventPublisher(sc stan.Conn) OrderExpiredStanEventPublisher {
	js, jsErr := ioutil.ReadFile("utils/order-expired-event-schema.json")
	if jsErr != nil {
		panic(jsErr.Error())
	}

	es := stanEventSchema{}
	esErr := json.Unmarshal(js, &es)
	if esErr != nil {
		panic(esErr.Error())
	}

	return &orderExpiredStanEventPublisherImp{sc: sc, subject: es.Subject}
}

// Publish Emit event data to associated stan event subject
func (o *orderExpiredStanEventPublisherImp) Publish(data OrderExpiredStanEventData) {
	d, dErr := json.Marshal(data)
	if dErr != nil {
		log.Println("OrderExpiredStanEventPublisher:", dErr.Error())
	}

	o.sc.Publish(o.subject, []byte(d))
}
