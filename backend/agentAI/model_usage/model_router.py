import json
import os
import configparser
from openai import OpenAI
from tools.tool_implementations import call_tool, inject_tool_args, TOOL_ARGUMENT_INJECTIONS

class ModelRouter:
    def __init__(self, models_path="model_usage/models"):
        self.models_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'models')
        self.models = {}
        self.load_models()

    def load_models(self):
        for model_name in os.listdir(self.models_path):
            model_dir = os.path.join(self.models_path, model_name)
            if os.path.isdir(model_dir):
                config_path = os.path.join(model_dir, "config.ini")
                prompt_path = os.path.join(model_dir, "query_prompt.txt")
                if os.path.exists(config_path) and os.path.exists(prompt_path):
                    config = configparser.ConfigParser()
                    config.read(config_path)
                    base_url = config.get("model", "base_url")
                    api_key_env = config.get("model", "api_key_env")
                    model_id = config.get("model", "model_name")
                    api_key = os.getenv(api_key_env)
                    with open(prompt_path, "r", encoding="utf-8") as f:
                        prompt = f.read()
                    self.models[model_name] = {
                        "base_url": base_url,
                        "api_key": api_key,
                        "model_id": model_id,
                        "prompt": prompt
                    }

    def get_client(self, model_name):
        config = self.models.get(model_name)
        if not config:
            raise ValueError(f"Model {model_name} not found")
        client = OpenAI(base_url=config["base_url"], api_key=config["api_key"])
        return client, config["model_id"], config["prompt"]

    async def route(
            self,
            preferred_model: str = None,
            tools: list = None,
            messages: list = None,
            injection_context: dict = None
    ):
        model_name = preferred_model
        client, model_id, base_prompt = self.get_client(model_name)

        while True:
            response = client.chat.completions.create(
                model=model_id,
                messages=messages,
                tools=tools,
                tool_choice="auto",
            )

            assistant_message = response.choices[0].message
            messages.append(assistant_message)

            tool_calls = assistant_message.tool_calls
            if not tool_calls:
                return response  # Respuesta final del agente

            for call in tool_calls:
                tool_name = call.function.name
                args = json.loads(call.function.arguments)

                if injection_context:
                    args = inject_tool_args(tool_name, args, injection_context)

                result = await call_tool(tool_name, args)

                messages.append({
                    "role": "tool",
                    "tool_call_id": call.id,
                    "name": tool_name,
                    "content": result
                })