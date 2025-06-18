import db from '../utils/db.js';

class User {
  constructor({ user_id, username, name, password, role }) {
    this.user_id = user_id;
    this.username = username;
    this.name = name;
    this.password = password;
    this.role = role;
  }

  static async getAll() {
    const users = await db('users');
    return users.map(user => new User(user));
  }

  static async getById(id) {
    const data = await db('users').where({ user_id: id }).first();
    return data ? new User(data) : null;
  }

  static async getByUsername(username) {
    const data = await db('users').where({ username }).first();
    return data ? new User(data) : null;
  }

  async save() {
    const [user] = await db('users').insert({
      username: this.username,
      name: this.name,
      password: this.password,
      role: this.role
    }).returning('*');
    Object.assign(this, user);
    return this;
  }

  static async delete(id) {
    return db('users').where({ user_id: id }).del();
  }
}

export default User;
