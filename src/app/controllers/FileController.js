import File from '../models/File';

class FileController {
  async store(req, res) {
    // Nomes que serão salvos no banco de dados.
    // O multer cria uma variável req.file com infos do arquivo
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
