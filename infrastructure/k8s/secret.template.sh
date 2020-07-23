#!/bin/bash

kubectl create secret generic stub-secret --from-literal=GOOGLE_CLIENT_ID=XXX --from-literal=XXX --from-literal=JWT_SECRET=XXX --from-literal=MAILER='{"service": "gmail", "auth": {"user": "XXX", "pass": "XXX"}}'
