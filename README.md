# idem-exchange
A demo site for Idem workflow

## Installation
The site is run behind nginx reverse proxy on a DigitalOcean droplet running as the user `idem`.  `159.223.92.216`

```json
       location / {
               proxy_pass http://localhost:3000/;
       }

       location /ws/ {
               proxy_pass http://localhost:3002/;
       }

       location /api/ {
               proxy_pass http://localhost:3001/;
       }

```