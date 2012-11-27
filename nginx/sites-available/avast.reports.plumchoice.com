	proxy_cache_path  /var/cache/nginx levels=1:2 keys_zone=one:8m max_size=3000m inactive=600m;
	proxy_temp_path /var/tmp;

	# nginx <-> node.js
	upstream avast_reporting_api {
		server 127.0.0.1:3000;
		keepalive 64;
	}

	server {
		listen 80;
		server_name itd-bclark;
		return 301 https://itd-bclark.plumbedford.local$request_uri;
	}

	server {
		listen 443 ssl;

		ssl_certificate /home/bdashrad/csvsrv/nodetest.crt;
		ssl_certificate_key /home/bdashrad/csvsrv/nodetest.key;
		ssl_protocols        SSLv3 TLSv1;
		ssl_ciphers HIGH:!aNULL:!MD5;

		server_name itd-bclark.plumbedford.local;

		root /var/www/;

		error_page 502  /errors/502.html;

#		location ~ ^/(images/|img/|javascript/|js/|css/|stylesheets/|flash/|media/|static/|robots.txt|humans.txt|favicon.ico) {
#			root /usr/local/silly_face_society/node/public;
#			access_log off;
#			expires max;
#		}

		location =/gettoken {
			alias /home/bdashrad/avast-reporting-api/token.txt;
		}

		location /errors {
			internal;
#			alias /usr/local/silly_face_society/node/public/errors;
		}

		location ~ ^/(locales/|report/|tokens/) {
			proxy_redirect off;
			proxy_set_header   X-Real-IP            $remote_addr;
			proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
			proxy_set_header   X-Forwarded-Proto $scheme;
			proxy_set_header   Host                   $http_host;
			proxy_set_header   X-NginX-Proxy    true;
			proxy_set_header   Connection "";
			proxy_http_version 1.1;
			proxy_cache one;
			proxy_cache_key sfs$request_uri$scheme;
			proxy_pass         http://avast_reporting_api;
			proxy_hide_header X-Powered-By;
		}
		
	}
