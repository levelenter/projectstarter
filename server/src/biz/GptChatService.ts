import { Rest } from './generated/@Rest';
import { Response } from './generated/Response';
import { Configuration, OpenAIApi } from "openai";
export class GptChatService {
  // connection!: PoolConnection;
  /**
   * メッセージを受け取る
   * 
  {
    "id": "chatcmpl-6q0R0zyPMQJ1xpGrODmr2Fk75pvPn",
    "object": "chat.completion",
    "created": 1677852746,
    "model": "gpt-3.5-turbo-0301",
    "usage": {
      "prompt_tokens": 27,
      "completion_tokens": 135,
      "total_tokens": 162
    },
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "\n\n「てst」という言葉は、正しいスペルが「test」であり、テストや試験を意味します。特に、学校や仕事などで、知識やスキルの測定や評価を目的として行われるものを指します。テストは、筆記試験や実技試験など様々な形式があり、合格や不合格などの結果が出されます。"
        },
        "finish_reason": "stop",
        "index": 0
      }
    ]
  }
   */
  @Rest('/v1/GptChatService/sendMessage', 'post',false)
  async sendMessage(message:string): Promise<Response<any>> {
    console.log("GptChatService#sendMessage" , message)
    const apiKey = "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"
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    // const prompt =  `
    // Answer the following questions as best you can. You have access to the following tools:
    
    // Google Search: A wrapper around Google Search. Useful for when you need to answer questions about current events. Input should be a search query.
    
    // Use the following format:
    
    // Question: the input question you must answer
    // Thought: you should always think about what to do
    // Action: the action to take, should be one of [Google Search]
    // Action Input: the input to the action
    // Observation: the result of the action
    // ... (this Thought/Action/Action Input/Observation can repeat N times)
    // Thought: I now know the final answer
    // Final Answer: the final answer to the original input question
    
    // Question: ${message}
    // Thought:`;
    
    const prompt = `${ message }`
    const gptResponse = await openai.createChatCompletion(
      {
        model:"gpt-3.5-turbo",
        messages:[{ role:"assistant", name:"dai", content:prompt}],
        temperature:0.6
      }
    )
    
    const result = gptResponse.data
    console.log("GptChatService#sendMessage#result" , result)

    return new Response<any>(result.choices[0]);
  }
}


