package utils

import "github.com/nsqio/go-nsq"

// OrderExpiredNSQTitle NSQ consumer title
const OrderExpiredNSQTitle = "order-expired"

// NewOrderExpiredNSQConsumer Retrive the NSQ consumer
func NewOrderExpiredNSQConsumer() (*nsq.Consumer, error) {
	cConfig := nsq.NewConfig()
	c, cErr := nsq.NewConsumer(OrderExpiredNSQTitle, "channel", cConfig)
	if cErr != nil {
		return c, cErr
	}
	return c, nil
}
