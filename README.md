# Firegame

### update godaddy nameservers

url like this https://dns.godaddy.com/somuchcinnamon.com/nameservers
nameservers `carlos.ns.cloudflare.com` and `naya.ns.cloudflare.com`

### setup static external ip

(persistent is 34.121.39.159)
`https://console.cloud.google.com/networking/addresses/list`

### use static ip for A type content field

`https://dash.cloudflare.com/a1bc7ea0fb518f09ae19091140583131/somuchcinnamon.com/dns`

### always use https

`https://dash.cloudflare.com/a1bc7ea0fb518f09ae19091140583131/somuchcinnamon.com/ssl-tls/edge-certificates`

### wait for ssl cert to be deployed

edge certificate needs to be active
sometimes takes 24 hours
`https://dash.cloudflare.com/a1bc7ea0fb518f09ae19091140583131/somuchcinnamon.com/ssl-tls/edge-certificates`
