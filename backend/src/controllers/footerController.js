const FooterService = require("../services/FooterService");

exports.createFooter = async (req, res) => {
  const footer = await FooterService.create(req.body);
  res.status(201).json({ success: true, data: footer });
};

exports.getFooters = async (req, res) => {
  const footers = await FooterService.getAll();
  res.json({ success: true, data: footers });
};

exports.getFooter = async (req, res) => {
  const footer = await FooterService.getById(req.params.id);
  res.json({ success: true, data: footer });
};

exports.updateFooter = async (req, res) => {
  const footer = await FooterService.update(req.params.id, req.body);
  res.json({ success: true, data: footer });
};

exports.deleteFooter = async (req, res) => {
  await FooterService.delete(req.params.id);
  res.json({ success: true, message: "Footer deleted" });
};
