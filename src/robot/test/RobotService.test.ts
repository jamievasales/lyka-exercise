import { RobotService } from '../RobotService';
import assert from 'assert';

describe('RobotService', () => {
    it('should get robot by id', async function () {
        const robotService: RobotService = new RobotService();
        const robot = await robotService.getRobotById(1);

        assert(robot.id === 1);
    });

    it('should throw exception when robot not found', async function () {
        const robotService: RobotService = new RobotService();

        await expect(robotService.getRobotById(2)).rejects.toThrowError();
    });

    it('should move robot when within parameters', async function () {
        const robotService: RobotService = new RobotService();
        const robot = await robotService.moveRobotInDirection(1, 'N');

        assert(robot.y === 1);
    });

    it('should through exception when robot moving outside parameters', async function () {
        const robotService: RobotService = new RobotService();

        await expect(
            robotService.moveRobotInDirection(1, 'S')
        ).rejects.toThrowError();
    });

    it('should move robot in multiple directions', async function () {
        const robotService: RobotService = new RobotService();
        const robot = await robotService.moveRobotInDirections(1, [
            'N',
            'E',
            'W',
        ]);

        expect(robot.x).toBe(0);
        expect(robot.y).toBe(1);
    });

    it('should through exception when robot moving outside parameters', async function () {
        const robotService: RobotService = new RobotService();

        await expect(
            robotService.moveRobotInDirections(1, ['S', 'W'])
        ).rejects.toThrowError();
    });

    it('should lock robot move simulations when there are concurrent requests', async function () {
        const robotService: RobotService = new RobotService();
        await Promise.all([
            robotService.moveRobotInDirections(1, ['N', 'E']),
            robotService.moveRobotInDirections(1, ['N', 'E']),
            robotService.moveRobotInDirections(1, ['S', 'E']),
            robotService.moveRobotInDirections(1, ['W', 'S']),
        ]);

        const robot = await robotService.getRobotById(1);

        expect(robot.x).toBe(2);
        expect(robot.y).toBe(0);
    });
});
