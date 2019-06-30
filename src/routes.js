import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware); // Todas as rotas daqui para baixo só serão acessíveis se o usuário estiver logado

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

// upload.single('file') Quero dizer que o upload é de apenas um arquivo, e file é o nome que vai tá na requisição multPartFormData
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
