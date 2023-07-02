import { DEFAULT_ROBOT, Direction, Robot, SimulatedRobot } from './model';

export class RobotService {
    // This would be obtained via a database and not be dependent on the instance of the class
    _robots: Map<number, Robot> = new Map<number, Robot>();
    // dodgy way of locking robots to prevent race conditions
    _lockedRobots: Set<number> = new Set<number>();
    constructor() {
        this._robots.set(1, DEFAULT_ROBOT);
    }

    public async getRobotById(id: number): Promise<Robot> {
        const robot: Robot | undefined = this._robots.get(id);

        if (!robot) {
            this._lockedRobots.delete(id);
            throw new Error(`Robot with id ${id} not found`);
        }

        return robot;
    }

    public async moveRobotInDirection(
        id: number,
        direction: Direction
    ): Promise<Robot> {
        const tempRobot: SimulatedRobot = { ...(await this.getRobotById(id)) };

        this.moveSimulatedRobot(tempRobot, direction);

        this._robots.set(id, tempRobot);

        return tempRobot;
    }

    public async moveRobotInDirections(
        id: number,
        directions: Direction[]
    ): Promise<Robot> {
        await this.waitAndLockRobot(id);
        const simulatedRobot: SimulatedRobot = {
            ...(await this.getRobotById(id)),
        };

        directions.forEach((direction) => {
            this.moveSimulatedRobot(simulatedRobot, direction);
        });

        await this.setAndUnlockRobot(simulatedRobot);

        return simulatedRobot;
    }

    private moveSimulatedRobot(
        simulatedRobot: SimulatedRobot,
        direction: Direction
    ): SimulatedRobot {
        switch (direction) {
            case 'N':
                simulatedRobot.y += 1;
                break;
            case 'S':
                simulatedRobot.y -= 1;
                break;
            case 'E':
                simulatedRobot.x += 1;
                break;
            case 'W':
                simulatedRobot.x -= 1;
                break;
        }

        this.validateMove(simulatedRobot, direction);

        return simulatedRobot;
    }

    // This would be tied to a warehouse service and not hard coded
    /// Would require a refactor but time limits and priorities
    validateMove(robot: Robot, direction: Direction): boolean {
        if (robot.x >= 0 && robot.x < 10 && robot.y >= 0 && robot.y < 10) {
            return true;
        }

        this._lockedRobots.delete(robot.id);
        throw new Error(`Robot with id ${robot.id} is out of bounds when moving ${direction}. 
        Illegal Position: x:${robot.x} y:${robot.y}`);
    }

    private async waitAndLockRobot(id: number): Promise<void> {
        if (this._lockedRobots.has(id)) {
            await this.waitForLock(id);
        }

        this._lockedRobots.add(id);
    }

    private async setAndUnlockRobot(
        simulatedRobot: SimulatedRobot
    ): Promise<void> {
        this._robots.set(simulatedRobot.id, simulatedRobot);
        this._lockedRobots.delete(simulatedRobot.id);
    }

    private waitForLock(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            let limit = 10;
            const interval = setInterval(() => {
                if (!this._lockedRobots.has(id)) {
                    clearInterval(interval);
                    resolve();
                }

                if (limit === 0) {
                    throw new Error(
                        `Robot with id ${id} is locked and cannot currently be moved.`
                    );
                }
                limit--;
            }, 100);
        });
    }
}
