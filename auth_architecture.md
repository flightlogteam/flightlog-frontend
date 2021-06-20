# Solution 1

- Make an AuthenticationService
  - Should deliver an RXJS observable
  - Observable should give the redux store information about when a request is unauthorized

# Solution 2
Make an httpClient that can be observed. Based on RXJSHttpClient
- Should be singelton
- Should know about authorized paths
- Should be possible to add middlewares for loading-callbacs etc
