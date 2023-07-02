import { Router, Request, Response, NextFunction } from 'express';
import typia from 'typia';
import { Direction, Robot } from './model';
import { RobotService } from './RobotService';

export const RobotRouter: Router = Router();

const robotService: RobotService = new RobotService();

const validateId = (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).send(`Invalid robot id ${req.params.id}`);

    next();
};

const validateDirection = (req: Request, res: Response, next: NextFunction) => {
    try {
        typia.assertEquals<Direction>(req.params.direction);
    } catch (e: any) {
        console.error(e);
        return res
            .status(400)
            .send(`Invalid direction ${req.params.direction}`);
    }

    next();
};

const validateDirections = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const directions = req.body?.directions;

    try {
        typia.assertEquals<Direction[]>(directions);
    } catch (e: any) {
        console.error(e);
        return res.status(400).send(`Invalid directions ${directions}`);
    }

    next();
};

RobotRouter.post(
    '/:id/:direction',
    validateId,
    validateDirection,
    async (req, res: Response<Robot | string>) => {
        const direction = req.params.direction;
        const id = Number(req.params.id);

        try {
            const movedPosition = await robotService.moveRobotInDirection(
                id,
                direction as Direction
            );
            return res.send(movedPosition);
        } catch (e: any) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    }
);

RobotRouter.post(
    '/:id',
    validateId,
    validateDirections,
    async (req, res: Response<Robot | string>) => {
        const directions = req.body?.directions;
        const id = Number(req.params.id);

        try {
            const movedPosition = await robotService.moveRobotInDirections(
                id,
                directions as Direction[]
            );
            return res.send(movedPosition);
        } catch (e: any) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    }
);

RobotRouter.get(
    '/:id',
    validateId,
    async (req, res: Response<Robot | string>) => {
        const id = Number(req.params.id);

        try {
            const robot: Robot = await robotService.getRobotById(id);
            return res.send(robot);
        } catch (e: any) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    }
);
