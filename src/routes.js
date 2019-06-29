import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware); // Todas as rotas daqui para baixo só serão acessíveis se o usuário estiver logado

routes.put('/users', UserController.update);

export default routes;
