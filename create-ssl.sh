#!/bin/bash

if [ ! -d ./ssl ]; then
  mkdir ./ssl
fi

openssl req -x509 -subj "/C=US/ST=Denial/L=Nowhere/O=Dis*" -nodes -days 365 -newkey rsa:2048 -keyout ./ssl/nginx.key -out ./ssl/nginx.crt
