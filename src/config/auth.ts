export default {
    secret: process.env.SECRET || 'test',
    expiresIn: '7d',
    prf_token: process.env.PRF_TOKEN,
  };
  