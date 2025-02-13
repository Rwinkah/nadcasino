import { type PlinkoPlay } from "./game-types";
import api from "./http";

export class Game {
  async post_plinko_multiplier(data: any): Promise<PlinkoPlay> {
    return api.post("/plinko/play", data);
  }
  async get_report_collision(): Promise<any> {
    return api.get("/report-collision");
  }
}
