export const config = {
  port: Number(process.env.PORT || 3000),

  brokerMode:
    process.env.BROKER_MODE || 'stub',

  brokerUrl:
    process.env.BROKER_URL ||
    'http://localhost:4000',

  mongoUrl:
    process.env.MONGO_URL ||
    'mongodb://127.0.0.1:27017/ecng2007_p7a'
}
