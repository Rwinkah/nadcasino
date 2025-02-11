import { type PlinkoPlay } from "./game-types";
import api from "./http";

export class Game {
  async get_plinko_multiplier(data: any): Promise<PlinkoPlay> {
    return api.post("/plinko/play", data);
  }
}
