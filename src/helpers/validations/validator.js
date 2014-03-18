export default function validate(validations, s) {
  for (var i in validations) {
    if (!validations[i].isValid(s)) {
      return false;
    }
  }

  return true;
}
