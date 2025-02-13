export interface PlinkoPlay {
  multiplier: { [key: string]: string };
  server_seed_hash: string;
  client_seed: string;
  hash: string;
}

export interface PlinkoInterface {
  stressTest: boolean;
}
