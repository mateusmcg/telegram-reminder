#!/bin/bash

date

curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://api-sgv.azurewebsites.net/
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://api-sgv-release.azurewebsites.net/
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://api-sgv-develop.azurewebsites.net/
