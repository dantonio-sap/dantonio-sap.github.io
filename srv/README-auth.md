# Create/deploy xsuaa instance
```
cf create-service xsuaa application btp-ai-best-practices-auth -c xs-security.json
```

# Update xsuaa
```
cf update-service btp-ai-best-practices-auth -c xs-security.json
```