import { user } from '../schema';
import DB from '../abstract.db';
import { NotFoundError } from '@/errors/not-found.error';

export default class UserModel extends DB {
  async list() {
    const result = await this.db.select().from(user);

    return result;
  }

  async getById(id: string) {
    const result = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });

    if (!result) throw new NotFoundError('User not found');

    return result;
  }
}
