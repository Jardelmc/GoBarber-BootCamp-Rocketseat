import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    /**
     *  Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // parseISO transforma a data passada pelo req em um objeto date, que pode ser usado pelo método startOfHour, que descarta os minutos e segundos e pega só a hora
    const hourStart = startOfHour(parseISO(date));

    /**
     * Check if date has past
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    /**
     * Check date avaliability
     */

    const checkAvaliability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvaliability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not avaliable' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId, // Vem do token
      provider_id, // req.body
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
