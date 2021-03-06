import ItemsControllers from './controllers/ItemsController';
import PointsController from './controllers/PointsController';
import express from 'express';

const routes = express.Router();
const pointsController = new PointsController();
const itemsControllers = new ItemsControllers();

// Items
routes.get('/items', itemsControllers.index);

// Points
routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;
