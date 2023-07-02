import app from './app';
import { RobotRouter } from './robot/RobotRouter';

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

app.use('/api/robot', RobotRouter);

