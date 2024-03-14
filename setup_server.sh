# run this on a fresh Ubuntu 22.04 server to set it up for serving the Docker image

# setup nginx to serve the app from port 80
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl start nginx
NGINX_TEMPLATE=$(cat <<'EOF'
server {
    listen 80;
    server_name api.mediaimpactmonitor.app;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
)
echo "$NGINX_TEMPLATE" | sudo tee /etc/nginx/sites-available/default
sudo nginx -t && sudo systemctl reload nginx

# setup SSL with certbot
# sudo certbot --nginx --non-interactive --agree-tos \
#     -d api.mediaimpactmonitor.app \
#     --email david@socialchangelab.org

# install Docker
curl -fsSL https://get.docker.com -o get-docker.sh

# pull the Docker image
sudo docker pull socialchangelab/media-impact-monitor:latest

# run the Docker image
sudo docker run -d -p 80:8000 --name media-impact-monitor socialchangelab/media-impact-monitor:latest
