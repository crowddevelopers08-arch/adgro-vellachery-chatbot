// Shared by the form (client) and the lead server action, which only accepts these exact answers.
export const budgetOptions = ["Yes, this works for me", "I’d like to know what’s included", "I need some time to plan the budget", "This is currently outside my budget"];

export const planningOptions = ["Less than 6 months", "1 year", "2 to 3 years", "I’ve just started exploring", "I’m unsure how to choose the right clinic", "Other"];

export const concernOptions = [
  "I’m afraid of the procedure",
  "I’m unsure how to choose the right clinic and doctor",
  "I’m not sure about the cost",
  "I’m worried about the results looking natural",
  "I’m concerned about recovery and aftercare",
  "Other",
];

export const questions = [
  { name: "budget", title: "Does this fit your budget?*", options: budgetOptions },
  { name: "planning", title: "How long have you been planning to get a hair transplant?*", options: planningOptions },
  { name: "concerns", title: "What is stopping you from getting a hair transplant done?*", options: concernOptions },
];

export const locationOptions = ["Yes, I’m comfortable with the location", "No, I’m not comfortable with the location"];
