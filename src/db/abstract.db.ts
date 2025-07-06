import db from '@/config/db-connection.config';

export default abstract class DB {
  protected db;

  constructor() {
    this.db = db;
  }
}
