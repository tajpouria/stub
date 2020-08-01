package utils

import (
	"encoding/json"
	"io/ioutil"

	"github.com/nats-io/stan.go"
)

// OrderCreatedStanEventData Associated stan event data
type OrderCreatedStanEventData struct {
	ID        string `json:"id"`
	ExpiresAt string `json:"expiresAt"`
}

// OnOrderCreatedStanEvent Invoke the callback function on associated stan event
func OnOrderCreatedStanEvent(sc stan.Conn, cb func(data OrderCreatedStanEventData, m *stan.Msg)) {
	js, jsErr := ioutil.ReadFile("utils/order-created-event-schema.json")
	if jsErr != nil {
		panic(jsErr.Error())
	}

	newStanListener(sc, js).OnMessage(func(m *stan.Msg) {
		data := OrderCreatedStanEventData{}
		dataErr := json.Unmarshal(m.Data, &data)
		if dataErr != nil {
			panic(dataErr.Error())
		}

		cb(data, m)
	})
}
