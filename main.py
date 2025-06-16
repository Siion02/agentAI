# Complex main with tool requests to the LLM model.

import json
from model_usage.model_router import ModelRouter
from tools import tool_implementations

def load_tools():
    with open("tools/tool_definitions.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["tools"]

def main():
    router = ModelRouter()
    tools = load_tools()

    user_prompt = "What is the capital of Spain"
    preferred_model = "llama3"

    client, model_id, base_prompt = router.get_client(preferred_model)

    messages = [
        {"role": "system", "content": base_prompt},
        {"role": "user", "content": user_prompt}
    ]

    while True:
        print("Calling LLM...")

        tools = [
            {
                "name": "capital",
                "description": "return capital of a country",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "Name of the country"
                        }
                    },
                    "required": ["name"]
                }
            }
        ]

        response = router.route(user_prompt, preferred_model=preferred_model, tools=tools, messages=messages)

        choice = response.choices[0]
        message = choice.message
        messages.append(message)

        if hasattr(message, "tool_calls") and message.tool_calls:
            for tool_call in message.tool_calls:
                tool_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)

                print(f"\nCalling tool: {tool_name} with args: {arguments}")
                tool_response = tool_implementations.call_tool(tool_name, arguments)

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": tool_response
                })
        else:
            print("Final LLM response:")
            print(message.content)
            break

if __name__ == "__main__":
    main()