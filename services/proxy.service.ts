import axios from 'axios';

const getProxyUser = async () => {
  const apiUrl = 'https://proxy.webshare.io/api/v2/proxy/list/?mode=direct&page=1&page_size=25';
  const apiKey = 'examplekey';

  const headers = {
    Authorization: `Token ${apiKey}`,
  };

  const response = await axios.get(apiUrl, { headers });
  return response.data.results[0];
};

const createProxyUser = async ({ creatorId }) => {
  const proxyUserApiUrl = 'https://dashboard.iproyal.com/api/residential/royal/reseller/sub-users';
  const proxyCredsApiUrl = 'https://dashboard.iproyal.com/api/residential/royal/reseller/access/generate-proxy-list';
  const proxyProtocol = 'http|https';

  const proxyUser = await axios.post(
    proxyUserApiUrl,
    {
      username: creatorId,
      password: creatorId,
      traffic: 0.03,
    },
    {
      headers: {
        'X-Access-Token': 'Bearer tokenabc',
      },
    },
  );
  const proxyCreds = await axios.post(
    proxyCredsApiUrl,
    {
      username: proxyUser.data.username,
      password: proxyUser.data.password,
      proxyCount: 1,
      rotation: 'random',
      location: '_country-us',
      highEndPool: true,
      format: '{hostname}:{port}@{username}:{password}',
      port: proxyProtocol,
    },
    {
      headers: {
        'X-Access-Token': 'Bearer saasdasdasd',
      },
    },
  );

  const proxyStr = proxyCreds.data[0];

  const [hostPortString, userPassString] = proxyStr.split('@');
  const [hostname, port] = hostPortString.split(':');
  const [username, password] = userPassString.split(':');

  const proxyObj = {
    proxy_user: {
      username,
      user_pass: proxyUser.data.password,
    },
    proxy: {
      username,
      hostname,
      port: parseInt(port),
      password,
      protocol: proxyProtocol,
    },
  };

  return proxyObj;
};

export { getProxyUser, createProxyUser };
