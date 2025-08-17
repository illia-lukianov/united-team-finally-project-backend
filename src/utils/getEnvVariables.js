export default function getEnvVariables(name) {
  const value = process.env[name];
  return value;
}
