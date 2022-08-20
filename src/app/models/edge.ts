import { Position } from "./position";

export interface Edge {
    p1: Position;
    p2: Position;
    label?: string;
}
