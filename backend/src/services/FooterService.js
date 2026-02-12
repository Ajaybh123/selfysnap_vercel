const Footer = require("../models/Footer");

class FooterService {
  static async create(data) {
    return await Footer.create(data);
  }

  static async getAll() {
    return await Footer.find();
  }

  static async getById(id) {
    return await Footer.findById(id);
  }

  static async update(id, data) {
    return await Footer.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id) {
    return await Footer.findByIdAndDelete(id);
  }
}

module.exports = FooterService;
