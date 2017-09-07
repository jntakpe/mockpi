#!/bin/bash
var_server_name=$1
path_to_file="/etc/nginx"
export var_server_name
cd $path_to_file
mv "nginx.conf" "nginx.tmp.conf"
envsubst '\$var_server_name' < "nginx.tmp.conf" > "nginx.conf"
rm "nginx.tmp.conf"