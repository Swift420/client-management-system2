const contactModel = require("../models/contactModel");
var validator = require("validator");
module.exports.getAllContacts = async (req, res) => {
  const contact = await contactModel.find();
  res.send(contact);
};

// module.exports.createContact = async (req, res) => {
//   const { id, name, surname, email, linkedClients } = req.body;
//   console.log(contact);
//   await contactModel.create(contact).then((data) => {
//     console.log("Saved Successfully");
//     res.status(201).send(data);
//   });
// };

module.exports.createContact = async (req, res) => {
  const { id, name, surname, email, linkedClients } = req.body;

  if (!name || !surname) {
    return res
      .status(400)
      .json({ error: "Please provide both name and surname." });
  }
  // Validate the email format
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }

  try {
    // Check if the email is already in use
    const existingContact = await contactModel.findOne({ email });
    if (existingContact) {
      console.log("reached 2");

      return res
        .status(409)
        .json({ error: "Email address is already in use." });
    }

    // Create the new contact if the email is valid and not in use
    const newContact = await contactModel.create({
      id,
      name,
      surname,
      email,
      linkedClients,
    });

    console.log("Contact saved successfully");
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the contact." });
  }
};

module.exports.updateContact = async (req, res) => {
  const { id, name, surname, email, linkedClients } = req.body;

  try {
    const updatedContact = await contactModel.findOneAndUpdate(
      { id: id },
      { name, surname, email, linkedClients },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ error: "Client not found." });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the client." });
  }
};
