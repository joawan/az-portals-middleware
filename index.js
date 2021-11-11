import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.NODE_PORT || 3000;
const idPBaseUrl = new URL(process.env.IDP_BASE); //Will throw on invalid url

const cache = {};

const getOpenIdConf = async (conf) => {
  if (!conf.cached || !cache.openIdConfig) {
    const r = await fetch(`${idPBaseUrl}/.well-known/openid-configuration`);
    cache.openIdConfig = await r.json();
  }
  return cache.openIdConfig;
}

app.get('/.well-known/openid-configuration', async (req, res) => {
  const openIdConf = await getOpenIdConf({cached: false});
  res.json({
    ...openIdConf,
    ...{ authorization_endpoint: `${req.protocol}://${req.hostname}/auth` },
  });
});

app.get('/auth', async (req, res) => {
  const openIdConf = await getOpenIdConf({cached: true});
  const params = new URLSearchParams(req.query);
  params.set('acr_values', 'otp-email'); // The query param to set or override
  res.redirect(307, `${openIdConf.authorization_endpoint}?${params.toString()}`);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
