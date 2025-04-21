# Create/deploy xsuaa instance
```
cf create-service xsuaa application github-pages-auth -c xs-security.json
```

# Update xsuaa
```
cf update-service github-pages-auth -c xs-security.json
```