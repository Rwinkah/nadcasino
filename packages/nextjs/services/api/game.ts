import { type PlinkoPlay } from "./game-types";
import api from "./http";

export class Game {
  async post_plinko_multiplier(data: any): Promise<PlinkoPlay> {
    return api.post("/plinko/play", data);
  }
  async post_report_collision(player: any): Promise<any> {
    return api.post("/report-collision", { player: player });
  }

  async post_molandak_highscore(data: any): Promise<any> {
    return api.post("/molandakrun-highscore", data);
  }

  async post_molandak_jump(player: any): Promise<any> {
    return api.post("/molandakrun-jump", { player: player });
  }
}
