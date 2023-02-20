export const configs = {
  awsConfigs: {
    options: {
      region: "us-east-1",
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    bucket: process.env.S3_BUCKET,
  },
};

function getOrThrow(envVariableName) {
  if (!process.env[envVariableName])
    throw new Error(`Env Variable ${envVariableName} is missing`);
  return process.env[envVariableName];
}
