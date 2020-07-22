package main

import "github.com/tajpouria/stub/packages/expiration/utils"

// publishExpiredOrderIDStanEvent publish order expired stan event
func publishExpiredOrderIDStanEvent(orderID string, orderExpiredP utils.OrderExpiredStanEventPublisher) {
	orderExpiredP.Publish(utils.OrderExpiredStanEventData{ID: orderID})
}
