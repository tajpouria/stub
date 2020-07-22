package main

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/nsqio/go-nsq"
	"github.com/tajpouria/stub/packages/expiration/utils"
)

// deffredPublishOrderIDToNSQ Calculate substract duration of current date and created order expiresAt
// (if there is an error in parsing order.expiresAt set the duration ORDER_EXPIRATION_WINDOW_SECONDS later)
// deffredPublish order id to NSQ
func deffredPublishOrderIDToNSQ(data utils.OrderCreatedStanEventData, p *nsq.Producer) error {
	// Parse expriseAt(assume to be in format RFC3339) to Time
	exT, exTErr := time.Parse(time.RFC3339, data.ExpiresAt)
	if exTErr != nil {
		log.Println("deffredPublishOrderIDToNSQ:", exTErr.Error())

		// Set expiry Date to ORDER_EXPIRATION_WINDOW_SECONDS environment variable on parsing error
		intOEW, intOEWErr := strconv.ParseInt(os.Getenv("ORDER_EXPIRATION_WINDOW_SECONDS"), 10, 64)
		if intOEWErr != nil {
			return intOEWErr
		}
		exT = time.Now().Add(time.Second * time.Duration(intOEW))
	}

	dur := exT.Sub(time.Now())
	// DeferredPublish to NSQ
	dpErr := p.DeferredPublish("TODO-topic", dur, []byte(data.ID))
	if dpErr != nil {
		return dpErr
	}

	return nil
}
