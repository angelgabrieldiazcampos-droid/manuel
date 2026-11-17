// Constants for Google Form
const REALTIME_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdZI8DzQ4baj-Sl8oDuNVnkIfjds8o3n1HDmuwXD3dKScquqQ/formResponse";
const SESSION_ID_FIELD = "entry.1378149903";
const GROUP_FIELD = "entry.66122651";
const FACTORY_FIELD = "entry.1367589106";
const QUESTION_NUM_FIELD = "entry.2021368631";
const ANSWER_TEXT_FIELD = "entry.400534341";
const FINAL_FEEDBACK_FIELD = "entry.1677109584";
const SCORE_FIELD = "entry.55841423";

interface SubmissionData {
  sessionId: string;
  group: string;
  factory: string;
  question?: string;
  answer?: string;
  score?: string;
  finalFeedback?: string;
}

export const sendRealTimeUpdate = async (data: SubmissionData) => {
  const formData = new FormData();
  formData.append(SESSION_ID_FIELD, data.sessionId);
  formData.append(GROUP_FIELD, data.group);
  formData.append(FACTORY_FIELD, data.factory);

  if (data.question) formData.append(QUESTION_NUM_FIELD, data.question);
  if (data.answer) formData.append(ANSWER_TEXT_FIELD, data.answer);
  if (data.score) formData.append(SCORE_FIELD, data.score);
  if (data.finalFeedback) formData.append(FINAL_FEEDBACK_FIELD, data.finalFeedback);

  try {
    await fetch(REALTIME_FORM_ACTION_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });
    // Since mode is no-cors, we can't really read the response, but it submits.
    return true;
  } catch (error) {
    console.error('Error sending real-time update:', error);
    return false;
  }
};
