# az-portals-middleware

Tiny middleware with two endpoints to support adding acr_values to portals requests.

This is just a gist on how to solve adding more parameters to the request to
your idP of choice, since Azure Portals does not support additional query params.

Run it by setting `IDP_BASE`, e.g `IDP_BASE="https://my.idp.com"`, which should be
site hosting the discovery information, `.well-known/openid-configuration`.

Example
```bash
$ IDP_BASE="https://my.idp.com" npm start
```
