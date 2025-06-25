const yup = require("yup");

const itemSchema = yup.object({
  name: yup.string().required("Field 'name' is required and must be a string"),
  category: yup
    .string()
    .required("Field 'category' is required and must be a string"),
  price: yup
    .number()
    .required("Field 'price' is required and must be a number")
    .positive("Price must be greater than 0"),
});

async function schemaValidation(item) {
  try {
    await itemSchema.validate(item, { abortEarly: false });
    return null;
  } catch (err) {
    return err.errors;
  }
}
module.exports = { schemaValidation };
