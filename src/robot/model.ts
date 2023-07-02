export interface SimulatedRobot {
    readonly id: number;
    name: string;
    warehouseId: number;
    x: number;
    y: number;
}

export type Robot = Readonly<SimulatedRobot>;

export type Direction = 'N' | 'S' | 'E' | 'W';

export const DEFAULT_ROBOT: Robot = {
    id: 1,
    name: 'Default Robot',
    warehouseId: 1,
    x: 0,
    y: 0,
};
