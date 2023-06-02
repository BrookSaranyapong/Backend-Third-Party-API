const dotenv = require("dotenv");
dotenv.config();
const { Configuration, OpenAIApi } = require("openai");
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.error("OPENAI_API_KEY is not set");
  process.exit(1);
}

const configuration = new Configuration({
  apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

exports.summaryController = async (req, res) => {
  try {
    const { text } = req.body;
    const message = [
      {
        role: "system",
        content: `You are a translator from plain English to Thai.`,
      },
      {
        role: "user",
        content: `Convert the following natural language description into a SQL query:\n\nShow all all the elements in the table users`,
      },
      { role: "assistant", content: "SELECT * FROM users;" },
      {
        role: "user",
        content: `Convert the following natural language description into a SQL query:\n\n${text}`,
      },
    ];
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
      max_tokens: 500,
    });

    if (data.choices[0].message.content) {
      return res.status(200).json(data.choices[0].message.content);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err.message,
    });
  }
};
// high light the word thai meaning and pronunciation

exports.dictionary = async (req, res) => {
  try {
    const { text } = req.body;
    const wordToHighlight = "รู้จัก";
    const highlightedText = `Please analyze the following Thai text and highlight the word ${text}, providing its pronunciation and meaning`;
    const highlightedText2 = `converting ${text} to sentences`;
    const thaiText = "สวัสดีครับ ยินดีที่ได้รู้จักคุณ";
    const thaiText1 = "คุณจะรู้ว่าโทษถ้าคุณล้มเหลว";
    const highlightedThaiText = thaiText.replace(
      new RegExp(`(${wordToHighlight})`, "g"),
      "[$1]"
    );
    const highlightedThaiText2 = thaiText1.replace(
      new RegExp(`(${wordToHighlight})`, "g"),
      "[$1]"
    );

    const message = [
      {
        role: "system",
        content: `Dictionary highlight the word and see the pronunciation and meaning`,
      },
      { role: "assistant", content: highlightedText },
      { role: "user", content: highlightedThaiText },
      { role: "user", content: highlightedThaiText2 },
      {
        role: "user",
        content: `Convert the following natural language description into English language:\n\n${text}`,
      },
      { role: "assistant", content: highlightedText2 },
    ];
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
      max_tokens: 500,
    });

    if (data.choices[0].message.content) {
      return res.status(200).json(data.choices[0].message.content);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err.message,
    });
  }
};
exports.dictionaryTh = async (req, res) => {
  try {
    const { text } = req.body;
    const highlightedText2 = `converting word ${text} to sentences`;
    const thaiText = "ประโยคในภาษาไทย :";
    const highlightedThaiText = thaiText.replace(
      new RegExp(`(${text})`, "g"),
      "[$1]"
    );

    const message = [
      {
        role: "system",
        content: `Thai Dictionary highlight the word and see the pronunciation and meaning`,
      },
      { role: "user", content:`Please analyze the following Thai text and highlight the word ${text}, providing it's to Thai pronunciation and Thai meaning: ${text}:` },
      { role: "user", content: highlightedThaiText },
      { role: "assistant", content: highlightedText2 + " to Thai language" },
    ];
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
      max_tokens: 500,
    });

    if (data.choices[0].message.content) {
      return res.status(200).json(data.choices[0].message.content);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err.message,
    });
  }
};

exports.MagicWrite = async (req, res) => {
  try {
    const { text } = req.body;
    // Prepare the system and user message 
    const textuser = `As a proficient proofreader of the Thai language, I require your expertise to meticulously proofread and refine a ${text}. I am seeking your assistance in addressing common issues encountered by Thai language learners, including spelling errors, grammar mistakes, word choice, lack of coherence and organization, failure to use appropriate honorifics, over-reliance on informal language, and lack of proofreading and editing. Please thoroughly review the text, correcting any errors and suggesting improvements where necessary. Your meticulous attention to detail, knowledge of Thai grammar and vocabulary, and ability to enhance clarity and coherence will be instrumental in transforming this text into a polished and refined piece of writing. Your dedicated efforts as a proofreader will greatly contribute to the text's overall effectiveness and impact`;

    const message = [
      {
        role: "system",
        content: `Magic Write ( Write a few sentences and let Thaiwrite take care of the rest)`,
      },
      { role: "user", content: textuser },
      {
        role: "assistant",
        content: ` Please provide me with the ${text} you would like me to proofread and refine while adhering to the honorific rules of the Thai language, using conjunctions, and making the ${text} formal.`,
      },
    ];
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
      max_tokens: 500,
    });

    if (data.choices[0].message.content) {
      return res.status(200).json(data.choices[0].message.content);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err.message,
    });
  }
};

// ปรับแต่งการเขียน synonym 

exports.CustomizeWriting = async (req, res) => {
  try {
    const { text } = req.body;
    const message = [
      {
        role: "system",
        content: `add synonym ( Write a few sentences and let Thaiwrite take care of the rest)`,
      },
      {
        role: "user",
        content: `Please analyze the following Thai text and highlight the word "${text}", providing its Thai pronunciation and Thai meaning. Remember Please use Thai Text. Additionally, suggest alternative Thai words that can be used in its place:`,
      },
    ];
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
      max_tokens: 500,
    });

    if (data.choices[0].message.content) {
      return res.status(200).json(data.choices[0].message.content);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err.message,
    });
  }
};