import { ArcEval } from "./server/endpoint/store";
import { makeServer } from "./server/main";

makeServer(3333, "ArcOS", ArcEval);
