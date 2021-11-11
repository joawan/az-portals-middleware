import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.NODE_PORT || 3000;
const schAccEnv = process.env.SCHACCENV;

const envs = {
  'pre': 'https://identity-pre.schibsted.com',
  'pro-com': 'https://login.schibsted.com',
  'pro-no': 'https://payment.schibsted.no',
};

if (!envs[schAccEnv]) {
  console.error('SCHACCENV must be set');
  exit(1);
}

app.get('/.well-known/openid-configuration', async (req, res) => {
  const r = await fetch(`${envs[schAccEnv]}/.well-known/openid-configuration`);
  const oc = await r.json();
  oc.authorization_endpoint = `${req.protocol}://${req.hostname}/auth`;
  res.json(oc);
});

app.get('/auth', (req, res) => {
  const params = new URLSearchParams(req.query);
  params.append('acr_values', 'otp-email');
  res.redirect(307, `${envs[schAccEnv]}/oauth/authorize?${params.toString()}`);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
