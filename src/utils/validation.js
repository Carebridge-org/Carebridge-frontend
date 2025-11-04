export function validateJournal(formData) {
  const errors = {};

  if (!formData.resident) errors.resident = "Beboer er påkrævet.";
  if (!formData.title) errors.title = "Titel er påkrævet.";
  if (!formData.type) errors.type = "Type er påkrævet.";
  if (!formData.content) errors.content = "Indhold er påkrævet.";

  if (formData.title && formData.title.length > 140) {
    errors.title = "Titel må maks være 140 tegn.";
  }

  if (formData.content && formData.content.length < 5) {
    errors.content = "Indhold skal være mindst 5 tegn.";
  }

  const allowedRisks = ["LAV", "MIDDEL", "HØJ"];
  if (formData.riskAssessment && !allowedRisks.includes(formData.riskAssessment)) {
    errors.riskAssessment = "Ugyldigt risikoniveau.";
  }

  if (formData.tags) {
    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (tagsArray.length > 8) {
      errors.tags = "Maks 8 tags tilladt.";
    }

    const invalidTag = tagsArray.find((t) => !/^[\w-]+$/.test(t));
    if (invalidTag) {
      errors.tags = `Tag "${invalidTag}" indeholder ugyldige tegn.`;
    }
  }

  if (formData.attachments && formData.attachments.length > 5) {
    errors.attachments = "Maks 5 filer tilladt.";
  }

  if (formData.attachments) {
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    formData.attachments.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.attachments = `Filen "${file.name}" har ikke en tilladt filtype.`;
      } else if (file.size > maxFileSize) {
        errors.attachments = `Filen "${file.name}" er for stor (max 5MB).`;
      }
    });
  }

  return errors;
}
