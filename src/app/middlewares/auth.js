import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // Função que pega uma função de callback e transforma em outra que possibilita usar async e await

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' '); // Padrão Bearer. Bearer é a primeira palavra, separada por espaço, daí vem o token
  // Seria um array de 2 posições. To dizendo que só quero usar a segunda posição

  try {
    // A função abaixo transforma jwt.verify que é de callback em uma async await
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // Se deu tudo certo com a verificação, a variável decoded vai estar preenchida com o que foi passado dentro do payload do token (id)

    req.userId = decoded.id; // Uma vez que deu tudo certo no login, posso adicionar o Id do usuário dentro da req, pois assim é possível fazer um update no usuário sem precisar passar o id pela url

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
