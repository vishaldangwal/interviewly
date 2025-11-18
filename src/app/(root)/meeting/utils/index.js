function convertQuestionFormat(newQuestions) {
  return newQuestions.map((question) => {
    const starterCode = {};

    question.starterCode.forEach((item) => {
      starterCode[item.lang] = item.code;
    });

    return {
      id: question.q_id,
      title: question.title,
      description: question.description,
      examples: question.examples.map((example) => ({
        input: example.input,
        output: example.output,
        explanation: example.explanation,
      })),
      constraints: question.constraints,
      starterCode: starterCode,
    };
  });
}
export default convertQuestionFormat;
